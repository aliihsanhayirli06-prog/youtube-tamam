import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

async function getOrCreateDemoUser() {
  const email = "demo@autotube.ai"
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return existing
  }
  return prisma.user.create({
    data: {
      name: "Demo Kullanici",
      email,
      plan: "FREE"
    }
  })
}

async function getOrCreateDemoChannel(userId: string) {
  const existing = await prisma.channel.findFirst({ where: { userId } })
  if (existing) {
    return existing
  }
  return prisma.channel.create({
    data: {
      userId,
      name: "AutoTube Demo Channel",
      status: "CONNECTED",
      connectedAt: new Date()
    }
  })
}

export async function GET() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
    take: 20
  })
  return NextResponse.json({ items: videos })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const user = await getOrCreateDemoUser()
  const channel = await getOrCreateDemoChannel(user.id)

  const title =
    body.title ||
    (body.promptText ? String(body.promptText).slice(0, 80) : "Runway Video")

  const video = await prisma.video.create({
    data: {
      userId: user.id,
      channelId: channel.id,
      title,
      description: body.description || null,
      thumbnailUrl: body.thumbnailUrl || null,
      status: body.status || "PROCESSING",
      durationSec: body.durationSec || null,
      promptText: body.promptText || null,
      model: body.model || null,
      resolution: body.resolution || null,
      runwayTaskId: body.runwayTaskId || null,
      runwayStatus: body.runwayStatus || null,
      runwayOutputUrl: body.runwayOutputUrl || null
    }
  })

  return NextResponse.json({ item: video }, { status: 201 })
}
