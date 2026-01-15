export const runtime = 'nodejs'

const faviconBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6XGDWQAAAAASUVORK5CYII='

export function GET() {
  const bytes = Buffer.from(faviconBase64, 'base64')
  return new Response(bytes, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  })
}
