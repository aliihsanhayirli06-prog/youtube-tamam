import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/lib/demo-user', () => ({
  getOrCreateDemoUser: vi.fn().mockResolvedValue({ id: 'u1', email: 'demo@autotube.ai' })
}))

describe('api/stripe/checkout', () => {
  const originalFetch = global.fetch
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = ''
    process.env.STRIPE_PRICE_PRO_MONTHLY = 'price_pro_monthly'
    process.env.STRIPE_PRICE_PRO_YEARLY = 'price_pro_yearly'
    process.env.STRIPE_PRICE_PREMIUM_MONTHLY = 'price_premium_monthly'
    process.env.STRIPE_PRICE_PREMIUM_YEARLY = 'price_premium_yearly'
  })

  afterEach(() => {
    global.fetch = originalFetch
    process.env = { ...originalEnv }
  })

  it('returns 500 when secret missing', async () => {
    vi.resetModules()
    const { POST } = await import('@/app/api/stripe/checkout/route')
    const response = await POST(new Request('http://localhost', { method: 'POST', body: '{}' }))
    expect(response.status).toBe(500)
  })

  it('returns 400 when price id missing', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test'
    vi.resetModules()
    const { POST } = await import('@/app/api/stripe/checkout/route')
    const response = await POST(new Request('http://localhost', { method: 'POST', body: JSON.stringify({ plan: 'invalid' }) }))
    expect(response.status).toBe(400)
  })

  it('creates checkout session', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test'
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://stripe.test/checkout' })
    }) as any

    vi.resetModules()
    const { POST } = await import('@/app/api/stripe/checkout/route')
    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
      body: JSON.stringify({ plan: 'pro', billingCycle: 'monthly' })
    }))
    const data = await response.json()
    expect(data.url).toContain('stripe.test')
  })
})
