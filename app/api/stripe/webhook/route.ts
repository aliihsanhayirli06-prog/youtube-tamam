import { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import { prisma } from "@/lib/db"
import { getPlanCreditAllowance } from "@/lib/credits"
import { PlanTier, SubscriptionStatus } from "@prisma/client"

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

function parseSignatureHeader(header: string) {
  const parts = header.split(",")
  const data: Record<string, string> = {}
  for (const part of parts) {
    const [key, value] = part.split("=")
    if (key && value) data[key] = value
  }
  return data
}

function verifySignature(payload: string, signatureHeader: string, secret: string) {
  const parsed = parseSignatureHeader(signatureHeader)
  if (!parsed.t || !parsed.v1) {
    return false
  }
  const signedPayload = `${parsed.t}.${payload}`
  const expected = createHmac("sha256", secret).update(signedPayload).digest("hex")
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(parsed.v1))
  } catch {
    return false
  }
}

function mapPlan(plan: string | null | undefined) {
  if (!plan) return null
  const normalized = plan.toUpperCase()
  if (normalized === "PRO") return PlanTier.PRO
  if (normalized === "PREMIUM") return PlanTier.PREMIUM
  return PlanTier.FREE
}

function mapStatus(status: string | null | undefined) {
  if (!status) return SubscriptionStatus.ACTIVE
  const normalized = status.toLowerCase()
  if (normalized === "active") return SubscriptionStatus.ACTIVE
  if (normalized === "past_due") return SubscriptionStatus.PAST_DUE
  if (normalized === "canceled" || normalized === "cancelled") return SubscriptionStatus.CANCELED
  if (normalized === "trialing") return SubscriptionStatus.TRIALING
  return SubscriptionStatus.ACTIVE
}

function mapPlanFromPrice(priceId: string | null | undefined) {
  if (!priceId) return null
  const map = new Map([
    [process.env.STRIPE_PRICE_PRO_MONTHLY, PlanTier.PRO],
    [process.env.STRIPE_PRICE_PRO_YEARLY, PlanTier.PRO],
    [process.env.STRIPE_PRICE_PREMIUM_MONTHLY, PlanTier.PREMIUM],
    [process.env.STRIPE_PRICE_PREMIUM_YEARLY, PlanTier.PREMIUM]
  ])
  return map.get(priceId) || null
}

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get("stripe-signature") || ""

  if (!STRIPE_WEBHOOK_SECRET || !signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 })
  }

  if (!verifySignature(payload, signature, STRIPE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const event = JSON.parse(payload)
  const type = event?.type
  const data = event?.data?.object || {}

  if (type === "checkout.session.completed") {
    const userId = data?.client_reference_id || data?.metadata?.userId
    const plan = mapPlan(data?.metadata?.plan)
    if (userId && plan) {
      const allowance = getPlanCreditAllowance(plan)
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan,
          creditsBalance: allowance,
          creditsResetAt: new Date()
        }
      })
      const providerSubscriptionId = data?.subscription || null
      if (providerSubscriptionId) {
        await prisma.subscription.upsert({
          where: { providerSubscriptionId },
          update: {
            plan,
            status: SubscriptionStatus.ACTIVE,
            provider: "stripe",
            providerCustomerId: data?.customer,
            currentPeriodStart: data?.current_period_start ? new Date(data.current_period_start * 1000) : undefined,
            currentPeriodEnd: data?.current_period_end ? new Date(data.current_period_end * 1000) : undefined
          },
          create: {
            userId,
            plan,
            status: SubscriptionStatus.ACTIVE,
            provider: "stripe",
            providerCustomerId: data?.customer || null,
            providerSubscriptionId
          }
        })
      } else {
        const existing = await prisma.subscription.findFirst({
          where: { userId, provider: "stripe" }
        })
        if (existing) {
          await prisma.subscription.update({
            where: { id: existing.id },
            data: {
              plan,
              status: SubscriptionStatus.ACTIVE,
              providerCustomerId: data?.customer || null
            }
          })
        } else {
          await prisma.subscription.create({
            data: {
              userId,
              plan,
              status: SubscriptionStatus.ACTIVE,
              provider: "stripe",
              providerCustomerId: data?.customer || null
            }
          })
        }
      }
    }
  }

  if (type === "customer.subscription.updated" || type === "customer.subscription.deleted") {
    const userId = data?.metadata?.userId
    const priceId = data?.items?.data?.[0]?.price?.id
    const plan = mapPlanFromPrice(priceId) || mapPlan(data?.metadata?.plan)
    const status = mapStatus(data?.status)
    if (userId && plan) {
      const providerSubscriptionId = data?.id || null
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: status === SubscriptionStatus.CANCELED ? PlanTier.FREE : plan
        }
      })
      if (providerSubscriptionId) {
        await prisma.subscription.upsert({
          where: { providerSubscriptionId },
          update: {
            plan,
            status,
            provider: "stripe",
            providerCustomerId: data?.customer || null,
            currentPeriodStart: data?.current_period_start ? new Date(data.current_period_start * 1000) : undefined,
            currentPeriodEnd: data?.current_period_end ? new Date(data.current_period_end * 1000) : undefined
          },
          create: {
            userId,
            plan,
            status,
            provider: "stripe",
            providerCustomerId: data?.customer || null,
            providerSubscriptionId
          }
        })
      } else {
        const existing = await prisma.subscription.findFirst({
          where: { userId, provider: "stripe" }
        })
        if (existing) {
          await prisma.subscription.update({
            where: { id: existing.id },
            data: {
              plan,
              status,
              providerCustomerId: data?.customer || null
            }
          })
        } else {
          await prisma.subscription.create({
            data: {
              userId,
              plan,
              status,
              provider: "stripe",
              providerCustomerId: data?.customer || null,
              providerSubscriptionId
            }
          })
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
