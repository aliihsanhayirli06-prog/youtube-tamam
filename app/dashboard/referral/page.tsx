'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiArrowLeft, FiCopy, FiGift, FiUsers } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState('AUTOTUBE')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/user')
        const data = await res.json()
        if (data?.user?.referralCode) {
          setReferralCode(data.user.referralCode)
        }
      } catch (err) {
        setReferralCode('AUTOTUBE')
      }
    }
    loadUser()
  }, [])

  const referralLink = `https://autotube.ai/register?ref=${referralCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      toast.success('Link kopyalandi.')
    } catch (err) {
      toast.error('Kopyalama basarisiz.')
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80">
            <FiArrowLeft className="text-xl" />
            <span>Geri Dön</span>
          </Link>
          <h1 className="text-xl font-bold">Referral & Affiliate</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FiGift className="text-2xl text-yellow-400" />
            <div>
              <h2 className="text-2xl font-bold">Arkadasini Getir, Kredi Kazan</h2>
              <p className="text-sm text-gray-400">Her yeni kayitta +50 kredi</p>
            </div>
          </div>

          <div className="bg-dark-800/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">Referral Link</p>
              <p className="font-semibold break-all">{referralLink}</p>
            </div>
            <button onClick={handleCopy} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold flex items-center gap-2">
              <FiCopy /> Kopyala
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-dark-800/60 rounded-xl p-4 border border-white/5">
            <FiUsers className="text-2xl text-green-400 mb-2" />
            <p className="font-semibold mb-1">Affiliate Komisyonu</p>
            <p className="text-sm text-gray-400">%20 komisyon ile pasif gelir modeli.</p>
          </div>
          <div className="bg-dark-800/60 rounded-xl p-4 border border-white/5">
            <FiGift className="text-2xl text-yellow-400 mb-2" />
            <p className="font-semibold mb-1">Bonus Kredi</p>
            <p className="text-sm text-gray-400">Her yeni arkadas +50 kredi kazandirir.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
