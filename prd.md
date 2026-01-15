# PRD / Execution Checklist

Last updated: 2026-01-15

## Scope (MVP > Fast Revenue)
- [ ] Stripe Checkout (single-link payment) for Premium
- [x] Stripe Checkout (single-link payment) for Premium
- [x] Monthly / Yearly plans
- [x] Stripe Customer Portal (cancel + invoices)
- [x] Premium page wired to real payment flow
- [x] README updated with plan + features

- [x] AI Credits system (usage metering + upsell)
  - [x] Free: 5 credits/day
  - [x] Starter: 200 credits
  - [x] Pro: 1,000 credits
  - [x] One-time extra credit purchase
  - [x] Deduct credits per action (trend research, script, SEO pack)

- [x] Templates store (Premium-locked)
  - [x] Category selection
  - [x] One-click pack output:
    - [x] 10 video ideas
    - [x] 10 titles
    - [x] 10 hooks
    - [x] 10 shorts scripts

- [x] Export/Pack (replace YouTube Upload integration for now)
  - [x] Script + description + tags + thumbnail text → ZIP export
  - [x] TTS + SRT + thumbnail text bundle
  - [x] Demo outputs to show immediate value

- [x] Niche packs on Landing (3 niches)
  - [x] Real estate pack
  - [x] Finance/crypto pack
  - [x] Health/fitness pack
  - [x] Demo outputs + concrete promise per niche

- [x] Referral / Affiliate (single page)
  - [x] Unique referral link per user
  - [x] +50 credits per referred friend
  - [x] Affiliate panel with 20% commission

- [x] Trust + Legal (fast but essential)
  - [x] Terms / Privacy pages
  - [x] “YouTube policy compliant content” notice
  - [x] Copyright / misinformation warnings (news/finance)

## 7-Day Money Plan
- [x] Day 1–2: Stripe Checkout + plans
- [x] Day 3: Save user plan to DB + Premium lock
- [x] Day 4: Credits system
- [x] Day 5: Template pack (3 niches)
- [x] Day 6: Export/ZIP + demo outputs
- [x] Day 7: Referral + basic affiliate

## Notes
- Premium page exists already; hook it to real payments.
- Runway prompt bank + quick presets added in `app/dashboard/autopilot/page.tsx`.
- Credits mapping: PRO = 200, PREMIUM = 1000 (Starter/Pro naming handled in UI copy).
