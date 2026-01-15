import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/export/pack/route'

describe('export pack API', () => {
  it('returns a zip file', async () => {
    const request = new Request('http://localhost/api/export/pack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Pack' })
    })
    const response = await POST(request)
    expect(response.headers.get('Content-Type')).toBe('application/zip')
    const buffer = Buffer.from(await response.arrayBuffer())
    const asText = buffer.toString('utf8')
    expect(asText).toContain('script.txt')
    expect(asText).toContain('subtitles.srt')
  })
})
