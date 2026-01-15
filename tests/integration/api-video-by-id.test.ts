import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    video: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}))

import { prisma } from '@/lib/db'
import { GET, PATCH, DELETE } from '@/app/api/videos/[id]/route'

describe('api/videos/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns video when found', async () => {
    ;(prisma.video.findUnique as any).mockResolvedValue({ id: 'v1' })
    const response = await GET(new Request('http://localhost'), { params: { id: 'v1' } })
    const data = await response.json()
    expect(data.item.id).toBe('v1')
  })

  it('returns 404 when missing', async () => {
    ;(prisma.video.findUnique as any).mockResolvedValue(null)
    const response = await GET(new Request('http://localhost'), { params: { id: 'missing' } })
    expect(response.status).toBe(404)
  })

  it('updates video', async () => {
    ;(prisma.video.update as any).mockResolvedValue({ id: 'v1', status: 'PUBLISHED' })
    const response = await PATCH(new Request('http://localhost', { method: 'PATCH', body: JSON.stringify({ status: 'PUBLISHED' }) }), { params: { id: 'v1' } })
    const data = await response.json()
    expect(data.item.status).toBe('PUBLISHED')
  })

  it('deletes video', async () => {
    ;(prisma.video.delete as any).mockResolvedValue({ id: 'v1' })
    const response = await DELETE(new Request('http://localhost', { method: 'DELETE' }), { params: { id: 'v1' } })
    const data = await response.json()
    expect(data.ok).toBe(true)
  })

  it('returns 400 on invalid patch body', async () => {
    const response = await PATCH(new Request('http://localhost', { method: 'PATCH', body: 'bad' }), { params: { id: 'v1' } })
    expect(response.status).toBe(400)
  })
})
