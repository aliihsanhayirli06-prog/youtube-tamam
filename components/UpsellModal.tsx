'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiX, FiZap, FiStar, FiCheck, FiArrowRight,
  FiYoutube, FiTrendingUp, FiVideo, FiUsers
} from 'react-icons/fi'
import Link from 'next/link'

interface UpsellModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'feature' | 'update' | 'channel' | 'limit'
  feature?: string
}

export default function UpsellModal({ isOpen, onClose, type, feature }: UpsellModalProps) {
  const content = {
    feature: {
      title: '🔒 Premium Özellik',
      description: `"${feature || 'Bu özellik'}" sadece Pro ve Premium planlarda kullanılabilir.`,
      benefits: [
        'Sınırsız AI çalışanı',
        'Tüm platform araştırmaları',
        'Otomatik yayınlama',
        'Öncelikli destek'
      ],
      cta: 'Premium\'a Yükselt',
      gradient: 'from-purple-500 to-pink-500'
    },
    update: {
      title: '🚀 Yeni Güncelleme!',
      description: 'AutoTube AI\'da yeni özellikler mevcut! Premium üyelikle hepsine erişin.',
      benefits: [
        'Hedef kitleye göre otomatik ses seçimi',
        'Gelişmiş trend analizi',
        'Çoklu kanal desteği',
        'API erişimi'
      ],
      cta: 'Şimdi Yükselt',
      gradient: 'from-blue-500 to-cyan-500'
    },
    channel: {
      title: '📺 Yeni Kanal Ekle',
      description: 'Birden fazla YouTube kanalı yönetmek için Premium\'a geçin.',
      benefits: [
        '5 kanala kadar yönetim',
        'Her kanal için ayrı strateji',
        'Toplu içerik planlaması',
        'Kanal performans karşılaştırması'
      ],
      cta: 'Premium Al',
      gradient: 'from-red-500 to-orange-500'
    },
    limit: {
      title: '⚠️ Limite Ulaştınız',
      description: 'Bu ay için ücretsiz video limitinizi doldurdunuz.',
      benefits: [
        'Sınırsız video üretimi',
        'Sınırsız trend araştırması',
        'Öncelikli işlem kuyruğu',
        'Yüksek kalite render'
      ],
      cta: 'Limiti Kaldır',
      gradient: 'from-yellow-500 to-orange-500'
    }
  }

  const current = content[type]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark-900/90 backdrop-blur-sm" onClick={onClose} />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md glass-effect rounded-2xl overflow-hidden"
          >
            {/* Gradient Header */}
            <div className={`h-2 bg-gradient-to-r ${current.gradient}`} />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            >
              <FiX className="text-gray-400" />
            </button>

            {/* Content */}
            <div className="p-6 text-center">
              {/* Icon */}
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${current.gradient} flex items-center justify-center mb-4`}>
                <FiStar className="text-3xl text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold mb-2">{current.title}</h2>

              {/* Description */}
              <p className="text-gray-400 mb-6">{current.description}</p>

              {/* Benefits */}
              <div className="text-left space-y-3 mb-6">
                {current.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-dark-800 rounded-lg">
                    <FiCheck className="text-green-400 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Pro</p>
                  <p className="text-2xl font-bold">$29<span className="text-sm text-gray-400">/ay</span></p>
                </div>
                <div className="text-center px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <p className="text-sm text-yellow-400">Premium</p>
                  <p className="text-2xl font-bold text-yellow-400">$99<span className="text-sm text-yellow-300">/ay</span></p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/dashboard/premium"
                onClick={onClose}
                className={`w-full py-3 bg-gradient-to-r ${current.gradient} rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
              >
                {current.cta}
                <FiArrowRight />
              </Link>

              {/* Skip */}
              <button
                onClick={onClose}
                className="mt-4 text-sm text-gray-500 hover:text-gray-400 transition-colors"
              >
                Şimdilik geç
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
