import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getOrCreateDemoUser } from "@/lib/demo-user"

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

export async function POST(request: Request) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY missing" }, { status: 500 })
  }

  const user = await getOrCreateDemoUser()
  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, provider: "stripe" },
    orderBy: { createdAt: "desc" }
  })

  if (!subscription?.providerCustomerId) {
    return NextResponse.json({ error: "Stripe customer not found" }, { status: 404 })
  }

  const origin = request.headers.get("origin") || "http://localhost:3000"
  const params = new URLSearchParams()
  params.append("customer", subscription.providerCustomerId)
  params.append("return_url", `${origin}/dashboard/premium`)

  const response = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return NextResponse.json({ error: data?.error?.message || "Stripe error" }, { status: 500 })
  }

  return NextResponse.json({ url: data?.url })
}
