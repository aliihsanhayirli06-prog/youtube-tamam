import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { createHmac } from 'crypto'
import { PlanTier, SubscriptionStatus } from '@prisma/client'

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      update: vi.fn()
    },
    subscription: {
      upsert: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn()
    }
  }
}))

import { prisma } from '@/lib/db'
describe('api/stripe/webhook', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
    process.env.STRIPE_PRICE_PRO_MONTHLY = 'price_pro_monthly'
    process.env.STRIPE_PRICE_PRO_YEARLY = 'price_pro_yearly'
    process.env.STRIPE_PRICE_PREMIUM_MONTHLY = 'price_premium_monthly'
    process.env.STRIPE_PRICE_PREMIUM_YEARLY = 'price_premium_yearly'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  const sign = (payload: string, secret: string, timestamp = '123') => {
    const signedPayload = `${timestamp}.${payload}`
    const signature = createHmac('sha256', secret).update(signedPayload).digest('hex')
    return `t=${timestamp},v1=${signature}`
  }

  it('rejects invalid signatures', async () => {
    vi.resetModules()
    const { POST } = await import('@/app/api/stripe/webhook/route')
    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      body: '{}',
      headers: { 'stripe-signature': 't=1,v1=bad' }
    }))
    expect(response.status).toBe(400)
  })

  it('handles checkout.session.completed', async () => {
    const payload = JSON.stringify({
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: 'u1',
          metadata: { plan: 'PRO' },
          subscription: 'sub_1',
          customer: 'cus_1',
          current_period_start: 10,
          current_period_end: 20
        }
      }
    })
    const signature = sign(payload, process.env.STRIPE_WEBHOOK_SECRET as string)

    vi.resetModules()
    const { POST } = await import('@/app/api/stripe/webhook/route')
    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      body: payload,
      headers: { 'stripe-signature': signature }
    }))
    const data = await response.json()
    expect(data.received).toBe(true)
    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'u1' },
      data: expect.objectContaining({ plan: PlanTier.PRO })
    }))
    expect(prisma.subscription.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { providerSubscriptionId: 'sub_1' },
      update: expect.objectContaining({ status: SubscriptionStatus.ACTIVE })
    }))
  })

  it('handles subscription updates without subscription id', async () => {
    ;(prisma.subscription.findFirst as any).mockResolvedValue(null)
    const payload = JSON.stringify({
      type: 'customer.subscription.updated',
      data: {
        object: {
          metadata: { userId: 'u2' },
          items: { data: [{ price: { id: 'price_premium_monthly' } }] },
          status: 'past_due'
        }
      }
    })
    const signature = sign(payload, process.env.STRIPE_WEBHOOK_SECRET as string)

    vi.resetModules()
    const { POST } = await import('@/app/api/stripe/webhook/route')
    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      body: payload,
      headers: { 'stripe-signature': signature }
    }))
    const data = await response.json()
    expect(data.received).toBe(true)
    expect(prisma.subscription.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ plan: PlanTier.PREMIUM, status: SubscriptionStatus.PAST_DUE })
    }))
  })
})
