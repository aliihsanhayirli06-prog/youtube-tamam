'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiYoutube, FiMail, FiLock, FiUser } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import SocialAuthButtons from '@/components/SocialAuthButtons'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor')
      return
    }

    setIsLoading(true)
    
    setTimeout(() => {
      toast.success('Hesap oluşturuldu!')
      router.push('/channel-setup')
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-effect rounded-3xl p-8 md:p-12 w-full max-w-md neon-border"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-primary-500/20 rounded-2xl mb-4">
            <FiYoutube className="text-4xl text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2 glow-text">Hesap Oluştur</h1>
          <p className="text-gray-400">Geleceğin içerik platformuna katıl</p>
        </div>

        <SocialAuthButtons mode="register" />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-dark-900 text-gray-400">veya e-posta ile</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="register-name" className="block text-sm font-medium mb-2">Ad Soyad</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="register-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full pl-12 pr-4 py-3 bg-dark-700 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all"
                placeholder="Adınız Soyadınız"
              />
            </div>
          </div>

          <div>
            <label htmlFor="register-email" className="block text-sm font-medium mb-2">E-posta</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="register-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full pl-12 pr-4 py-3 bg-dark-700 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="register-password" className="block text-sm font-medium mb-2">Şifre</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="register-password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full pl-12 pr-4 py-3 bg-dark-700 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="register-confirm" className="block text-sm font-medium mb-2">Şifre Tekrar</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="register-confirm"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))
                }
                className="w-full pl-12 pr-4 py-3 bg-dark-700 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 rounded-lg font-semibold transition-all neon-border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Oluşturuluyor...' : 'Hesap Oluştur'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Zaten hesabın var mı?{' '}
          <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">
            Giriş Yap
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
