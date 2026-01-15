'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiUser, FiMail, FiLock, FiShield, FiCreditCard, FiCheck, FiX, FiZap, FiStar } from 'react-icons/fi'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'security'>('profile')
  const [currentTier, setCurrentTier] = useState<'free' | 'pro' | 'premium'>('free')
  const [profileData, setProfileData] = useState({ name: 'Kullanıcı Adı', email: 'ornek@email.com', phone: '+90 555 123 4567' })
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null)
  const [isBuying, setIsBuying] = useState(false)

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Profil güncellendi!')
  }

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/user')
        const data = await res.json()
        setCurrentTier((data?.user?.plan || 'FREE').toLowerCase())
        setCreditsBalance(data?.user?.creditsBalance ?? null)
      } catch (err) {
        setCreditsBalance(null)
      }
    }
    loadUser()
  }, [])

  const handleBuyCredits = async (amount: number) => {
    setIsBuying(true)
    try {
      const res = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', amount, reason: 'PURCHASE' })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Satin alma basarisiz.')
      }
      setCreditsBalance(data?.balance ?? null)
      toast.success(`+${amount} kredi eklendi.`)
    } catch (err) {
      toast.error('Kredi satin alinamadi.')
    } finally {
      setIsBuying(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80"><FiArrowLeft className="text-xl" /><span>Geri Dön</span></Link>
          <h1 className="text-xl font-bold">Ayarlar</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 border-b border-white/10">
          {[
            { id: 'profile', label: 'Profil', icon: FiUser },
            { id: 'subscription', label: 'Abonelik', icon: FiCreditCard },
            { id: 'security', label: 'Güvenlik', icon: FiShield }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-6 py-3 flex items-center gap-2 font-semibold transition-colors border-b-2 ${activeTab === tab.id ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
              <tab.icon />{tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><FiUser className="text-primary-400" />Profil Bilgileri</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium mb-2">Ad Soyad</label>
                <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">E-posta</label>
                <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500" />
              </div>
              <button type="submit" className="px-6 py-3 bg-primary-600 hover:bg-primary-500 rounded-lg font-semibold">Kaydet</button>
            </form>
          </motion.div>
        )}

        {activeTab === 'subscription' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">Mevcut Plan: <span className="text-primary-400 capitalize">{currentTier}</span></h2>
              <p className="text-sm text-gray-400 mb-4">Kredi Bakiyesi: <span className="text-white font-semibold">{creditsBalance ?? '—'}</span></p>
              <Link href="/dashboard/premium" className="px-6 py-3 bg-primary-600 hover:bg-primary-500 rounded-lg font-semibold inline-block">Planları Görüntüle</Link>
            </div>
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Ek Kredi Satin Al</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[50, 100, 250].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleBuyCredits(amount)}
                    disabled={isBuying}
                    className="p-4 rounded-xl border border-white/10 bg-dark-800/60 hover:bg-dark-700/60 transition-all disabled:opacity-60"
                  >
                    <p className="text-lg font-semibold">+{amount} Kredi</p>
                    <p className="text-xs text-gray-400">Tek seferlik satin alma</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><FiShield className="text-primary-400" />Güvenlik Ayarları</h2>
            <p className="text-gray-400">Şifre değiştirme ve güvenlik ayarları yakında eklenecek.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
