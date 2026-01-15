'use client'

import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80">
            <FiArrowLeft className="text-xl" />
            <span>Geri Dön</span>
          </Link>
          <h1 className="text-xl font-bold">Terms</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6 text-gray-300">
        <h2 className="text-2xl font-bold text-white">Kullanim Sartlari</h2>
        <p>AutoTube AI, YouTube politikalarina uygun icerik uretimi icin tasarlanmistir. Platformu kullanirken gecerli yerel yasalar ve YouTube topluluk kurallarina uyum zorunludur.</p>
        <p>Uretilen iceriklerin dogrulugu ve telif haklari kullanicinin sorumlulugundadir. Haber/finans gibi hassas nislerde yayin oncesi ek dogrulama yapilmalidir.</p>
        <p>Hizmet, plan ve krediler onceden bildirimle guncellenebilir. Ihlal durumlarinda hesap askıya alinabilir.</p>
      </div>
    </div>
  )
}
