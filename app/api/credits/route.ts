import { NextResponse } from "next/server"
import { getOrCreateDemoUser } from "@/lib/demo-user"
import { ensureDailyCredits } from "@/lib/credits"
import { prisma } from "@/lib/db"
import { CreditReason } from "@prisma/client"

function normalizeReason(reason: string | undefined, fallback: CreditReason) {
  const upper = (reason || "").toUpperCase()
  if (upper in CreditReason) {
    return CreditReason[upper as keyof typeof CreditReason]
  }
  return fallback
}

export async function GET() {
  const user = await getOrCreateDemoUser()
  const freshUser = await ensureDailyCredits(user.id)
  const transactions = await prisma.creditTransaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20
  })

  return NextResponse.json({
    balance: freshUser?.creditsBalance ?? user.creditsBalance,
    plan: freshUser?.plan ?? user.plan,
    transactions
  })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const user = await getOrCreateDemoUser()
  const freshUser = await ensureDailyCredits(user.id)

  const amount = Number(body.amount || 0)
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
  }

  const action = body.action || "spend"
  const reason = normalizeReason(body.reason, action === "add" ? "PURCHASE" : "SPEND_SCRIPT")

  if (action === "spend") {
    const balance = freshUser?.creditsBalance ?? user.creditsBalance
    if (balance < amount) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        creditsBalance: balance - amount,
        creditTransactions: {
          create: {
            amount: -amount,
            reason
          }
        }
      }
    })
    return NextResponse.json({ balance: updated.creditsBalance })
  }

  if (action === "add") {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        creditsBalance: (freshUser?.creditsBalance ?? user.creditsBalance) + amount,
        creditTransactions: {
          create: {
            amount,
            reason
          }
        }
      }
    })
    return NextResponse.json({ balance: updated.creditsBalance })
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 })
}
