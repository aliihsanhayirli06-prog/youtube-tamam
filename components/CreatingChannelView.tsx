'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCheck, FiX, FiYoutube, FiAlertCircle, FiExternalLink } from 'react-icons/fi'

interface CreatingChannelViewProps {
  onChannelCreated: () => void
  onClose: () => void
  onBack: () => void
}

export default function CreatingChannelView({ onChannelCreated, onClose, onBack }: CreatingChannelViewProps) {
  const [youtubeWindow, setYoutubeWindow] = useState<Window | null>(null)

  const handleOpenYouTube = () => {
    const newWindow = window.open(
      'https://www.youtube.com/create_channel',
      'YouTubeChannelCreation',
      'width=1200,height=800,scrollbars=yes,resizable=yes'
    )
    setYoutubeWindow(newWindow)
  }

  const handleChannelReady = () => {
    if (youtubeWindow) {
      youtubeWindow.close()
    }
    onChannelCreated()
  }

  useEffect(() => {
    return () => {
      if (youtubeWindow) {
        youtubeWindow.close()
      }
    }
  }, [youtubeWindow])

  return (
    <div className="fixed inset-0 z-50 bg-dark-900/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-full max-w-7xl max-h-[90vh] glass-effect rounded-3xl neon-border overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <FiYoutube className="text-2xl text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">YouTube Kanalı Oluştur</h2>
              <p className="text-sm text-gray-400">Adım adım rehberi takip edin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2 glass-effect rounded-lg hover:bg-white/10 transition-colors text-sm"
            >
              Geri
            </button>
            <button
              onClick={onClose}
              className="p-2 glass-effect rounded-lg hover:bg-white/10 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 border-r border-white/10 relative bg-dark-800 flex items-center justify-center p-8">
            <div className="text-center max-w-lg">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/20">
                  <FiYoutube className="text-5xl text-white" />
                </div>
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-3 glow-text">YouTube Kanalı Oluşturun</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                YouTube'un güvenlik ve gizlilik politikaları gereği, kanal oluşturma 
                işlemi doğrudan YouTube'un resmi sitesinde yapılmalıdır.
              </p>
              <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-lg mt-0.5">✅</span>
                  <div>
                    <span className="font-semibold text-white">YouTube</span>
                    <span className="text-gray-400 text-sm">'un resmi politikalarına uygun</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-lg mt-0.5">✅</span>
                  <div>
                    <span className="font-semibold text-white">Güvenli</span>
                    <span className="text-gray-400 text-sm"> ve güvenilir kanal oluşturma</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-lg mt-0.5">✅</span>
                  <div>
                    <span className="font-semibold text-white">Adım</span>
                    <span className="text-gray-400 text-sm"> adım rehber yan tarafta</span>
                  </div>
                </div>
              </div>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenYouTube}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 mx-auto shadow-xl shadow-red-500/30 neon-border"
              >
                <FiExternalLink className="text-xl" />
                YouTube'da Kanal Oluştur
              </motion.button>
              
              <p className="text-xs text-gray-500 mt-4">
                Yeni bir pencerede açılacak. Kanal oluşturduktan sonra buraya dönün.
              </p>
            </div>
          </div>

          <div className="w-96 bg-dark-800/50 overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <FiAlertCircle className="text-primary-400" />
                  Adım Adım Rehber
                </h3>
                <p className="text-sm text-gray-400">
                  Sol taraftaki butona tıklayarak YouTube kanal oluşturma sayfasını açın.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-500/20 to-primary-500/20 rounded-xl border border-green-500/30 p-5"
              >
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FiCheck className="text-green-400" />
                  Kanalınız Hazır mı?
                </h4>
                <p className="text-sm text-gray-300 mb-4">
                  Tüm adımları tamamladıysanız, kanalınızı bağlamak için butona tıklayın.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleChannelReady}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-primary-500 hover:from-green-400 hover:to-primary-400 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <FiCheck />
                  Kanalım Hazır, Devam Et
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
