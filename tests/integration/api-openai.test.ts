import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

describe('api/openai', () => {
  const originalFetch = global.fetch
  const originalApiKey = process.env.OPENAI_API_KEY

  beforeEach(() => {
    process.env.OPENAI_API_KEY = ''
  })

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalApiKey
    global.fetch = originalFetch
  })

  it('returns 500 when api key is missing', async () => {
    vi.resetModules()
    const { POST } = await import('@/app/api/ai/openai/route')
    const response = await POST(new Request('http://localhost', { method: 'POST', body: '{}' }))
    expect(response.status).toBe(500)
  })

  it('returns 400 for invalid json', async () => {
    process.env.OPENAI_API_KEY = 'key'
    vi.resetModules()
    const { POST } = await import('@/app/api/ai/openai/route')
    const response = await POST(new Request('http://localhost', { method: 'POST', body: 'not-json' }))
    expect(response.status).toBe(400)
  })

  it('proxies openai response', async () => {
    process.env.OPENAI_API_KEY = 'key'
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ choices: [{ message: { content: 'ok' } }] })
    }) as any

    vi.resetModules()
    const { POST } = await import('@/app/api/ai/openai/route')
    const response = await POST(new Request('http://localhost', { method: 'POST', body: JSON.stringify({ prompt: 'hi' }) }))
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.choices[0].message.content).toBe('ok')
  })
})
