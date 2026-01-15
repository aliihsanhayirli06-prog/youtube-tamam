import { NextResponse } from "next/server"

const apiKey = process.env.RUNWAY_API_KEY
const baseUrl = process.env.RUNWAY_API_URL || "https://api.runwayml.com"

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "RUNWAY_API_KEY missing" }, { status: 500 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const payload = {
    model: body.model || "gen3a_turbo",
    prompt_text: body.prompt_text || body.prompt || "",
    duration: body.duration ?? 5,
    resolution: body.resolution || "720p",
    ...body
  }

  const response = await fetch(`${baseUrl}/v1/video_generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  })

  const data = await response.json().catch(() => ({}))
  return NextResponse.json(data, { status: response.status })
}

export async function GET(request: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "RUNWAY_API_KEY missing" }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const taskId = searchParams.get("id")
  if (!taskId) {
    return NextResponse.json({ error: "Missing id query param" }, { status: 400 })
  }

  const response = await fetch(`${baseUrl}/v1/video_generations/${taskId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  })

  const data = await response.json().catch(() => ({}))
  return NextResponse.json(data, { status: response.status })
}
