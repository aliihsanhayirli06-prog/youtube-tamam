# Test Plan (Manual QA)

Status: PARTIAL RUN (E2E + unit + component + integration)
Last E2E run: 9 passed
Last unit+component+integration run: 80 passed / 1 failed / 1 skipped (CMD kosumu)
Latest test run: 1 test FAIL, 1 test SKIPPED
Pass oranı (skip hariç): %98.77 (80 / 81)
Environment: local `npm run dev` / Docker `docker compose up`

## 0) Preconditions
- [ ] `.env.local` has required keys (DB, OpenAI, Runway, Stripe)
- [ ] DB is reachable (Docker `db` up)

## 1) Landing -> Auth Flow
- [x] Landing loads at `/`
- [x] "Giris Yap" -> `/login`
- [x] "Basla" -> `/register`
- [x] Demo flow: login/register completes and routes to `/dashboard`
  - Expected: requires form validation (email/password) or at least basic checks.

## 2) Dashboard Core
- [ ] `/dashboard` loads (overview tab)
- [ ] Tabs switch: `overview`, `videos`, `trends`, `workers`
- [ ] Trend refresh shows toast + worker progress
- [ ] Video create from trend navigates to `/dashboard/videos/[id]`

## 3) Channels (Setup)
- [x] `/channel-setup` loads
- [ ] `/dashboard/channels/new` form works end-to-end
  - Expected: if user has no channel, guided setup; if has channel, show status.

## 4) Premium / Billing
- [ ] `/dashboard/premium` loads
- [ ] Monthly/Yearly toggle updates price
- [ ] "Hemen Basla" triggers Stripe checkout (test mode)
- [ ] "Fatura & Iptal" opens Stripe Customer Portal

## 5) Credits (AI Credits)
- [ ] `/dashboard/settings` -> Subscription tab shows balance
- [ ] Trend refresh consumes credits
- [ ] Script/SEO generation consumes credits
- [ ] Buy credits adds balance

## 6) Templates Store (Premium)
- [ ] `/dashboard/templates` loads
- [ ] Free user sees lock overlay
- [ ] Premium user can "Paketi Uret"
- [ ] Pack shows 10 ideas/titles/hooks/shorts

## 7) Export/Pack
- [ ] `/dashboard/export` loads
- [ ] "ZIP Indir" returns ZIP with expected files:
  - `script.txt`, `description.txt`, `tags.txt`, `thumbnail.txt`, `tts.txt`, `subtitles.srt`

## 8) Referral / Affiliate
- [ ] `/dashboard/referral` loads
- [ ] Referral link is generated and copy works

## 9) Autopilot + Runway
- [ ] `/dashboard/autopilot` loads
- [ ] Runway prompt generation works
- [ ] Video generation creates DB record
- [ ] Polling updates status
- [ ] Failed polling retries automatically

## 10) Video Detail
- [ ] `/dashboard/videos/[id]` loads
- [ ] Preview carousel works (chapters -> slides)
- [ ] Publish updates status

## 11) Legal / Trust
- [ ] `/terms` loads
- [ ] `/privacy` loads

## 12) API Sanity
- [ ] `GET /api/user`
- [ ] `GET /api/credits`
- [ ] `POST /api/credits` (spend/add)
- [ ] `POST /api/export/pack`
- [ ] `POST /api/stripe/checkout` (with test keys)
- [ ] `POST /api/stripe/portal` (requires customer)

## 13) DB Entegrasyon Senaryosu (Gerçek DB)
- [ ] Test DB ayaga kalkar (Docker `db`/cloud).
- [ ] Prisma migrate uygulanir (`prisma migrate deploy`).
- [ ] Demo user + channel olusturulur (API veya Prisma ile).
- [ ] `POST /api/videos` -> kayit DB’de olusur, `GET /api/videos` listeler.
- [ ] `PATCH /api/videos/[id]` -> durum guncellenir.
- [ ] `POST /api/credits` -> bakiye azalir/artar, `GET /api/credits` dogrular.
- [ ] `POST /api/export/pack` -> DB gerekmiyorsa basarili donus dogrulanir.
- [ ] `GET /api/health` -> db=up doner.

## Known Gaps / Expected Fixes
- [ ] Login/Register currently auto-allows (no real auth).
- [ ] Channel setup flow may not enforce channel existence.

## Coverage
- Automated test suite is present (unit/component/integration + E2E).
- Latest run blocked: `vitest` failed to start due to `esbuild` spawn `EPERM` on Windows.

## 100% Coverage Requirements (Plan)
- [x] Add unit test runner + coverage tooling
- [x] Unit tests for shared utils (`lib/utils.ts`)
- [x] Unit tests for ZIP pack builder (`lib/zip.ts`)
- [x] Unit tests for credits logic (`lib/credits.ts`) with mocked Prisma
- [x] Component tests for auth pages (`app/login/page.tsx`, `app/register/page.tsx`)
- [x] Component tests for channel setup (`app/channel-setup/page.tsx`, `components/CreatingChannelView.tsx`)
- [x] Integration tests for API routes (credits, user, export)
- [x] E2E coverage for critical paths (login/register/channel)
- [x] Coverage report generated and reviewed

## Coverage Status (Latest)
- Overall coverage: TAMAMLAMA YOK (1 test fail, 1 test skip). Coverage yüzdesi test çıktısında görünmedi.
- Command: `npm run test:coverage`
- Son kosumda fail olan test:
  - `tests/component/auth-pages.test.tsx`: register success akisi `push('/channel-setup')` cagrisi gelmiyor.
- Skip edilen test:
  - `tests/component/dashboard-page.test.tsx`: `refreshes trends and generates video` (zaman alici).
