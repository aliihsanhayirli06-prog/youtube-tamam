const { PrismaClient, PlanTier, ChannelStatus, VideoStatus, CompetitionLevel, TrendSource, WorkerType } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@autotube.ai" },
    update: {},
    create: {
      name: "Demo Kullanici",
      email: "demo@autotube.ai",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
      plan: PlanTier.FREE
    }
  })

  const channel = await prisma.channel.create({
    data: {
      userId: user.id,
      name: "AutoTube Demo Channel",
      youtubeChannelId: "demo-channel-id",
      status: ChannelStatus.CONNECTED,
      connectedAt: new Date()
    }
  })

  await prisma.aiWorker.createMany({
    data: [
      { channelId: channel.id, type: WorkerType.TREND_RESEARCHER, status: "IDLE", progress: 0, tasksCompleted: 156 },
      { channelId: channel.id, type: WorkerType.SCRIPT_WRITER, status: "IDLE", progress: 0, tasksCompleted: 89 },
      { channelId: channel.id, type: WorkerType.THUMBNAIL_CREATOR, status: "IDLE", progress: 0, tasksCompleted: 134 },
      { channelId: channel.id, type: WorkerType.SEO_OPTIMIZER, status: "IDLE", progress: 0, tasksCompleted: 201 },
      { channelId: channel.id, type: WorkerType.SCHEDULER, status: "IDLE", progress: 0, tasksCompleted: 67 }
    ]
  })

  const trend = await prisma.trendTopic.create({
    data: {
      title: "Sora AI Video Uretimi",
      category: "Teknoloji",
      trendScore: 98,
      searchVolume: "2.4M",
      competition: CompetitionLevel.LOW,
      growthRate: "+340%",
      source: TrendSource.YOUTUBE,
      discoveredAt: new Date(),
      keywords: {
        create: [{ keyword: "sora openai" }, { keyword: "ai video generator" }]
      }
    }
  })

  const video = await prisma.video.create({
    data: {
      userId: user.id,
      channelId: channel.id,
      title: "AI ile Para Kazanmanin 10 Yolu - 2024",
      description: "Bu videoda yapay zeka kullanarak para kazanmanin en etkili yollarini anlatiyoruz.",
      thumbnailUrl: "https://picsum.photos/seed/vid1/320/180",
      status: VideoStatus.PUBLISHED,
      views: 45200,
      likes: 2340,
      trendScore: 92,
      publishedAt: new Date(),
      chapters: {
        create: [
          { timecode: "0:00", title: "Giris" },
          { timecode: "0:30", title: "Ana Konu" }
        ]
      }
    }
  })

  await prisma.videoTag.create({
    data: {
      video: { connect: { id: video.id } },
      tag: {
        connectOrCreate: {
          where: { name: "yapay zeka" },
          create: { name: "yapay zeka" }
        }
      }
    }
  })

  await prisma.usageEvent.create({
    data: {
      userId: user.id,
      type: "CHANNEL_CONNECTED",
      metadata: { channelId: channel.id, trendId: trend.id }
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
