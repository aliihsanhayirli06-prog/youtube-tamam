import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@/lib/demo-user', () => ({
  getOrCreateDemoUser: vi.fn()
}))

vi.mock('@prisma/client', () => ({
  CreditReason: {
    PURCHASE: 'PURCHASE',
    SPEND_SCRIPT: 'SPEND_SCRIPT',
    SPEND_TREND: 'SPEND_TREND'
  }
}))

vi.mock('@/lib/credits', () => ({
  ensureDailyCredits: vi.fn()
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      update: vi.fn()
    },
    creditTransaction: {
      findMany: vi.fn()
    }
  }
}))

import { GET, POST } from '@/app/api/credits/route'
import { getOrCreateDemoUser } from '@/lib/demo-user'
import { ensureDailyCredits } from '@/lib/credits'
import { prisma } from '@/lib/db'

describe('credits API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns balance and transactions', async () => {
    ;(getOrCreateDemoUser as any).mockResolvedValue({ id: 'u1', plan: 'FREE', creditsBalance: 5 })
    ;(ensureDailyCredits as any).mockResolvedValue({ id: 'u1', plan: 'FREE', creditsBalance: 5 })
    ;(prisma.creditTransaction.findMany as any).mockResolvedValue([])

    const response = await GET()
    const data = await response.json()
    expect(data.balance).toBe(5)
    expect(data.plan).toBe('FREE')
  })

  it('returns error on insufficient credits', async () => {
    ;(getOrCreateDemoUser as any).mockResolvedValue({ id: 'u1', plan: 'FREE', creditsBalance: 1 })
    ;(ensureDailyCredits as any).mockResolvedValue({ id: 'u1', plan: 'FREE', creditsBalance: 1 })

    const request = new Request('http://localhost/api/credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'spend', amount: 5 })
    })
    const response = await POST(request)
    expect(response.status).toBe(402)
  })

  it('adds credits', async () => {
    ;(getOrCreateDemoUser as any).mockResolvedValue({ id: 'u1', plan: 'FREE', creditsBalance: 1 })
    ;(ensureDailyCredits as any).mockResolvedValue({ id: 'u1', plan: 'FREE', creditsBalance: 1 })
    ;(prisma.user.update as any).mockResolvedValue({ creditsBalance: 11 })

    const request = new Request('http://localhost/api/credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', amount: 10 })
    })
    const response = await POST(request)
    const data = await response.json()
    expect(data.balance).toBe(11)
  })
})
