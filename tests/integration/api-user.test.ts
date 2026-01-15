import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@/lib/demo-user', () => ({
  getOrCreateDemoUser: vi.fn()
}))

vi.mock('@/lib/credits', () => ({
  ensureDailyCredits: vi.fn()
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    subscription: {
      findFirst: vi.fn()
    }
  }
}))

import { GET } from '@/app/api/user/route'
import { getOrCreateDemoUser } from '@/lib/demo-user'
import { ensureDailyCredits } from '@/lib/credits'
import { prisma } from '@/lib/db'

describe('user API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns user and subscription', async () => {
    ;(getOrCreateDemoUser as any).mockResolvedValue({
      id: 'u1',
      name: 'Demo',
      email: 'demo@autotube.ai',
      plan: 'FREE',
      creditsBalance: 5,
      referralCode: 'REF1'
    })
    ;(ensureDailyCredits as any).mockResolvedValue({
      id: 'u1',
      name: 'Demo',
      email: 'demo@autotube.ai',
      plan: 'FREE',
      creditsBalance: 5,
      referralCode: 'REF1'
    })
    ;(prisma.subscription.findFirst as any).mockResolvedValue(null)

    const response = await GET()
    const data = await response.json()
    expect(data.user.email).toBe('demo@autotube.ai')
    expect(data.user.creditsBalance).toBe(5)
    expect(data.subscription).toBeNull()
  })
})
