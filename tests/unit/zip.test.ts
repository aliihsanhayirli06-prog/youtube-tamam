import { describe, expect, it } from 'vitest'
import { createZip } from '@/lib/zip'

describe('zip', () => {
  it('creates a zip buffer with file names', () => {
    const buf = createZip([
      { name: 'a.txt', content: 'hello' },
      { name: 'b.txt', content: 'world' }
    ])

    expect(buf.length).toBeGreaterThan(0)
    const asText = buf.toString('utf8')
    expect(asText).toContain('a.txt')
    expect(asText).toContain('b.txt')
  })
})
