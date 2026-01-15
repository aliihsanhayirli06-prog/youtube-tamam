'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiArrowRight, FiCheck, FiYoutube, FiImage, FiEdit3, FiTarget, FiUsers, FiSettings, FiZap, FiStar, FiLock, FiPlus, FiX } from 'react-icons/fi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type Step = 'info' | 'branding' | 'audience' | 'strategy' | 'addons'

export default function NewChannelPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('info')
  const [isPremium] = useState(false)
  const [channelData, setChannelData] = useState({ name: '', description: '', category: '', niche: '', targetAge: 'all', targetGender: 'all', contentFrequency: 'weekly', videoStyle: 'educational' })
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  const steps: { id: Step; title: string }[] = [
    { id: 'info', title: 'Temel Bilgiler' },
    { id: 'branding', title: 'Marka' },
    { id: 'audience', title: 'Hedef Kitle' },
    { id: 'strategy', title: 'Strateji' },
    { id: 'addons', title: 'Eklentiler' }
  ]

  const categories = ['Teknoloji', 'Eğitim', 'Eğlence', 'Oyun', 'Müzik', 'Spor', 'Sağlık', 'Yemek', 'Seyahat', 'Moda', 'İş & Finans', 'Diğer']
  const addons = [
    { id: 'seo', name: 'SEO Paketi', price: 29, desc: 'Gelişmiş SEO araçları' },
    { id: 'analytics', name: 'Analitik Pro', price: 19, desc: 'Detaylı analiz raporları' },
    { id: 'automation', name: 'Otomasyon', price: 39, desc: 'Otomatik yayın ve planlama' },
    { id: 'support', name: 'Öncelikli Destek', price: 49, desc: '7/24 premium destek' }
  ]

  const handleNext = () => {
    const stepOrder: Step[] = ['info', 'branding', 'audience', 'strategy', 'addons']
    const idx = stepOrder.indexOf(currentStep)
    if (idx < stepOrder.length - 1) setCurrentStep(stepOrder[idx + 1])
  }

  const handlePrev = () => {
    const stepOrder: Step[] = ['info', 'branding', 'audience', 'strategy', 'addons']
    const idx = stepOrder.indexOf(currentStep)
    if (idx > 0) setCurrentStep(stepOrder[idx - 1])
  }

  const handleCreate = () => {
    const total = selectedAddons.reduce((sum, id) => sum + (addons.find(a => a.id === id)?.price || 0), 0)
    if (total > 0) {
      toast.success(`Kanal oluşturuldu! Toplam: $${total}`)
    } else {
      toast.success('Kanal başarıyla oluşturuldu!')
    }
    router.push('/dashboard')
  }

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId])
  }

  const totalAddonPrice = selectedAddons.reduce((sum, id) => sum + (addons.find(a => a.id === id)?.price || 0), 0)

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80"><FiArrowLeft className="text-xl" /><span>Geri Dön</span></Link>
          <h1 className="text-xl font-bold">Yeni Kanal Oluştur</h1>
          <div className="flex items-center gap-2">
            {isPremium ? (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm flex items-center gap-1"><FiStar /> Premium</span>
            ) : (
              <Link href="/dashboard/premium" className="px-3 py-1 bg-primary-600 hover:bg-primary-500 rounded-full text-sm flex items-center gap-1"><FiZap /> Premium Al</Link>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <button onClick={() => setCurrentStep(step.id)} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep === step.id ? 'bg-primary-600 text-white' : steps.findIndex(s => s.id === currentStep) > idx ? 'bg-green-600 text-white' : 'bg-dark-700 text-gray-400'}`}>
                {steps.findIndex(s => s.id === currentStep) > idx ? <FiCheck /> : idx + 1}
              </button>
              {idx < steps.length - 1 && <div className={`w-16 h-1 mx-2 rounded ${steps.findIndex(s => s.id === currentStep) > idx ? 'bg-green-600' : 'bg-dark-700'}`} />}
            </div>
          ))}
        </div>

        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto">
          {currentStep === 'info' && (
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Temel Bilgiler</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Kanal Adı *</label>
                  <input type="text" value={channelData.name} onChange={(e) => setChannelData({ ...channelData, name: e.target.value })} placeholder="Örn: TechMaster TR" className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kanal Açıklaması</label>
                  <textarea value={channelData.description} onChange={(e) => setChannelData({ ...channelData, description: e.target.value })} placeholder="Kanalınız hakkında kısa bir açıklama..." rows={4} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori *</label>
                  <select value={channelData.category} onChange={(e) => setChannelData({ ...channelData, category: e.target.value })} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500">
                    <option value="">Seçin...</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'branding' && (
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Marka Kimliği</h2>
              <div className="space-y-6">
                <div className="p-6 border-2 border-dashed border-white/10 rounded-xl text-center">
                  <FiImage className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Logo Yükle</p>
                  <button className="px-4 py-2 bg-primary-600 rounded-lg text-sm">Dosya Seç</button>
                </div>
                <div className="p-6 border-2 border-dashed border-white/10 rounded-xl text-center">
                  <FiImage className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Banner Yükle (2560x1440)</p>
                  <button className="px-4 py-2 bg-primary-600 rounded-lg text-sm">Dosya Seç</button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'audience' && (
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Hedef Kitle</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Yaş Aralığı</label>
                  <select value={channelData.targetAge} onChange={(e) => setChannelData({ ...channelData, targetAge: e.target.value })} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg">
                    <option value="all">Tüm Yaşlar</option>
                    <option value="13-17">13-17</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45+">45+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cinsiyet</label>
                  <select value={channelData.targetGender} onChange={(e) => setChannelData({ ...channelData, targetGender: e.target.value })} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg">
                    <option value="all">Tümü</option>
                    <option value="male">Erkek</option>
                    <option value="female">Kadın</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'strategy' && (
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">İçerik Stratejisi</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Video Sıklığı</label>
                  <select value={channelData.contentFrequency} onChange={(e) => setChannelData({ ...channelData, contentFrequency: e.target.value })} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg">
                    <option value="daily">Günlük</option>
                    <option value="weekly">Haftalık</option>
                    <option value="biweekly">İki Haftada Bir</option>
                    <option value="monthly">Aylık</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Video Stili</label>
                  <select value={channelData.videoStyle} onChange={(e) => setChannelData({ ...channelData, videoStyle: e.target.value })} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg">
                    <option value="educational">Eğitici</option>
                    <option value="entertainment">Eğlence</option>
                    <option value="vlog">Vlog</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="review">İnceleme</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'addons' && (
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Eklentiler (Opsiyonel)</h2>
              <p className="text-gray-400 mb-6">Kanalınızı güçlendirmek için eklentiler seçebilirsiniz.</p>
              <div className="space-y-4">
                {addons.map(addon => (
                  <button key={addon.id} onClick={() => toggleAddon(addon.id)} className={`w-full p-4 rounded-xl text-left flex items-center justify-between transition-all ${selectedAddons.includes(addon.id) ? 'bg-primary-600/20 border-2 border-primary-500' : 'bg-dark-800 border border-white/10 hover:border-white/20'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedAddons.includes(addon.id) ? 'bg-primary-600' : 'bg-dark-700'}`}>
                        {selectedAddons.includes(addon.id) && <FiCheck className="text-sm" />}
                      </div>
                      <div>
                        <h4 className="font-semibold">{addon.name}</h4>
                        <p className="text-sm text-gray-400">{addon.desc}</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary-400">${addon.price}/ay</span>
                  </button>
                ))}
              </div>
              {totalAddonPrice > 0 && (
                <div className="mt-6 p-4 bg-primary-600/10 border border-primary-500/30 rounded-xl flex items-center justify-between">
                  <span className="text-gray-300">Toplam Eklenti Ücreti</span>
                  <span className="text-2xl font-bold text-primary-400">${totalAddonPrice}/ay</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-8">
            <button onClick={handlePrev} disabled={currentStep === 'info'} className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${currentStep === 'info' ? 'bg-dark-700 text-gray-500 cursor-not-allowed' : 'glass-effect hover:bg-white/10'}`}>
              <FiArrowLeft /> Geri
            </button>
            {currentStep === 'addons' ? (
              <button onClick={handleCreate} className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold flex items-center gap-2">
                <FiCheck /> Kanal Oluştur
              </button>
            ) : (
              <button onClick={handleNext} className="px-6 py-3 bg-primary-600 hover:bg-primary-500 rounded-lg font-medium flex items-center gap-2">
                İleri <FiArrowRight />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
