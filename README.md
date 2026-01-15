# AutoTube AI - YouTube Otomasyon Platformu

## 🎬 Proje Hakkında
AutoTube AI, YouTube kanalınızı AI destekli çalışanlarla otomatize etmenize yardımcı olan modern bir web platformudur.

## ✨ Özellikler
- 📈 **AI Trend Araştırması**: YouTube, Google, Twitter ve TikTok'tan trendleri analiz eder
- 🎥 **Otomatik Video Üretimi**: Senaryo, ses metni ve SEO optimizasyonu
- 🎯 **Hedef Kitle Analizi**: Kategoriye göre otomatik ses ve içerik tonu seçimi
- 🚀 **Otomatik Pilot**: YouTube kurallarına uyumlu otomatik içerik üretimi
- 💳 **Stripe Ödeme Akışı**: Checkout + Customer Portal ile gerçek ödeme
- 💰 **AI Credits**: Kullanım bazlı kredi sistemi ve ek kredi satın alma
- 🧩 **Templates Mağazası**: Tek tıkla 40 parçalık içerik paketleri
- 📦 **Export/Pack**: Senaryo + TTS + SRT + thumbnail metni ZIP indir
- 🤝 **Referral/Affiliate**: Referral linki, bonus kredi ve komisyon paneli
- 🛡️ **Legal & Trust**: Terms/Privacy + YouTube uyum uyarıları
- 📚 **Kanal Rehberi**: Yeni başlayanlar için kapsamlı rehber
- 💎 **Premium Özellikler**: Çoklu platform desteği ve gelişmiş analitik

## 🛠️ Teknolojiler
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (State Management)
- React Hot Toast

## 🚀 Kurulum

```bash
# Proje klasörüne gidin
cd youtube-TAMAM

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🔐 Ortam Değişkenleri
Stripe ve dış servisler için aşağıdaki değişkenleri `.env.local` içinde tanımlayın:

```
DATABASE_URL=
RUNWAY_API_KEY=
RUNWAY_API_URL=
OPENAI_API_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_YEARLY=
STRIPE_PRICE_PREMIUM_MONTHLY=
STRIPE_PRICE_PREMIUM_YEARLY=
```

## ✅ 7 Günlük Hızlı Gelir Planı
- Gün 1–2: Stripe Checkout + planlar
- Gün 3: Kullanıcı planını DB’ye yaz + Premium kilidi
- Gün 4: Kredi sistemi
- Gün 5: Template Pack (3 niş)
- Gün 6: Export/ZIP + demo çıktıları
- Gün 7: Referral + basit affiliate

## 📁 Proje Yapısı

```
youtube-TAMAM/
├── app/
│   ├── page.tsx           # Landing sayfası
│   ├── login/             # Giriş sayfası
│   ├── register/          # Kayıt sayfası
│   ├── demo/              # Demo sayfası
│   ├── channel-setup/     # Kanal kurulum
│   └── dashboard/
│       ├── page.tsx       # Ana dashboard
│       ├── settings/      # Ayarlar
│       ├── premium/       # Premium özellikleri
│       ├── autopilot/     # Otomatik pilot
│       ├── guide/         # Kanal rehberi
│       ├── videos/[id]/   # Video detay
│       └── channels/new/  # Yeni kanal oluşturma
├── components/
│   ├── OnboardingTour.tsx
│   ├── UpsellModal.tsx
│   ├── SocialAuthButtons.tsx
│   └── CreatingChannelView.tsx
├── lib/
│   ├── store.ts           # Zustand state yönetimi
│   └── utils.ts           # Yardımcı fonksiyonlar
└── package.json
```

## 📝 Notlar
- Bu proje "YOUTUBE otomasyonu" projesinin tam kopyasıdır
- Tüm özellikler aktif ve çalışır durumdadır
- Dashboard'a ilk giriş yapıldığında otomatik tur başlar

## 📄 Lisans
Bu proje özel kullanım içindir.
