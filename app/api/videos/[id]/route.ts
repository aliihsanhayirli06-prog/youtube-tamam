import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
      include: {
        chapters: true,
        tags: {
          include: { tag: true }
        }
      }
    })
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }
    return NextResponse.json({ item: video })
  } catch (error) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  try {
    const video = await prisma.video.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        thumbnailUrl: body.thumbnailUrl,
        status: body.status,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
        runwayStatus: body.runwayStatus,
        runwayOutputUrl: body.runwayOutputUrl
      }
    })
    return NextResponse.json({ item: video })
  } catch (error) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.video.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 })
  }
}
