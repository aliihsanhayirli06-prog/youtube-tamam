import { createZip } from "@/lib/zip"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const payload = body || {}

  const title = payload.title || "AutoTube Pack"
  const script = payload.script || "Ornek senaryo metni burada."
  const description = payload.description || "Bu video AutoTube AI tarafindan uretildi."
  const tags = (payload.tags || ["youtube", "autotube", "ai"]).join(", ")
  const thumbnailText = payload.thumbnailText || "SOK EDICI GERCEKLER"
  const tts = payload.tts || script
  const srt = payload.srt || "1\n00:00:00,000 --> 00:00:05,000\nOrnek altyazi"

  const entries = [
    { name: "script.txt", content: script },
    { name: "description.txt", content: description },
    { name: "tags.txt", content: tags },
    { name: "thumbnail.txt", content: thumbnailText },
    { name: "tts.txt", content: tts },
    { name: "subtitles.srt", content: srt }
  ]

  const zipBuffer = createZip(entries)
  const fileName = `${String(title).replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "autotube-pack"}.zip`

  return new NextResponse(zipBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${fileName}"`
    }
  })
}
