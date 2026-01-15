'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiX, FiArrowRight, FiArrowLeft, FiCheck, FiTrendingUp,
  FiVideo, FiZap, FiYoutube, FiSettings, FiStar, FiTarget,
  FiUsers, FiBarChart2
} from 'react-icons/fi'

interface TourStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  highlight?: string
  tip?: string
}

interface OnboardingTourProps {
  onComplete: () => void
  onSkip: () => void
}

export default function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const tourSteps: TourStep[] = [
    {
      id: 1,
      title: 'AutoTube AI\'ye Hoş Geldiniz! 🎉',
      description: 'YouTube kanalınızı otomatik olarak büyütmenize yardımcı olacağız. Bu kısa tur ile platformumuzu tanıyın.',
      icon: <FiYoutube className="text-4xl text-red-400" />,
      tip: 'Tur istediğiniz zaman Ayarlar\'dan tekrar başlatılabilir.'
    },
    {
      id: 2,
      title: 'Trend Araştırması 📈',
      description: 'AI çalışanlarımız sürekli olarak YouTube, Google ve sosyal medyayı tarayarak en popüler konuları bulur.',
      icon: <FiTrendingUp className="text-4xl text-green-400" />,
      highlight: 'Trendler',
      tip: 'Yüksek trend skorlu konular daha fazla izlenme potansiyeline sahip!'
    },
    {
      id: 3,
      title: 'Otomatik Video Üretimi 🎬',
      description: 'Bir trend seçin, AI\'mız senaryo yazar, ses metni oluşturur ve SEO optimizasyonu yapar.',
      icon: <FiVideo className="text-4xl text-blue-400" />,
      highlight: 'Video Oluştur',
      tip: 'Her video hedef kitleye göre otomatik ses seçimi yapar.'
    },
    {
      id: 4,
      title: 'Hedef Kitle Analizi 🎯',
      description: 'Sistem kategoriye göre hedef kitleyi otomatik belirler ve uygun ses tonunu seçer.',
      icon: <FiTarget className="text-4xl text-purple-400" />,
      tip: 'Gençler için enerjik, yetişkinler için profesyonel ses kullanılır.'
    },
    {
      id: 5,
      title: 'Otomatik Pilot 🚀',
      description: 'Kanalınızı tamamen otomatik yönetin. Haftalık video sayısı, yayın saatleri ve içerik stratejisini ayarlayın.',
      icon: <FiZap className="text-4xl text-yellow-400" />,
      highlight: 'Otomatik Pilot',
      tip: 'YouTube kurallarına %100 uyumlu içerik üretimi garantisi!'
    },
    {
      id: 6,
      title: 'Analitik & Büyüme 📊',
      description: 'Kanalınızın performansını takip edin, hangi içeriklerin işe yaradığını görün.',
      icon: <FiBarChart2 className="text-4xl text-cyan-400" />,
      tip: 'Düzenli içerik, düzenli büyüme demektir.'
    },
    {
      id: 7,
      title: 'Hazırsınız! ✨',
      description: 'Artık AutoTube AI\'yi kullanmaya başlayabilirsiniz. İlk videonuzu oluşturmak için Trendler sekmesine gidin!',
      icon: <FiStar className="text-4xl text-yellow-400" />,
      tip: 'Pro veya Premium planlarla daha fazla özellik açabilirsiniz.'
    }
  ]

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    setTimeout(() => onComplete(), 300)
  }

  const handleSkip = () => {
    setIsVisible(false)
    setTimeout(() => onSkip(), 300)
  }

  const step = tourSteps[currentStep]
  const progress = ((currentStep + 1) / tourSteps.length) * 100

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark-900/90 backdrop-blur-sm" onClick={handleSkip} />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg glass-effect rounded-2xl overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="h-1 bg-dark-700">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-sm text-gray-400">
                Adım {currentStep + 1} / {tourSteps.length}
              </span>
              <button
                onClick={handleSkip}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  {/* Icon */}
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-dark-800 flex items-center justify-center mb-6">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold mb-3">{step.title}</h2>

                  {/* Description */}
                  <p className="text-gray-400 mb-4">{step.description}</p>

                  {/* Highlight */}
                  {step.highlight && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm mb-4">
                      <FiArrowRight />
                      <span>Menüde: <strong>{step.highlight}</strong></span>
                    </div>
                  )}

                  {/* Tip */}
                  {step.tip && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-400">
                      💡 {step.tip}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-4 py-2 flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiArrowLeft />
                Geri
              </button>

              <div className="flex gap-1">
                {tourSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentStep ? 'w-6 bg-primary-500' : 
                      idx < currentStep ? 'bg-green-500' : 'bg-dark-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    Başla
                    <FiCheck />
                  </>
                ) : (
                  <>
                    İleri
                    <FiArrowRight />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
