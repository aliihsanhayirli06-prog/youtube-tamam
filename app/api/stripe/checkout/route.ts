import { NextResponse } from "next/server"
import { getOrCreateDemoUser } from "@/lib/demo-user"

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const STRIPE_PRICE_PRO_MONTHLY = process.env.STRIPE_PRICE_PRO_MONTHLY
const STRIPE_PRICE_PRO_YEARLY = process.env.STRIPE_PRICE_PRO_YEARLY
const STRIPE_PRICE_PREMIUM_MONTHLY = process.env.STRIPE_PRICE_PREMIUM_MONTHLY
const STRIPE_PRICE_PREMIUM_YEARLY = process.env.STRIPE_PRICE_PREMIUM_YEARLY

function getPriceId(plan: string, cycle: string) {
  if (plan === "pro" && cycle === "monthly") return STRIPE_PRICE_PRO_MONTHLY
  if (plan === "pro" && cycle === "yearly") return STRIPE_PRICE_PRO_YEARLY
  if (plan === "premium" && cycle === "monthly") return STRIPE_PRICE_PREMIUM_MONTHLY
  if (plan === "premium" && cycle === "yearly") return STRIPE_PRICE_PREMIUM_YEARLY
  return null
}

export async function POST(request: Request) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY missing" }, { status: 500 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const plan = String(body.plan || "pro")
  const billingCycle = String(body.billingCycle || "monthly")
  const priceId = getPriceId(plan, billingCycle)
  if (!priceId) {
    return NextResponse.json({ error: "Missing Stripe price id" }, { status: 400 })
  }

  const user = await getOrCreateDemoUser()
  const origin = request.headers.get("origin") || "http://localhost:3000"
  const successUrl = `${origin}/dashboard/premium?success=1`
  const cancelUrl = `${origin}/dashboard/premium?cancel=1`

  const params = new URLSearchParams()
  params.append("mode", "subscription")
  params.append("success_url", successUrl)
  params.append("cancel_url", cancelUrl)
  params.append("client_reference_id", user.id)
  params.append("customer_email", user.email)
  params.append("line_items[0][price]", priceId)
  params.append("line_items[0][quantity]", "1")
  params.append("metadata[plan]", plan.toUpperCase())
  params.append("subscription_data[metadata][plan]", plan.toUpperCase())
  params.append("subscription_data[metadata][userId]", user.id)

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
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
