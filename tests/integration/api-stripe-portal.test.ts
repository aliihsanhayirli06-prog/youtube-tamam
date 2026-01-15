import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/lib/demo-user', () => ({
  getOrCreateDemoUser: vi.fn().mockResolvedValue({ id: 'u1', email: 'demo@autotube.ai' })
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    subscription: {
      findFirst: vi.fn()
    }
  }
}))

import { prisma } from '@/lib/db'
describe('api/stripe/portal', () => {
  const originalFetch = global.fetch
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = ''
  })

  afterEach(() => {
    global.fetch = originalFetch
    process.env = { ...originalEnv }
  })

  it('returns 500 when secret missing', async () => {
    vi.resetModules()
    const { POST } = await import('@/app/api/stripe/portal/route')
    const response = await POST(new Request('http://localhost', { method: 'POST' }))
    expect(response.status).toBe(500)
  })

  it('returns 404 when customer missing', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test'
    ;(prisma.subscription.findFirst as any).mockResolvedValue(null)
    vi.resetModules()
    const { POST } = await import('@/app/api/stripe/portal/route')
    const response = await POST(new Request('http://localhost', { method: 'POST' }))
    expect(response.status).toBe(404)
  })

  it('creates portal session', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test'
    ;(prisma.subscription.findFirst as any).mockResolvedValue({ providerCustomerId: 'cus_123' })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://stripe.test/portal' })
    }) as any

    vi.resetModules()
    const { POST } = await import('@/app/api/stripe/portal/route')
    const response = await POST(new Request('http://localhost', { method: 'POST', headers: { origin: 'http://localhost:3000' } }))
    const data = await response.json()
    expect(data.url).toContain('stripe.test')
  })
})
