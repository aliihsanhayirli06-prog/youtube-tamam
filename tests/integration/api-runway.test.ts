import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

describe('api/runway', () => {
  const originalFetch = global.fetch
  const originalApiKey = process.env.RUNWAY_API_KEY

  beforeEach(() => {
    process.env.RUNWAY_API_KEY = ''
  })

  afterEach(() => {
    process.env.RUNWAY_API_KEY = originalApiKey
    global.fetch = originalFetch
  })

  it('returns 500 when api key is missing', async () => {
    vi.resetModules()
    const { POST } = await import('@/app/api/ai/runway/route')
    const response = await POST(new Request('http://localhost', { method: 'POST', body: '{}' }))
    expect(response.status).toBe(500)
  })

  it('returns 400 for invalid json', async () => {
    process.env.RUNWAY_API_KEY = 'key'
    vi.resetModules()
    const { POST } = await import('@/app/api/ai/runway/route')
    const response = await POST(new Request('http://localhost', { method: 'POST', body: 'bad' }))
    expect(response.status).toBe(400)
  })

  it('returns 400 when missing id on GET', async () => {
    process.env.RUNWAY_API_KEY = 'key'
    vi.resetModules()
    const { GET } = await import('@/app/api/ai/runway/route')
    const response = await GET(new Request('http://localhost'))
    expect(response.status).toBe(400)
  })

  it('proxies runway post and get responses', async () => {
    process.env.RUNWAY_API_KEY = 'key'
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ id: 'task-1', status: 'QUEUED' })
    }) as any

    vi.resetModules()
    const { POST } = await import('@/app/api/ai/runway/route')
    const postResponse = await POST(new Request('http://localhost', { method: 'POST', body: JSON.stringify({ prompt: 'hi' }) }))
    const postData = await postResponse.json()
    expect(postData.id).toBe('task-1')

    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ status: 'SUCCEEDED' })
    }) as any
    vi.resetModules()
    const { GET } = await import('@/app/api/ai/runway/route')
    const getResponse = await GET(new Request('http://localhost?id=task-1'))
    const getData = await getResponse.json()
    expect(getData.status).toBe('SUCCEEDED')
  })
})
