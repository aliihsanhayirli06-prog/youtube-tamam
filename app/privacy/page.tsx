'use client'

import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80">
            <FiArrowLeft className="text-xl" />
            <span>Geri Dön</span>
          </Link>
          <h1 className="text-xl font-bold">Privacy</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6 text-gray-300">
        <h2 className="text-2xl font-bold text-white">Gizlilik Politikasi</h2>
        <p>Kullanici verileri sadece hizmeti saglamak, plan/odeme sureclerini yonetmek ve urun gelistirmek icin kullanilir.</p>
        <p>Uretilen icerikler ve meta veriler, kullanicinin izni olmadan ucuncu taraflarla paylasilmaz. Odeme islemleri Stripe uzerinden guvenli sekilde yapilir.</p>
        <p>Hesap silme ve veri talepleri icin destek kanali uzerinden bize ulasabilirsiniz.</p>
      </div>
    </div>
  )
}
