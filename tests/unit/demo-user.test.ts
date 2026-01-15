import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn()
    }
  }
}))

import { prisma } from '@/lib/db'
import { getOrCreateDemoUser } from '@/lib/demo-user'

describe('getOrCreateDemoUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns existing user when found', async () => {
    ;(prisma.user.findUnique as any).mockResolvedValue({ id: 'u1', email: 'demo@autotube.ai' })
    const result = await getOrCreateDemoUser()
    expect(result?.id).toBe('u1')
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('creates demo user when missing', async () => {
    ;(prisma.user.findUnique as any).mockResolvedValue(null)
    ;(prisma.user.create as any).mockResolvedValue({ id: 'u2', email: 'demo@autotube.ai' })
    const result = await getOrCreateDemoUser()
    expect(prisma.user.create).toHaveBeenCalled()
    expect(result?.id).toBe('u2')
  })
})
