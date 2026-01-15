import { NextResponse } from "next/server"
import { getOrCreateDemoUser } from "@/lib/demo-user"
import { prisma } from "@/lib/db"
import { ensureDailyCredits } from "@/lib/credits"

export const dynamic = "force-dynamic"

export async function GET() {
  const user = await getOrCreateDemoUser()
  const freshUser = await ensureDailyCredits(user.id)
  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json({
    user: {
      id: freshUser?.id || user.id,
      name: freshUser?.name || user.name,
      email: freshUser?.email || user.email,
      plan: freshUser?.plan || user.plan,
      creditsBalance: freshUser?.creditsBalance ?? user.creditsBalance,
      referralCode: freshUser?.referralCode || user.referralCode
    },
    subscription
  })
}
