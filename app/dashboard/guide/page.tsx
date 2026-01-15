'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCheck, FiX, FiYoutube, FiTarget, FiUsers, FiTrendingUp, FiVideo, FiImage, FiEdit3, FiCalendar, FiBarChart2, FiStar, FiAlertCircle, FiBook, FiZap } from 'react-icons/fi'
import Link from 'next/link'

export default function ChannelGuidePage() {
  const [activeSection, setActiveSection] = useState<'basics' | 'branding' | 'content' | 'growth' | 'mistakes'>('basics')

  const sections = [
    { id: 'basics', title: 'Temel Bilgiler', icon: FiBook },
    { id: 'branding', title: 'Marka Oluşturma', icon: FiImage },
    { id: 'content', title: 'İçerik Stratejisi', icon: FiVideo },
    { id: 'growth', title: 'Büyüme İpuçları', icon: FiTrendingUp },
    { id: 'mistakes', title: 'Kaçınılması Gerekenler', icon: FiAlertCircle }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80"><FiArrowLeft className="text-xl" /><span>Geri Dön</span></Link>
          <h1 className="text-xl font-bold">📚 Kanal Rehberi</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Başarılı Bir YouTube Kanalı Nasıl Oluşturulur?</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Yeni başlayanlar için kapsamlı rehber</p>
        </motion.div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button key={section.id} onClick={() => setActiveSection(section.id as any)} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-all ${activeSection === section.id ? 'bg-primary-600 text-white' : 'glass-effect text-gray-400 hover:text-white'}`}>
              <section.icon className="text-lg" />
              {section.title}
            </button>
          ))}
        </div>

        {activeSection === 'basics' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-6">
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FiTarget className="text-blue-400" /> 1. Niş Seçimi</h3>
              <p className="text-gray-400 mb-4">Başarılı bir kanal için spesifik bir niş seçmek çok önemlidir. Geniş konular yerine dar bir alana odaklanın.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><FiCheck className="text-green-400" /> İlgi alanınızı belirleyin</li>
                <li className="flex items-center gap-2"><FiCheck className="text-green-400" /> Rekabeti araştırın</li>
                <li className="flex items-center gap-2"><FiCheck className="text-green-400" /> Hedef kitleyi tanımlayın</li>
              </ul>
            </div>
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FiYoutube className="text-red-400" /> 2. Kanal Ayarları</h3>
              <p className="text-gray-400 mb-4">Kanalınızı profesyonel görünmesi için optimize edin.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><FiCheck className="text-green-400" /> Akılda kalıcı kanal adı</li>
                <li className="flex items-center gap-2"><FiCheck className="text-green-400" /> Profesyonel profil fotoğrafı</li>
                <li className="flex items-center gap-2"><FiCheck className="text-green-400" /> SEO uyumlu kanal açıklaması</li>
              </ul>
            </div>
          </motion.div>
        )}

        {activeSection === 'branding' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">🎨 Marka Kimliği Oluşturma</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-dark-800 rounded-xl">
                <h4 className="font-bold mb-2">Logo & Profil</h4>
                <p className="text-sm text-gray-400">Akılda kalıcı, basit ve tanınabilir bir logo tasarlayın.</p>
              </div>
              <div className="p-4 bg-dark-800 rounded-xl">
                <h4 className="font-bold mb-2">Renk Paleti</h4>
                <p className="text-sm text-gray-400">2-3 ana renk seçin ve tüm içeriklerde tutarlı kullanın.</p>
              </div>
              <div className="p-4 bg-dark-800 rounded-xl">
                <h4 className="font-bold mb-2">Thumbnail Stili</h4>
                <p className="text-sm text-gray-400">Tanınabilir bir thumbnail tasarım şablonu oluşturun.</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'content' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">📹 İçerik Stratejisi</h3>
            <div className="space-y-4">
              <div className="p-4 bg-dark-800 rounded-xl"><h4 className="font-bold">Düzenli Yayın</h4><p className="text-gray-400">Haftalık en az 2-3 video yayınlayın.</p></div>
              <div className="p-4 bg-dark-800 rounded-xl"><h4 className="font-bold">Trend Takibi</h4><p className="text-gray-400">Güncel trendleri takip edin ve ilgili içerikler üretin.</p></div>
              <div className="p-4 bg-dark-800 rounded-xl"><h4 className="font-bold">Kalite vs Miktar</h4><p className="text-gray-400">Kaliteli içerik her zaman miktar değil kaliteyi önceliklendirir.</p></div>
            </div>
          </motion.div>
        )}

        {activeSection === 'growth' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">🚀 Büyüme Stratejileri</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-dark-800 rounded-xl flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div><h4 className="font-bold">SEO Optimizasyonu</h4><p className="text-gray-400 text-sm">Başlık, açıklama ve etiketleri optimize edin.</p></div>
              </div>
              <div className="p-4 bg-dark-800 rounded-xl flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div><h4 className="font-bold">Topluluk Etkileşimi</h4><p className="text-gray-400 text-sm">Yorumlara cevap verin, izleyicilerle bağ kurun.</p></div>
              </div>
              <div className="p-4 bg-dark-800 rounded-xl flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div><h4 className="font-bold">İşbirlikleri</h4><p className="text-gray-400 text-sm">Diğer içerik üreticileriyle işbirliği yapın.</p></div>
              </div>
              <div className="p-4 bg-dark-800 rounded-xl flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div><h4 className="font-bold">Sosyal Medya</h4><p className="text-gray-400 text-sm">İçerikleri diğer platformlarda paylaşın.</p></div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'mistakes' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">⚠️ Kaçınılması Gereken Hatalar</h3>
            <div className="space-y-3">
              {[
                { mistake: 'Düzensiz yayın', tip: 'Bir takvim oluşturun ve tutarlı olun' },
                { mistake: 'Kötü ses kalitesi', tip: 'İyi bir mikrofona yatırım yapın' },
                { mistake: 'Clickbait kullanımı', tip: 'Başlıklarınız içerikle uyumlu olsun' },
                { mistake: 'SEO ihmal etmek', tip: 'Her video için SEO optimizasyonu yapın' },
                { mistake: 'Yorumları görmezden gelmek', tip: 'İzleyicilerinizle etkileşim kurun' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <FiX className="text-red-400 text-xl flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-red-400">{item.mistake}</p>
                    <p className="text-sm text-gray-400">💡 {item.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
