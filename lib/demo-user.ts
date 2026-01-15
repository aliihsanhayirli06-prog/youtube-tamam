import { prisma } from "@/lib/db"

export async function getOrCreateDemoUser() {
  const email = "demo@autotube.ai"
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return existing
  }
  return prisma.user.create({
    data: {
      name: "Demo Kullanici",
      email,
      plan: "FREE",
      creditsBalance: 5,
      creditsResetAt: new Date(),
      referralCode: "AUTOTUBE-DEMO"
    }
  })
}
