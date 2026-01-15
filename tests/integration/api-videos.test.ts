import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    video: {
      findMany: vi.fn(),
      create: vi.fn()
    },
    user: {
      findUnique: vi.fn(),
      create: vi.fn()
    },
    channel: {
      findFirst: vi.fn(),
      create: vi.fn()
    }
  }
}))

import { prisma } from '@/lib/db'
import { GET, POST } from '@/app/api/videos/route'

describe('api/videos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists videos', async () => {
    ;(prisma.video.findMany as any).mockResolvedValue([{ id: 'v1' }])
    const response = await GET()
    const data = await response.json()
    expect(data.items).toHaveLength(1)
  })

  it('creates video with demo user and channel', async () => {
    ;(prisma.user.findUnique as any).mockResolvedValue(null)
    ;(prisma.user.create as any).mockResolvedValue({ id: 'u1', email: 'demo@autotube.ai' })
    ;(prisma.channel.findFirst as any).mockResolvedValue(null)
    ;(prisma.channel.create as any).mockResolvedValue({ id: 'c1', userId: 'u1' })
    ;(prisma.video.create as any).mockResolvedValue({ id: 'v1', title: 'Runway Video' })

    const response = await POST(new Request('http://localhost', { method: 'POST', body: JSON.stringify({ promptText: 'Prompt' }) }))
    const data = await response.json()
    expect(response.status).toBe(201)
    expect(data.item.id).toBe('v1')
  })

  it('returns 400 for invalid json', async () => {
    const response = await POST(new Request('http://localhost', { method: 'POST', body: 'bad' }))
    expect(response.status).toBe(400)
  })
})
