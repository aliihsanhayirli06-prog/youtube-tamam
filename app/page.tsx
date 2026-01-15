'use client'

import { motion } from 'framer-motion'
import { FiYoutube, FiZap, FiTrendingUp, FiShield } from 'react-icons/fi'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-20"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500/20 rounded-xl neon-border">
              <FiYoutube className="text-3xl text-primary-400" />
            </div>
            <span className="text-2xl font-bold glow-text">AutoTube AI</span>
          </div>
          
          <div className="flex gap-4">
            <Link 
              href="/login"
              className="px-6 py-2 glass-effect rounded-lg hover:bg-white/20 transition-all"
            >
              Giriş Yap
            </Link>
            <Link 
              href="/register"
              className="px-6 py-2 bg-primary-600 rounded-lg hover:bg-primary-500 transition-all neon-border"
            >
              Başla
            </Link>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 glow-text leading-tight">
            YouTube'u
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
              Otomatikleştir
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            AI destekli çalışanlarınız ile en hızlı trend olacak videoları araştırın,
            üretin ve yayınlayın. Geleceğin içerik üretim platformu.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-primary-600 rounded-xl hover:bg-primary-500 transition-all text-lg font-semibold neon-border flex items-center gap-2"
            >
              <FiZap className="text-xl" />
              Hemen Başla
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 glass-effect rounded-xl hover:bg-white/20 transition-all text-lg font-semibold"
            >
              Demo İzle
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20"
        >
          {[
            {
              icon: FiTrendingUp,
              title: 'AI Trend Araştırmacısı',
              description: 'En hızlı trend olacak konuları anında keşfedin ve içerik fikirleri üretin',
              color: 'text-green-400'
            },
            {
              icon: FiZap,
              title: 'Otomatik Video Üretimi',
              description: 'AI çalışanları videolarınızı otomatik olarak oluşturur ve optimize eder',
              color: 'text-yellow-400'
            },
            {
              icon: FiShield,
              title: 'YouTube Kuralları Uyumlu',
              description: 'Tüm YouTube yasalarını ve kurallarını bilen AI, içeriklerinizi güvende tutar',
              color: 'text-blue-400'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="glass-effect rounded-2xl p-8 cursor-pointer transition-all"
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <feature.icon className={`text-5xl mb-4 ${feature.color}`} />
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-6xl mx-auto mb-20"
        >
          <h2 className="text-4xl font-bold mb-4 text-center">3 Net Niş Paket</h2>
          <p className="text-gray-300 text-center max-w-2xl mx-auto mb-10">
            Genel “YouTube AI” yerine, hedefi net 3 paket ile daha hizli satis.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Emlak Kanal Paketi',
                promise: 'Haftada 20+ video fikri',
                demo: ['Semt analizleri', 'Ev turu formatlari', 'Kredi stratejileri'],
                color: 'text-yellow-400'
              },
              {
                title: 'Finans/Kripto Paketi',
                promise: 'Gunde 5 trend konu',
                demo: ['Makro piyasa ozetleri', 'Portfoy taktikleri', 'Altcoin filtreleri'],
                color: 'text-green-400'
              },
              {
                title: 'Saglik/Fitness Paketi',
                promise: '30 gunluk icerik plani',
                demo: ['Antrenman rutinleri', 'Beslenme rehberi', 'Motivasyon shortları'],
                color: 'text-blue-400'
              }
            ].map((item) => (
              <div key={item.title} className="glass-effect rounded-2xl p-6">
                <h3 className={`text-2xl font-bold mb-2 ${item.color}`}>{item.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{item.promise}</p>
                <ul className="text-sm text-gray-300 space-y-2">
                  {item.demo.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
