import { describe, expect, it, vi, beforeEach } from 'vitest'
import { PlanTier } from '@prisma/client'

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn()
    }
  }
}))

import { prisma } from '@/lib/db'
import { ensureDailyCredits, getPlanCreditAllowance } from '@/lib/credits'

describe('credits', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns plan allowance', () => {
    expect(getPlanCreditAllowance(PlanTier.FREE)).toBe(5)
    expect(getPlanCreditAllowance(PlanTier.PRO)).toBe(200)
    expect(getPlanCreditAllowance(PlanTier.PREMIUM)).toBe(1000)
  })

  it('returns user when not FREE', async () => {
    ;(prisma.user.findUnique as any).mockResolvedValue({
      id: 'u1',
      plan: PlanTier.PRO
    })
    const result = await ensureDailyCredits('u1')
    expect(result?.plan).toBe(PlanTier.PRO)
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it('resets daily credits for FREE plan', async () => {
    const yesterday = new Date('2024-01-14T10:00:00Z')
    ;(prisma.user.findUnique as any).mockResolvedValue({
      id: 'u1',
      plan: PlanTier.FREE,
      creditsResetAt: yesterday
    })
    ;(prisma.user.update as any).mockResolvedValue({
      id: 'u1',
      plan: PlanTier.FREE,
      creditsBalance: 5
    })
    const result = await ensureDailyCredits('u1')
    expect(prisma.user.update).toHaveBeenCalled()
    expect(result?.creditsBalance).toBe(5)
  })

  it('keeps credits when already reset today', async () => {
    const today = new Date()
    ;(prisma.user.findUnique as any).mockResolvedValue({
      id: 'u1',
      plan: PlanTier.FREE,
      creditsResetAt: today,
      creditsBalance: 5
    })
    const result = await ensureDailyCredits('u1')
    expect(prisma.user.update).not.toHaveBeenCalled()
    expect(result?.creditsBalance).toBe(5)
  })
})
