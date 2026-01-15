'use client'

import { motion } from 'framer-motion'
import { FiYoutube, FiShield, FiCheck } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface SocialAuthButtonsProps {
  mode?: 'login' | 'register'
}

export default function SocialAuthButtons({ mode = 'login' }: SocialAuthButtonsProps) {
  const router = useRouter()

  const handleGoogleAuth = () => {
    toast.success('Google ile giriş yapılıyor...')
    setTimeout(() => {
      toast.success('Google ile giriş başarılı!')
      router.push('/channel-setup')
    }, 1500)
  }

  const handleYouTubeAuth = () => {
    toast.success('YouTube ile giriş yapılıyor...')
    setTimeout(() => {
      toast.success('YouTube kanalı bağlandı ve giriş yapıldı!')
      router.push('/dashboard')
    }, 1500)
  }

  const handleFacebookAuth = () => {
    toast.success('Facebook ile giriş yapılıyor...')
    setTimeout(() => {
      toast.success('Facebook ile giriş başarılı!')
      router.push('/channel-setup')
    }, 1500)
  }

  const providers = [
    {
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      color: 'text-gray-700',
      bgColor: 'bg-white hover:bg-gray-50 border border-gray-200/50',
      hoverColor: 'hover:shadow-xl hover:shadow-white/10',
      handleAuth: handleGoogleAuth
    },
    {
      name: 'YouTube',
      icon: <FiYoutube className="w-5 h-5" />,
      color: 'text-white',
      bgColor: 'bg-gradient-to-r from-[#FF0000] to-[#CC0000] hover:from-[#FF1a1a] hover:to-[#E60000]',
      hoverColor: 'hover:shadow-xl hover:shadow-red-500/30',
      handleAuth: handleYouTubeAuth
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'text-white',
      bgColor: 'bg-gradient-to-r from-[#1877F2] to-[#166FE5] hover:from-[#1a7cff] hover:to-[#1875f0]',
      hoverColor: 'hover:shadow-xl hover:shadow-blue-500/30',
      handleAuth: handleFacebookAuth
    }
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {providers.map((provider, index) => (
          <motion.button
            key={provider.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={provider.handleAuth}
            className={`group relative w-full py-3.5 px-5 ${provider.bgColor} ${provider.color} rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 ${provider.hoverColor} overflow-hidden`}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            
            <span className="relative z-10 flex-shrink-0 flex items-center justify-center w-5 h-5">
              {provider.icon}
            </span>
            <span className="relative z-10 flex-1 text-left text-sm font-semibold">
              {provider.name} ile {mode === 'login' ? 'Giriş Yap' : 'Devam Et'}
            </span>
            {provider.name === 'YouTube' && (
              <span className="relative z-10 text-xs bg-white/25 backdrop-blur-sm px-2.5 py-1 rounded-full font-medium">
                Kanal Bağlantılı
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center justify-center gap-6 flex-wrap text-xs">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1.5 text-gray-500 hover:text-green-400 transition-colors"
          >
            <FiShield className="text-green-400 text-sm" />
            <span>256-bit SSL</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1.5 text-gray-500 hover:text-blue-400 transition-colors"
          >
            <FiCheck className="text-blue-400 text-sm" />
            <span>OAuth 2.0</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-1.5 text-gray-500 hover:text-purple-400 transition-colors"
          >
            <FiShield className="text-purple-400 text-sm" />
            <span>Güvenli Giriş</span>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-gray-600 mt-3"
        >
          Güvenilir platformlar ile hızlı ve güvenli giriş
        </motion.p>
      </div>
    </div>
  )
}
