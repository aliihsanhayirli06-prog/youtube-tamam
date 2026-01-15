'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiYoutube, FiCheck, FiAlertCircle, FiPlus } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import CreatingChannelView from '@/components/CreatingChannelView'

type SetupStep = 'question' | 'has-channel' | 'no-channel' | 'creating-channel'

export default function ChannelSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState<SetupStep>('question')
  const [isConnecting, setIsConnecting] = useState(false)

  const handleHasChannel = () => {
    setStep('has-channel')
  }

  const handleNoChannel = () => {
    setStep('creating-channel')
  }

  const handleConnectYouTube = () => {
    setIsConnecting(true)
    
    setTimeout(() => {
      toast.success('YouTube kanalı başarıyla bağlandı!')
      router.push('/dashboard')
      setIsConnecting(false)
    }, 2000)
  }

  const handleChannelCreated = () => {
    toast.success('Kanal oluşturuldu! Şimdi bağlayalım.')
    setStep('has-channel')
  }

  const handleCloseCreatingPanel = () => {
    setStep('no-channel')
  }

  return (
    <>
      {step === 'creating-channel' ? (
        <CreatingChannelView 
          onChannelCreated={handleChannelCreated}
          onClose={handleCloseCreatingPanel}
          onBack={() => setStep('question')}
        />
      ) : (
        <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {step === 'question' && (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-effect rounded-3xl p-8 md:p-12 neon-border text-center"
                >
                  <div className="inline-flex p-4 bg-primary-500/20 rounded-2xl mb-6">
                    <FiYoutube className="text-5xl text-primary-400" />
                  </div>
                  <h1 className="text-4xl font-bold mb-4 glow-text">YouTube Kanalınız Var mı?</h1>
                  <p className="text-xl text-gray-300 mb-10">
                    Platformunuzu başlatmak için YouTube kanalınızı bağlamanız gerekiyor
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleHasChannel}
                      className="glass-effect rounded-2xl p-8 hover:bg-white/20 transition-all text-left"
                    >
                      <FiCheck className="text-4xl text-green-400 mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Evet, Kanalım Var</h3>
                      <p className="text-gray-400">Mevcut kanalınızı bağlayın ve devam edin</p>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNoChannel}
                      className="glass-effect rounded-2xl p-8 hover:bg-white/20 transition-all text-left"
                    >
                      <FiPlus className="text-4xl text-primary-400 mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Hayır, Yeni Kanal</h3>
                      <p className="text-gray-400">Yeni bir YouTube kanalı oluşturun</p>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 'has-channel' && (
                <motion.div
                  key="has-channel"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-effect rounded-3xl p-8 md:p-12 neon-border"
                >
                  <button
                    onClick={() => setStep('question')}
                    className="text-gray-400 hover:text-white mb-6 transition-colors"
                  >
                    ← Geri
                  </button>

                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-3 glow-text">YouTube Kanalını Bağla</h1>
                    <p className="text-gray-300">Kanalınızı platform ile senkronize edin</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConnectYouTube}
                    disabled={isConnecting}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-500 rounded-xl font-semibold transition-all neon-border disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Bağlanıyor...
                      </>
                    ) : (
                      <>
                        <FiYoutube className="text-xl" />
                        YouTube ile Bağlan
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  )
}
