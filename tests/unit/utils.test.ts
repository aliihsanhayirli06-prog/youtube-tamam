import { describe, expect, it } from 'vitest'
import { cn, formatDate, formatNumber } from '@/lib/utils'

describe('utils', () => {
  it('cn merges classes', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })

  it('formatNumber formats values', () => {
    expect(formatNumber(999)).toBe('999')
    expect(formatNumber(1_200)).toBe('1.2K')
    expect(formatNumber(2_500_000)).toBe('2.5M')
  })

  it('formatDate formats TR locale', () => {
    const date = new Date('2024-01-15T00:00:00Z')
    const text = formatDate(date)
    expect(text).toContain('2024')
  })
})
