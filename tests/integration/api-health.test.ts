import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    $queryRaw: vi.fn()
  }
}))

import { prisma } from '@/lib/db'
import { GET } from '@/app/api/health/route'

describe('api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns ok when db is up', async () => {
    ;(prisma.$queryRaw as any).mockResolvedValue(1)
    const response = await GET()
    const data = await response.json()
    expect(data.ok).toBe(true)
  })

  it('returns error when db is down', async () => {
    ;(prisma.$queryRaw as any).mockRejectedValue(new Error('down'))
    const response = await GET()
    expect(response.status).toBe(500)
  })
})
