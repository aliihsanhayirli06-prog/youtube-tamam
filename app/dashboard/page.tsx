'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiYoutube, FiSettings, FiTrendingUp, FiBarChart2, FiVideo, FiZap,
  FiPlay, FiClock, FiEye, FiThumbsUp, FiPlus, FiRefreshCw, FiSearch,
  FiFilter, FiMoreVertical, FiEdit, FiTrash2, FiCalendar, FiUsers,
  FiArrowUp, FiArrowDown, FiExternalLink, FiCheckCircle, FiAlertCircle,
  FiLoader, FiStar, FiTarget, FiCpu, FiBook, FiHelpCircle, FiPackage, FiGift
} from 'react-icons/fi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAppStore, Video, TrendTopic, AIWorker } from '@/lib/store'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import OnboardingTour from '@/components/OnboardingTour'
import UpsellModal from '@/components/UpsellModal'

type TabType = 'overview' | 'videos' | 'trends' | 'workers'

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [videoFilter, setVideoFilter] = useState<Video['status'] | 'all'>('all')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showUpsell, setShowUpsell] = useState(false)
  const [upsellType, setUpsellType] = useState<'feature' | 'update' | 'channel' | 'limit'>('update')

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('autotube_tour_completed')
    if (!hasSeenTour) {
      setShowOnboarding(true)
    }
    const visitCount = parseInt(localStorage.getItem('autotube_visit_count') || '0')
    localStorage.setItem('autotube_visit_count', String(visitCount + 1))
    if (visitCount > 0 && visitCount % 5 === 0) {
      setTimeout(() => {
        setUpsellType('update')
        setShowUpsell(true)
      }, 2000)
    }
  }, [])

  const handleTourComplete = () => {
    localStorage.setItem('autotube_tour_completed', 'true')
    setShowOnboarding(false)
    toast.success('Harika! Artık AutoTube AI\'yı kullanabilirsiniz.')
  }

  const handleTourSkip = () => {
    localStorage.setItem('autotube_tour_completed', 'true')
    setShowOnboarding(false)
  }

  const handleRestartTour = () => {
    setShowOnboarding(true)
  }
  
  const { 
    user, stats, videos, trendTopics, aiWorkers,
    refreshTrends, generateVideo, deleteVideo, updateVideo
  } = useAppStore()
  
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = videoFilter === 'all' || video.status === videoFilter
    return matchesSearch && matchesFilter
  })

  const handleRefreshTrends = async () => {
    toast.promise(refreshTrends(), {
      loading: 'Trendler araştırılıyor...',
      success: 'Yeni trendler bulundu!',
      error: 'Bir hata oluştu'
    })
  }

  const handleGenerateVideo = async (topic: TrendTopic) => {
    const videoId = await toast.promise(generateVideo(topic), {
      loading: 'Video oluşturuluyor...',
      success: 'Video başarıyla oluşturuldu!',
      error: 'Bir hata oluştu'
    })
    setTimeout(() => {
      router.push(`/dashboard/videos/${videoId}`)
    }, 1000)
  }

  const handlePublishVideo = (video: Video) => {
    updateVideo(video.id, { status: 'published', publishedAt: new Date().toISOString() })
    toast.success('Video yayınlandı!')
  }

  const handleDeleteVideo = (video: Video) => {
    deleteVideo(video.id)
    toast.success('Video silindi!')
  }

  const getStatusColor = (status: Video['status']) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'ready': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'scheduled': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = (status: Video['status']) => {
    switch (status) {
      case 'published': return 'Yayında'
      case 'ready': return 'Hazır'
      case 'processing': return 'İşleniyor'
      case 'scheduled': return 'Planlandı'
      case 'draft': return 'Taslak'
      default: return status
    }
  }

  const getWorkerStatusColor = (status: AIWorker['status']) => {
    switch (status) {
      case 'working': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Genel Bakış', icon: FiBarChart2 },
    { id: 'videos' as TabType, label: 'Videolar', icon: FiVideo },
    { id: 'trends' as TabType, label: 'Trendler', icon: FiTrendingUp },
    { id: 'workers' as TabType, label: 'AI Çalışanlar', icon: FiCpu }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <FiYoutube className="text-2xl text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AutoTube AI</h1>
              <p className="text-xs text-gray-400">{user.channelName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 rounded-lg border border-primary-500/20">
              <FiStar className="text-primary-400" />
              <span className="text-sm font-medium capitalize">{user.plan} Plan</span>
            </div>
            <Link href="/dashboard/settings" className="p-2 glass-effect rounded-lg hover:bg-white/10 transition-colors">
              <FiSettings className="text-xl" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'glass-effect text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="text-lg" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Toplam Video', value: stats.totalVideos, icon: FiVideo, color: 'text-blue-400', change: '+3' },
                { label: 'Toplam İzlenme', value: `${(stats.totalViews / 1000000).toFixed(1)}M`, icon: FiEye, color: 'text-green-400', change: '+12%' },
                { label: 'Abone', value: `${(stats.subscribers / 1000).toFixed(1)}K`, icon: FiUsers, color: 'text-purple-400', change: '+5.2%' },
                { label: 'Trend Skoru', value: stats.trendScore, icon: FiTrendingUp, color: 'text-yellow-400', change: '+8' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <stat.icon className={`text-2xl ${stat.color}`} />
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <FiArrowUp className="text-xs" />
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FiZap className="text-yellow-400" />
                  Hızlı İşlemler
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleRefreshTrends} className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all text-left">
                    <FiSearch className="text-2xl text-blue-400 mb-2" />
                    <p className="font-semibold">Trend Ara</p>
                  </button>
                  <button onClick={() => setActiveTab('trends')} className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all text-left">
                    <FiPlus className="text-2xl text-green-400 mb-2" />
                    <p className="font-semibold">Video Oluştur</p>
                  </button>
                  <Link href="/dashboard/autopilot" className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all text-left">
                    <FiZap className="text-2xl text-purple-400 mb-2" />
                    <p className="font-semibold">Otomatik Pilot</p>
                  </Link>
                  <Link href="/dashboard/premium" className="p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all text-left">
                    <FiStar className="text-2xl text-yellow-400 mb-2" />
                    <p className="font-semibold">Premium</p>
                  </Link>
                  <Link href="/dashboard/templates" className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all text-left">
                    <FiPackage className="text-2xl text-blue-400 mb-2" />
                    <p className="font-semibold">Templates</p>
                  </Link>
                  <Link href="/dashboard/export" className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all text-left">
                    <FiExternalLink className="text-2xl text-green-400 mb-2" />
                    <p className="font-semibold">Export/ZIP</p>
                  </Link>
                  <Link href="/dashboard/referral" className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all text-left">
                    <FiGift className="text-2xl text-purple-400 mb-2" />
                    <p className="font-semibold">Referral</p>
                  </Link>
                </div>
              </div>

              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FiCpu className="text-primary-400" />
                  AI Çalışanlar
                </h3>
                <div className="space-y-3">
                  {aiWorkers.slice(0, 4).map((worker) => (
                    <div key={worker.id} className="flex items-center gap-3">
                      <span className="text-2xl">{worker.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium truncate">{worker.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getWorkerStatusColor(worker.status)}`}>
                            {worker.status === 'working' ? 'Çalışıyor' : 
                             worker.status === 'completed' ? 'Tamamlandı' :
                             worker.status === 'error' ? 'Hata' : 'Beklemede'}
                          </span>
                        </div>
                        {worker.status === 'working' && (
                          <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary-500 to-blue-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${worker.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Trend Konular</h2>
                <p className="text-gray-400">AI tarafından keşfedilen en popüler konular</p>
              </div>
              <button onClick={handleRefreshTrends} className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg font-medium flex items-center gap-2 transition-all">
                <FiRefreshCw />
                Yeni Trendleri Ara
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {trendTopics.map((trend, index) => (
                <div key={trend.id} className="glass-effect rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold ${
                        trend.trendScore >= 90 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {trend.trendScore}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{trend.title}</h3>
                        <p className="text-sm text-gray-400">{trend.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-2 bg-dark-800/50 rounded-lg">
                      <p className="text-lg font-bold text-green-400">{trend.growthRate}</p>
                      <p className="text-xs text-gray-500">Büyüme</p>
                    </div>
                    <div className="text-center p-2 bg-dark-800/50 rounded-lg">
                      <p className="text-lg font-bold">{trend.searchVolume}</p>
                      <p className="text-xs text-gray-500">Arama</p>
                    </div>
                    <div className="text-center p-2 bg-dark-800/50 rounded-lg">
                      <p className={`text-lg font-bold ${trend.competition === 'low' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {trend.competition === 'low' ? 'Düşük' : trend.competition === 'medium' ? 'Orta' : 'Yüksek'}
                      </p>
                      <p className="text-xs text-gray-500">Rekabet</p>
                    </div>
                  </div>
                  <button onClick={() => handleGenerateVideo(trend)} className="w-full py-2 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 rounded-lg font-medium text-sm flex items-center justify-center gap-2">
                    <FiZap />
                    Video Oluştur
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Video ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div key={video.id} className="glass-effect rounded-xl overflow-hidden">
                  <Link href={`/dashboard/videos/${video.id}`} className="block relative">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(video.status)}`}>
                        {getStatusText(video.status)}
                      </span>
                    </div>
                  </Link>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1"><FiEye /> {video.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><FiThumbsUp /> {video.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/videos/${video.id}`} className="flex-1 py-2 glass-effect hover:bg-white/10 rounded-lg text-sm font-medium text-center">İzle</Link>
                      {video.status === 'ready' && (
                        <button onClick={() => handlePublishVideo(video)} className="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium">Yayınla</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">AI Çalışanlar</h2>
              <p className="text-gray-400">Yapay zeka destekli otomasyon ekibiniz</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiWorkers.map((worker) => (
                <div key={worker.id} className="glass-effect rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-blue-500/20 flex items-center justify-center text-4xl">
                      {worker.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{worker.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getWorkerStatusColor(worker.status)}`}>
                        {worker.status === 'working' ? 'Çalışıyor' : worker.status === 'completed' ? 'Tamamlandı' : worker.status === 'error' ? 'Hata' : 'Beklemede'}
                      </span>
                    </div>
                  </div>
                  {worker.status === 'working' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{worker.currentTask}</span>
                        <span className="text-primary-400">{worker.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-blue-500" style={{ width: `${worker.progress}%` }} />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <p className="text-2xl font-bold">{worker.tasksCompleted}</p>
                      <p className="text-xs text-gray-500">Tamamlanan</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${worker.status === 'working' ? 'bg-yellow-400 animate-pulse' : worker.status === 'completed' ? 'bg-green-400' : 'bg-gray-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-40">
        <Link href="/dashboard/guide" className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Kanal Rehberi">
          <FiBook />
        </Link>
        <button onClick={handleRestartTour} className="w-12 h-12 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Turu Tekrar Başlat">
          <FiHelpCircle />
        </button>
        <Link href="/dashboard/channels/new" className="w-12 h-12 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Yeni Kanal Oluştur">
          <FiPlus />
        </Link>
      </div>

      {showOnboarding && (
        <OnboardingTour onComplete={handleTourComplete} onSkip={handleTourSkip} />
      )}

      <UpsellModal isOpen={showUpsell} onClose={() => setShowUpsell(false)} type={upsellType} />
    </div>
  )
}
