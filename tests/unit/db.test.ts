import { describe, expect, it, beforeEach, vi } from 'vitest'

const PrismaClientMock = vi.fn(function PrismaClientMock(this: any) {
  return { mock: true }
})

vi.mock('@prisma/client', () => ({
  PrismaClient: PrismaClientMock
}))

describe('db', () => {
  beforeEach(() => {
    vi.resetModules()
    PrismaClientMock.mockClear()
    delete (globalThis as any).prisma
  })

  it('stores prisma on global in non-production', async () => {
    process.env.NODE_ENV = 'development'
    const { prisma } = await import('@/lib/db')
    expect(PrismaClientMock).toHaveBeenCalledTimes(1)
    expect((globalThis as any).prisma).toBe(prisma)
  })

  it('does not store prisma on global in production', async () => {
    process.env.NODE_ENV = 'production'
    const { prisma } = await import('@/lib/db')
    expect(PrismaClientMock).toHaveBeenCalledTimes(1)
    expect((globalThis as any).prisma).toBeUndefined()
    expect(prisma).toBeDefined()
  })
})
