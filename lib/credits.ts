import { prisma } from "@/lib/db"
import { PlanTier } from "@prisma/client"

const FREE_DAILY_CREDITS = 5

export function getPlanCreditAllowance(plan: PlanTier) {
  if (plan === "FREE") return FREE_DAILY_CREDITS
  if (plan === "PRO") return 200
  return 1000
}

export async function ensureDailyCredits(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.plan !== "FREE") {
    return user
  }

  const now = new Date()
  const todayKey = now.toISOString().slice(0, 10)
  const resetKey = user.creditsResetAt?.toISOString().slice(0, 10)

  if (!resetKey || resetKey !== todayKey) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        creditsBalance: FREE_DAILY_CREDITS,
        creditsResetAt: now,
        creditTransactions: {
          create: {
            amount: FREE_DAILY_CREDITS,
            reason: "DAILY_GRANT"
          }
        }
      }
    })
  }

  return user
}
