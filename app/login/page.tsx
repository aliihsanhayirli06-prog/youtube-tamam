'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiYoutube, FiMail, FiLock } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import SocialAuthButtons from '@/components/SocialAuthButtons'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      toast.success('Giriş başarılı!')
      router.push('/dashboard')
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
          <h1 className="text-3xl font-bold mb-2 glow-text">Hoş Geldiniz</h1>
          <p className="text-gray-400">Hesabınıza giriş yapın</p>
        </div>

        <SocialAuthButtons mode="login" />

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
            <label className="block text-sm font-medium mb-2">E-posta</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-dark-700 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Şifre</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Hesabın yok mu?{' '}
          <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium">
            Kayıt Ol
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
