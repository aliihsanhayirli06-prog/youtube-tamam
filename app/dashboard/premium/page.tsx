'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCheck, FiX, FiZap, FiStar, FiYoutube, FiFacebook, FiInstagram, FiTwitter, FiTrendingUp, FiUsers, FiVideo, FiShield, FiMusic } from 'react-icons/fi'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'premium'>('pro')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const [isPortalLoading, setIsPortalLoading] = useState(false)
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null)
  const [currentPlan, setCurrentPlan] = useState<string>('FREE')
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    const cancel = params.get('cancel')
    if (success) {
      toast.success('Odeme basarili! Premium etkinlestirildi.')
    }
    if (cancel) {
      toast.error('Odeme iptal edildi.')
    }
  }, [])

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/user')
        const data = await res.json()
        setCreditsBalance(data?.user?.creditsBalance ?? null)
        setCurrentPlan(data?.user?.plan || 'FREE')
      } catch (err) {
        setCreditsBalance(null)
      }
    }
    loadUser()
  }, [])

  const handleSubscribe = async (plan: string) => {
    if (plan === 'free') {
      toast.success('Zaten ücretsiz plandayız!')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          billingCycle
        })
      })
      const data = await res.json()
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || 'Stripe istegi basarisiz.')
      }
      window.location.href = data.url
    } catch (err) {
      toast.error('Odeme baslatilamadi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePortal = async () => {
    setIsPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || 'Portal acilamadi.')
      }
      window.location.href = data.url
    } catch (err) {
      toast.error('Portal acilamadi.')
    } finally {
      setIsPortalLoading(false)
    }
  }

  const getPrice = (plan: string) => {
    if (plan === 'free') return 0
    if (plan === 'pro') return billingCycle === 'monthly' ? 29 : 290
    return billingCycle === 'monthly' ? 99 : 990
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80"><FiArrowLeft className="text-xl" /><span>Geri Dön</span></Link>
          <h1 className="text-xl font-bold">Premium Özellikler</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="glass-effect rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">Mevcut Plan</p>
            <p className="text-lg font-semibold">{currentPlan}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Kredi Bakiyesi</p>
            <p className="text-lg font-semibold">{creditsBalance ?? '—'}</p>
          </div>
          <button
            onClick={handlePortal}
            disabled={isPortalLoading}
            className="px-4 py-2 bg-dark-700 rounded-lg text-sm hover:bg-dark-600 transition-colors disabled:opacity-50"
          >
            {isPortalLoading ? 'Portal aciliyor...' : 'Fatura & Iptal'}
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">İçerik Üretiminizi <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Bir Üst Seviyeye Taşıyın</span></h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Tüm platformlarda trend araştırması yapın, AI çalışanlarınızı artırın.</p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="glass-effect rounded-full p-1 flex gap-1">
            <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2 rounded-full font-medium transition-all ${billingCycle === 'monthly' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}>Aylık</button>
            <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}>Yıllık <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">2 Ay Bedava</span></button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Free Plan */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => setSelectedPlan('free')} className={`glass-effect rounded-2xl p-6 cursor-pointer transition-all ${selectedPlan === 'free' ? 'border-2 border-primary-500' : 'border border-white/10'}`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-gray-500/20"><FiStar className="text-3xl text-gray-400" /></div>
              <h3 className="text-2xl font-bold mb-1">Ücretsiz</h3>
              <div className="text-4xl font-bold">Ücretsiz</div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3"><FiCheck className="text-green-400" /><span>3 AI Çalışanı</span></div>
              <div className="flex items-center gap-3"><FiCheck className="text-green-400" /><span>YouTube Trend Araştırma</span></div>
              <div className="flex items-center gap-3"><FiCheck className="text-green-400" /><span>Aylık 10 Video</span></div>
              <div className="flex items-center gap-3"><FiX className="text-gray-600" /><span className="text-gray-600">Facebook Araştırmacısı</span></div>
              <div className="flex items-center gap-3"><FiX className="text-gray-600" /><span className="text-gray-600">TikTok Araştırmacısı</span></div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleSubscribe('free') }} className="w-full py-3 rounded-xl font-semibold bg-gray-700 text-gray-400">Mevcut Plan</button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onClick={() => setSelectedPlan('pro')} className={`glass-effect rounded-2xl p-6 cursor-pointer transition-all relative md:-mt-4 md:mb-4 ${selectedPlan === 'pro' ? 'border-2 border-primary-500' : 'border border-white/10'}`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full text-xs font-bold">EN POPÜLER</div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-blue-500/20"><FiZap className="text-3xl text-blue-400" /></div>
              <h3 className="text-2xl font-bold mb-1">Pro</h3>
              <div className="text-4xl font-bold">${getPrice('pro')}<span className="text-lg text-gray-400 font-normal">/{billingCycle === 'monthly' ? 'ay' : 'yıl'}</span></div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3"><FiCheck className="text-green-400" /><span>10 AI Çalışanı</span></div>
              <div className="flex items-center gap-3"><FiCheck className="text-green-400" /><span>YouTube + Facebook</span></div>
              <div className="flex items-center gap-3"><FiCheck className="text-green-400" /><span>Sınırsız Video</span></div>
              <div className="flex items-center gap-3"><FiCheck className="text-green-400" /><span>Otomatik Yayınlama</span></div>
              <div className="flex items-center gap-3"><FiX className="text-gray-600" /><span className="text-gray-600">TikTok Araştırmacısı</span></div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleSubscribe('pro') }} disabled={isLoading} className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white disabled:opacity-60">Hemen Başla</button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onClick={() => setSelectedPlan('premium')} className={`glass-effect rounded-2xl p-6 cursor-pointer transition-all ${selectedPlan === 'premium' ? 'border-2 border-primary-500' : 'border border-white/10'}`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-yellow-500/20"><FiStar className="text-3xl text-yellow-400" /></div>
              <h3 className="text-2xl font-bold mb-1">Premium</h3>
              <div className="text-4xl font-bold">${getPrice('premium')}<span className="text-lg text-gray-400 font-normal">/{billingCycle === 'monthly' ? 'ay' : 'yıl'}</span></div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3"><FiCheck className="text-green-400" /><span>Sınırsız AI Çalışanı</span></div>
              <div className="flex items-center gap-3"><FiCheck className="text-green-400" /><span>Tüm Platformlar</span></div>
              <div className="flex items-center gap-3"><FiCheck className="text-green-400" /><span>Sınırsız Video</span></div>
              <div className="flex items-center gap-3"><FiCheck className="text-green-400" /><span>7/24 Destek</span></div>
              <div className="flex items-center gap-3"><FiCheck className="text-green-400" /><span>API Erişimi</span></div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleSubscribe('premium') }} disabled={isLoading} className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-dark-900 disabled:opacity-60">Hemen Başla</button>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: FiTrendingUp, title: 'Daha Fazla Trend', desc: 'Tüm platformlarda', color: 'text-green-400' },
            { icon: FiUsers, title: 'AI Çalışanlar', desc: 'Sınırsız asistan', color: 'text-blue-400' },
            { icon: FiVideo, title: 'Sınırsız Video', desc: 'Limit yok', color: 'text-purple-400' },
            { icon: FiShield, title: 'Öncelikli Destek', desc: '7/24 premium', color: 'text-yellow-400' }
          ].map((item, idx) => (
            <div key={idx} className="text-center glass-effect rounded-2xl p-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-800 flex items-center justify-center mb-4"><item.icon className={`text-3xl ${item.color}`} /></div>
              <h4 className="font-bold mb-2">{item.title}</h4>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
