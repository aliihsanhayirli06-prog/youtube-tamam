import { NextResponse } from "next/server"

const apiKey = process.env.OPENAI_API_KEY
const apiUrl = process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions"
const defaultModel = process.env.OPENAI_DEFAULT_MODEL || "gpt-4o-mini"

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const payload = {
    model: body.model || defaultModel,
    messages: body.messages || [{ role: "user", content: body.prompt || "" }],
    temperature: body.temperature ?? 0.7
  }

  const response = await fetch(apiUrl, {
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
