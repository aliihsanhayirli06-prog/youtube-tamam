'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiYoutube, FiPlay, FiPause, FiSkipForward, FiArrowLeft,
  FiTrendingUp, FiZap, FiVideo, FiSearch, FiCheck,
  FiCpu, FiBarChart2, FiUsers, FiStar
} from 'react-icons/fi'
import Link from 'next/link'

type DemoStep = {
  id: number
  title: string
  description: string
  icon: React.ElementType
  duration: number
  animation: 'trends' | 'workers' | 'video' | 'publish' | 'stats'
}

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: 'AI Trend Araştırması',
      description: 'Yapay zeka, YouTube, Google ve sosyal medyadan en güncel trendleri analiz eder.',
      icon: FiSearch,
      duration: 5000,
      animation: 'trends'
    },
    {
      id: 2,
      title: 'AI Çalışanlar Aktif',
      description: 'Senaryo yazarı, thumbnail tasarımcı ve SEO uzmanı çalışmaya başlar.',
      icon: FiCpu,
      duration: 5000,
      animation: 'workers'
    },
    {
      id: 3,
      title: 'Otomatik Video Üretimi',
      description: 'Tüm içerikler AI tarafından optimize edilerek hazırlanır.',
      icon: FiVideo,
      duration: 5000,
      animation: 'video'
    },
    {
      id: 4,
      title: 'Tek Tıkla Yayınlama',
      description: 'Video hazır olduğunda tek tıkla YouTube\'a yayınlayın.',
      icon: FiYoutube,
      duration: 5000,
      animation: 'publish'
    },
    {
      id: 5,
      title: 'Analitik & Büyüme',
      description: 'Performansı takip edin, AI önerilerini uygulayın, kanalınızı büyütün.',
      icon: FiBarChart2,
      duration: 5000,
      animation: 'stats'
    }
  ]

  useEffect(() => {
    if (!isPlaying) return

    const stepDuration = demoSteps[currentStep].duration
    const interval = 50
    const increment = (interval / stepDuration) * 100

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentStep < demoSteps.length - 1) {
            setCurrentStep(c => c + 1)
            return 0
          } else {
            setIsPlaying(false)
            return 100
          }
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, currentStep, demoSteps])

  const handleStepClick = (index: number) => {
    setCurrentStep(index)
    setProgress(0)
    setIsPlaying(true)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setProgress(0)
    setIsPlaying(true)
  }

  const currentAnimation = demoSteps[currentStep].animation

  return (
    <div className="min-h-screen animated-gradient">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <FiArrowLeft className="text-xl" />
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <FiYoutube className="text-xl text-primary-400" />
              </div>
              <span className="text-xl font-bold">AutoTube AI</span>
            </div>
          </Link>
          <Link 
            href="/register"
            className="px-6 py-2 bg-primary-600 rounded-lg hover:bg-primary-500 transition-all neon-border"
          >
            Hemen Başla
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">
            AutoTube AI Nasıl Çalışır?
          </h1>
          <p className="text-xl text-gray-400">
            5 adımda YouTube içerik üretiminizi otomatize edin
          </p>
        </motion.div>

        {/* Demo Area */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Animation Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-3xl p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {/* Trends Animation */}
              {currentAnimation === 'trends' && (
                <motion.div
                  key="trends"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-full"
                >
                  <div className="space-y-4">
                    {['Sora AI Video Üretimi', 'YouTube Shorts Stratejileri', 'AI Para Kazanma'].map((trend, i) => (
                      <motion.div
                        key={trend}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.3 }}
                        className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl"
                      >
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <FiTrendingUp className="text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{trend}</p>
                          <div className="w-full h-2 bg-dark-700 rounded-full mt-2 overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-green-500 to-primary-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${90 - i * 10}%` }}
                              transition={{ delay: i * 0.3 + 0.5, duration: 0.5 }}
                            />
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-green-400">{98 - i * 3}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Workers Animation */}
              {currentAnimation === 'workers' && (
                <motion.div
                  key="workers"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-full"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: '🔍', name: 'Araştırmacı', status: 'Tamamlandı' },
                      { icon: '✍️', name: 'Senaryo Yazarı', status: 'Çalışıyor' },
                      { icon: '🎨', name: 'Tasarımcı', status: 'Bekliyor' },
                      { icon: '📈', name: 'SEO Uzmanı', status: 'Bekliyor' }
                    ].map((worker, i) => (
                      <motion.div
                        key={worker.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="p-4 bg-dark-800/50 rounded-xl text-center"
                      >
                        <motion.div
                          animate={i === 1 ? { rotate: [0, 10, -10, 0] } : {}}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="text-4xl mb-2"
                        >
                          {worker.icon}
                        </motion.div>
                        <p className="font-semibold">{worker.name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          worker.status === 'Tamamlandı' ? 'bg-green-500/20 text-green-400' :
                          worker.status === 'Çalışıyor' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {worker.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Video Animation */}
              {currentAnimation === 'video' && (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-full text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-full max-w-sm mx-auto bg-dark-800/50 rounded-xl overflow-hidden"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center relative">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-16 h-16 rounded-full bg-primary-500/30 flex items-center justify-center"
                      >
                        <FiVideo className="text-3xl text-primary-400" />
                      </motion.div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4 }}
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500"
                      />
                    </div>
                    <div className="p-4 text-left">
                      <p className="font-semibold">Sora AI ile Video Üretimi - 2024 Rehberi</p>
                      <p className="text-sm text-gray-400 mt-1">AI tarafından oluşturuluyor...</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Publish Animation */}
              {currentAnimation === 'publish' && (
                <motion.div
                  key="publish"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-full text-center"
                >
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block"
                  >
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/30">
                      <FiYoutube className="text-5xl text-white" />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 rounded-full"
                  >
                    <FiCheck className="text-xl" />
                    <span className="font-semibold">Video Yayınlandı!</span>
                  </motion.div>
                </motion.div>
              )}

              {/* Stats Animation */}
              {currentAnimation === 'stats' && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-full"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'İzlenme', value: '2.4M', icon: FiBarChart2, color: 'text-blue-400' },
                      { label: 'Abone', value: '+45K', icon: FiUsers, color: 'text-green-400' },
                      { label: 'Trend Skoru', value: '98', icon: FiTrendingUp, color: 'text-yellow-400' },
                      { label: 'Video', value: '24', icon: FiVideo, color: 'text-purple-400' }
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.15 }}
                        className="p-4 bg-dark-800/50 rounded-xl text-center"
                      >
                        <stat.icon className={`text-3xl ${stat.color} mx-auto mb-2`} />
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.15 + 0.3 }}
                          className="text-2xl font-bold"
                        >
                          {stat.value}
                        </motion.p>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {demoSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === index
              const isCompleted = currentStep > index

              return (
                <motion.div
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    isActive 
                      ? 'glass-effect border-2 border-primary-500' 
                      : isCompleted
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-dark-800/30 border border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-primary-500/20' :
                      isCompleted ? 'bg-green-500/20' :
                      'bg-dark-700'
                    }`}>
                      {isCompleted ? (
                        <FiCheck className="text-xl text-green-400" />
                      ) : (
                        <Icon className={`text-xl ${isActive ? 'text-primary-400' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {step.title}
                        </h3>
                        <span className="text-xs text-gray-500">Adım {step.id}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                      {isActive && (
                        <div className="w-full h-1 bg-dark-700 rounded-full mt-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary-500 to-blue-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={handlePlayPause}
            className="px-6 py-3 glass-effect rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all"
          >
            {isPlaying ? <FiPause /> : <FiPlay />}
            {isPlaying ? 'Duraklat' : 'Oynat'}
          </button>
          <button
            onClick={handleRestart}
            className="px-6 py-3 glass-effect rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all"
          >
            <FiSkipForward />
            Baştan Başla
          </button>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-3xl p-8 md:p-12 text-center neon-border"
        >
          <h2 className="text-3xl font-bold mb-4 glow-text">Hemen Başlayın</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Ücretsiz hesap oluşturun ve YouTube kanalınızı 
            AI ile otomatize etmeye bugün başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-xl font-semibold transition-all neon-border flex items-center justify-center gap-2"
            >
              <FiZap />
              Ücretsiz Başla
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 glass-effect rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Giriş Yap
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
