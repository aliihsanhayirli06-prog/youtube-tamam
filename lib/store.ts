'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
// Hedef Kitle ve Ses Ayarları
export interface TargetAudience {
  ageGroup: 'children' | 'teen' | 'young-adult' | 'adult' | 'senior'
  gender: 'male' | 'female' | 'mixed'
  interests: string[]
  language: string
  region: string
}

export interface VoiceSettings {
  voiceType: 'male-young' | 'male-mature' | 'female-young' | 'female-mature' | 'child' | 'narrator'
  speed: number // 0.5 - 2
  pitch: number // 0 - 2
  emotion: 'energetic' | 'calm' | 'professional' | 'friendly' | 'dramatic'
}

export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  status: 'draft' | 'processing' | 'ready' | 'published' | 'scheduled'
  views: number
  likes: number
  createdAt: string
  publishedAt?: string
  scheduledAt?: string
  trendScore: number
  tags: string[]
  // İçerik
  script?: string
  voiceText?: string
  duration?: number
  chapters?: { time: string; title: string }[]
  // Hedef Kitle & Ses
  targetAudience?: TargetAudience
  voiceSettings?: VoiceSettings
}

export interface TrendTopic {
  id: string
  title: string
  category: string
  targetAudience?: TargetAudience
  trendScore: number
  searchVolume: string
  competition: 'low' | 'medium' | 'high'
  growthRate: string
  relatedKeywords: string[]
  suggestedTitles: string[]
  source: 'youtube' | 'google' | 'twitter' | 'tiktok'
  discoveredAt: string
}

export interface AIWorker {
  id: string
  name: string
  type: 'trend-researcher' | 'script-writer' | 'thumbnail-creator' | 'seo-optimizer' | 'scheduler'
  status: 'idle' | 'working' | 'completed' | 'error'
  currentTask?: string
  progress: number
  tasksCompleted: number
  icon: string
}

export interface UserStats {
  totalVideos: number
  totalViews: number
  subscribers: number
  trendScore: number
  videosThisMonth: number
  avgViews: number
}

// Hedef Kitle Seçim Fonksiyonu - Kategoriye göre otomatik belirleme
function selectTargetAudience(category: string, keywords: string[]): TargetAudience {
  const keywordsLower = keywords.map(k => k.toLowerCase()).join(' ')
  
  // Kategori ve anahtar kelimelere göre hedef kitle belirle
  const audienceMap: Record<string, Partial<TargetAudience>> = {
    'Teknoloji': { ageGroup: 'young-adult', gender: 'mixed', interests: ['teknoloji', 'yazılım', 'gadget'] },
    'Yapay Zeka': { ageGroup: 'young-adult', gender: 'mixed', interests: ['yapay zeka', 'makine öğrenmesi', 'otomasyon'] },
    'Oyun': { ageGroup: 'teen', gender: 'male', interests: ['oyun', 'e-spor', 'gaming'] },
    'Finans': { ageGroup: 'adult', gender: 'mixed', interests: ['yatırım', 'kripto', 'borsa'] },
    'Eğitim': { ageGroup: 'teen', gender: 'mixed', interests: ['öğrenme', 'ders', 'sınav'] },
    'Sağlık': { ageGroup: 'adult', gender: 'female', interests: ['sağlık', 'fitness', 'beslenme'] },
    'Eğlence': { ageGroup: 'teen', gender: 'mixed', interests: ['eğlence', 'komedi', 'viral'] },
    'Müzik': { ageGroup: 'young-adult', gender: 'mixed', interests: ['müzik', 'şarkı', 'sanatçı'] },
    'Spor': { ageGroup: 'young-adult', gender: 'male', interests: ['futbol', 'basketbol', 'spor'] },
    'Yemek': { ageGroup: 'adult', gender: 'female', interests: ['yemek', 'tarif', 'mutfak'] },
    'Moda': { ageGroup: 'young-adult', gender: 'female', interests: ['moda', 'stil', 'giyim'] },
    'Seyahat': { ageGroup: 'young-adult', gender: 'mixed', interests: ['seyahat', 'gezi', 'tatil'] },
    'İş': { ageGroup: 'adult', gender: 'mixed', interests: ['iş', 'kariyer', 'girişimcilik'] },
    'Çocuk': { ageGroup: 'children', gender: 'mixed', interests: ['çocuk', 'çizgi film', 'eğitici'] }
  }

  // Anahtar kelimelerden yaş grubu tahmini
  let detectedAge: TargetAudience['ageGroup'] = 'young-adult'
  if (keywordsLower.includes('çocuk') || keywordsLower.includes('kids') || keywordsLower.includes('çizgi')) {
    detectedAge = 'children'
  } else if (keywordsLower.includes('genç') || keywordsLower.includes('teen') || keywordsLower.includes('tiktok')) {
    detectedAge = 'teen'
  } else if (keywordsLower.includes('emekli') || keywordsLower.includes('yaşlı') || keywordsLower.includes('senior')) {
    detectedAge = 'senior'
  } else if (keywordsLower.includes('profesyonel') || keywordsLower.includes('iş') || keywordsLower.includes('yatırım')) {
    detectedAge = 'adult'
  }

  const baseAudience = audienceMap[category] || { 
    ageGroup: 'young-adult', 
    gender: 'mixed', 
    interests: ['genel'] 
  }

  return {
    ageGroup: baseAudience.ageGroup || detectedAge,
    gender: baseAudience.gender || 'mixed',
    interests: baseAudience.interests || keywords.slice(0, 3),
    language: 'tr-TR',
    region: 'Türkiye'
  }
}

// Hedef Kitleye Göre Ses Seçim Fonksiyonu
function selectVoiceForAudience(audience: TargetAudience): VoiceSettings {
  // Yaş grubu ve cinsiyete göre ses tipi belirleme
  const voiceMap: Record<string, Record<string, VoiceSettings>> = {
    'children': {
      'mixed': { voiceType: 'female-young', speed: 0.9, pitch: 1.3, emotion: 'friendly' },
      'male': { voiceType: 'female-young', speed: 0.9, pitch: 1.3, emotion: 'friendly' },
      'female': { voiceType: 'female-young', speed: 0.9, pitch: 1.3, emotion: 'friendly' }
    },
    'teen': {
      'mixed': { voiceType: 'male-young', speed: 1.1, pitch: 1.1, emotion: 'energetic' },
      'male': { voiceType: 'male-young', speed: 1.1, pitch: 1.0, emotion: 'energetic' },
      'female': { voiceType: 'female-young', speed: 1.1, pitch: 1.1, emotion: 'energetic' }
    },
    'young-adult': {
      'mixed': { voiceType: 'male-young', speed: 1.0, pitch: 1.0, emotion: 'professional' },
      'male': { voiceType: 'male-young', speed: 1.0, pitch: 0.9, emotion: 'professional' },
      'female': { voiceType: 'female-young', speed: 1.0, pitch: 1.1, emotion: 'friendly' }
    },
    'adult': {
      'mixed': { voiceType: 'male-mature', speed: 0.95, pitch: 0.9, emotion: 'professional' },
      'male': { voiceType: 'male-mature', speed: 0.95, pitch: 0.85, emotion: 'professional' },
      'female': { voiceType: 'female-mature', speed: 0.95, pitch: 1.0, emotion: 'calm' }
    },
    'senior': {
      'mixed': { voiceType: 'male-mature', speed: 0.85, pitch: 0.85, emotion: 'calm' },
      'male': { voiceType: 'male-mature', speed: 0.85, pitch: 0.8, emotion: 'calm' },
      'female': { voiceType: 'female-mature', speed: 0.85, pitch: 0.95, emotion: 'calm' }
    }
  }

  // İlgi alanlarına göre duygu ayarla
  const interests = audience.interests.join(' ').toLowerCase()
  let emotion: VoiceSettings['emotion'] = 'professional'
  
  if (interests.includes('eğlence') || interests.includes('komedi') || interests.includes('viral')) {
    emotion = 'energetic'
  } else if (interests.includes('meditasyon') || interests.includes('yoga') || interests.includes('sağlık')) {
    emotion = 'calm'
  } else if (interests.includes('haber') || interests.includes('belgesel') || interests.includes('tarih')) {
    emotion = 'dramatic'
  } else if (interests.includes('çocuk') || interests.includes('eğitici')) {
    emotion = 'friendly'
  }

  const baseVoice = voiceMap[audience.ageGroup]?.[audience.gender] || 
    { voiceType: 'male-young' as const, speed: 1.0, pitch: 1.0, emotion: 'professional' as const }

  return {
    ...baseVoice,
    emotion
  }
}

// Hedef Kitle Etiketi
function getAudienceLabel(audience: TargetAudience): string {
  const ageLabels: Record<string, string> = {
    'children': '👶 Çocuklar (0-12)',
    'teen': '🧒 Gençler (13-17)',
    'young-adult': '👨 Genç Yetişkinler (18-35)',
    'adult': '👔 Yetişkinler (35-55)',
    'senior': '👴 İleri Yaş (55+)'
  }
  const genderLabels: Record<string, string> = {
    'male': 'Erkek',
    'female': 'Kadın',
    'mixed': 'Karma'
  }
  return `${ageLabels[audience.ageGroup]} - ${genderLabels[audience.gender]}`
}

// Ses Tipi Etiketi  
function getVoiceLabel(voice: VoiceSettings): string {
  const typeLabels: Record<string, string> = {
    'male-young': '🎙️ Genç Erkek',
    'male-mature': '🎙️ Olgun Erkek',
    'female-young': '🎙️ Genç Kadın',
    'female-mature': '🎙️ Olgun Kadın',
    'child': '🎙️ Çocuk',
    'narrator': '🎙️ Anlatıcı'
  }
  const emotionLabels: Record<string, string> = {
    'energetic': 'Enerjik',
    'calm': 'Sakin',
    'professional': 'Profesyonel',
    'friendly': 'Samimi',
    'dramatic': 'Dramatik'
  }
  return `${typeLabels[voice.voiceType]} - ${emotionLabels[voice.emotion]} (Hız: ${voice.speed}x)`
}

interface AppState {
  // User
  user: {
    name: string
    email: string
    avatar: string
    channelConnected: boolean
    channelName: string
    plan: 'free' | 'pro' | 'premium'
  }
  
  // Stats
  stats: UserStats
  
  // Videos
  videos: Video[]
  addVideo: (video: Video) => void
  updateVideo: (id: string, updates: Partial<Video>) => void
  deleteVideo: (id: string) => void
  
  // Trends
  trendTopics: TrendTopic[]
  setTrendTopics: (topics: TrendTopic[]) => void
  addTrendTopic: (topic: TrendTopic) => void
  
  // AI Workers
  aiWorkers: AIWorker[]
  updateWorkerStatus: (id: string, status: AIWorker['status'], task?: string, progress?: number) => void
  
  // Actions
  refreshTrends: () => Promise<void>
  generateVideo: (topic: TrendTopic) => Promise<string>
}

// Mock data
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'AI ile Para Kazanmanın 10 Yolu - 2024',
    description: 'Bu videoda yapay zeka kullanarak para kazanmanın en etkili yollarını anlatıyorum.',
    thumbnail: 'https://picsum.photos/seed/vid1/320/180',
    status: 'published',
    views: 45200,
    likes: 2340,
    createdAt: '2024-01-15T10:00:00Z',
    publishedAt: '2024-01-16T14:00:00Z',
    trendScore: 92,
    tags: ['AI', 'para kazanma', 'yapay zeka', '2024']
  },
  {
    id: '2',
    title: 'ChatGPT ile Otomatik İçerik Üretimi',
    description: 'ChatGPT kullanarak otomatik içerik üretmenin sırları.',
    thumbnail: 'https://picsum.photos/seed/vid2/320/180',
    status: 'published',
    views: 32100,
    likes: 1890,
    createdAt: '2024-01-20T08:00:00Z',
    publishedAt: '2024-01-21T12:00:00Z',
    trendScore: 88,
    tags: ['ChatGPT', 'içerik üretimi', 'otomasyon']
  },
  {
    id: '3',
    title: 'YouTube Shorts ile Viral Olmanın Sırları',
    description: 'Shorts videoları ile viral olma stratejileri.',
    thumbnail: 'https://picsum.photos/seed/vid3/320/180',
    status: 'ready',
    views: 0,
    likes: 0,
    createdAt: '2024-01-25T15:00:00Z',
    trendScore: 95,
    tags: ['YouTube Shorts', 'viral', 'strateji']
  },
  {
    id: '4',
    title: 'Pasif Gelir: YouTube Otomasyonu',
    description: 'YouTube kanalınızı otomatize ederek pasif gelir elde edin.',
    thumbnail: 'https://picsum.photos/seed/vid4/320/180',
    status: 'processing',
    views: 0,
    likes: 0,
    createdAt: '2024-01-28T09:00:00Z',
    trendScore: 85,
    tags: ['pasif gelir', 'otomasyon', 'YouTube']
  },
  {
    id: '5',
    title: '2024 YouTube Algoritması Değişiklikleri',
    description: 'YouTube algoritmasındaki son değişiklikler ve uyum stratejileri.',
    thumbnail: 'https://picsum.photos/seed/vid5/320/180',
    status: 'scheduled',
    views: 0,
    likes: 0,
    createdAt: '2024-01-29T11:00:00Z',
    scheduledAt: '2024-02-01T16:00:00Z',
    trendScore: 91,
    tags: ['YouTube algoritması', '2024', 'SEO']
  }
]

const mockTrends: TrendTopic[] = [
  {
    id: '1',
    title: 'Sora AI Video Üretimi',
    category: 'Teknoloji',
    trendScore: 98,
    searchVolume: '2.4M',
    competition: 'low',
    growthRate: '+340%',
    relatedKeywords: ['sora openai', 'ai video generator', 'text to video ai'],
    suggestedTitles: [
      'Sora AI ile Video Üretimi - Başlangıç Rehberi',
      'OpenAI Sora Nedir? Tüm Detaylar',
      'Sora vs Diğer AI Video Araçları'
    ],
    source: 'youtube',
    discoveredAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Claude 3 Opus Özellikleri',
    category: 'Yapay Zeka',
    trendScore: 94,
    searchVolume: '890K',
    competition: 'medium',
    growthRate: '+180%',
    relatedKeywords: ['claude ai', 'anthropic', 'chatgpt alternatifi'],
    suggestedTitles: [
      'Claude 3 vs ChatGPT 4 - Hangisi Daha İyi?',
      'Claude 3 Opus ile Neler Yapabilirsiniz?',
      'En Güçlü AI Modeli: Claude 3'
    ],
    source: 'google',
    discoveredAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'YouTube Shorts Monetizasyon',
    category: 'YouTube',
    trendScore: 91,
    searchVolume: '1.2M',
    competition: 'high',
    growthRate: '+95%',
    relatedKeywords: ['shorts para kazanma', 'youtube shorts gelir', 'shorts monetization'],
    suggestedTitles: [
      'YouTube Shorts ile Ayda 10.000$ Kazanmak',
      'Shorts Monetizasyon Şartları 2024',
      'Shorts vs Normal Video - Hangisi Daha Karlı?'
    ],
    source: 'youtube',
    discoveredAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Midjourney V6 Güncellemesi',
    category: 'AI Sanat',
    trendScore: 89,
    searchVolume: '650K',
    competition: 'medium',
    growthRate: '+220%',
    relatedKeywords: ['midjourney v6', 'ai art', 'ai image generator'],
    suggestedTitles: [
      'Midjourney V6 Yeni Özellikler',
      'Midjourney ile Profesyonel Görseller',
      'V6 vs V5 - Fark Nedir?'
    ],
    source: 'twitter',
    discoveredAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Gemini Pro API Kullanımı',
    category: 'Geliştirici',
    trendScore: 86,
    searchVolume: '420K',
    competition: 'low',
    growthRate: '+150%',
    relatedKeywords: ['gemini api', 'google ai', 'gemini pro tutorial'],
    suggestedTitles: [
      'Gemini Pro API ile Uygulama Geliştirme',
      'Google Gemini vs OpenAI GPT-4',
      'Ücretsiz Gemini API Nasıl Kullanılır?'
    ],
    source: 'google',
    discoveredAt: new Date().toISOString()
  }
]

const mockAIWorkers: AIWorker[] = [
  {
    id: 'trend-1',
    name: 'Trend Araştırmacı',
    type: 'trend-researcher',
    status: 'idle',
    progress: 0,
    tasksCompleted: 156,
    icon: '🔍'
  },
  {
    id: 'script-1',
    name: 'Senaryo Yazarı',
    type: 'script-writer',
    status: 'idle',
    progress: 0,
    tasksCompleted: 89,
    icon: '✍️'
  },
  {
    id: 'thumb-1',
    name: 'Thumbnail Tasarımcı',
    type: 'thumbnail-creator',
    status: 'idle',
    progress: 0,
    tasksCompleted: 134,
    icon: '🎨'
  },
  {
    id: 'seo-1',
    name: 'SEO Optimizer',
    type: 'seo-optimizer',
    status: 'idle',
    progress: 0,
    tasksCompleted: 201,
    icon: '📈'
  },
  {
    id: 'scheduler-1',
    name: 'Zamanlayıcı',
    type: 'scheduler',
    status: 'idle',
    progress: 0,
    tasksCompleted: 67,
    icon: '⏰'
  }
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: {
        name: 'Demo Kullanıcı',
        email: 'demo@autotube.ai',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        channelConnected: true,
        channelName: 'AutoTube Demo Channel',
        plan: 'free'
      },
      
      // Stats
      stats: {
        totalVideos: 24,
        totalViews: 2400000,
        subscribers: 45200,
        trendScore: 92,
        videosThisMonth: 8,
        avgViews: 100000
      },
      
      // Videos
      videos: mockVideos,
      addVideo: (video) => set((state) => ({ 
        videos: [video, ...state.videos],
        stats: { ...state.stats, totalVideos: state.stats.totalVideos + 1 }
      })),
      updateVideo: (id, updates) => set((state) => ({
        videos: state.videos.map(v => v.id === id ? { ...v, ...updates } : v)
      })),
      deleteVideo: (id) => set((state) => ({
        videos: state.videos.filter(v => v.id !== id),
        stats: { ...state.stats, totalVideos: state.stats.totalVideos - 1 }
      })),
      
      // Trends
      trendTopics: mockTrends,
      setTrendTopics: (topics) => set({ trendTopics: topics }),
      addTrendTopic: (topic) => set((state) => ({
        trendTopics: [topic, ...state.trendTopics]
      })),
      
      // AI Workers
      aiWorkers: mockAIWorkers,
      updateWorkerStatus: (id, status, task, progress) => set((state) => ({
        aiWorkers: state.aiWorkers.map(w => 
          w.id === id 
            ? { 
                ...w, 
                status, 
                currentTask: task,
                progress: progress ?? w.progress,
                tasksCompleted: status === 'completed' ? w.tasksCompleted + 1 : w.tasksCompleted
              } 
            : w
        )
      })),
      
      // Actions
      refreshTrends: async () => {
        const { updateWorkerStatus } = get()
        const spendCredits = async () => {
          const res = await fetch('/api/credits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'spend', amount: 1, reason: 'SPEND_TREND' })
          })
          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data?.error || 'Kredi yetersiz.')
          }
        }

        await spendCredits()
        
        // Start trend researcher
        updateWorkerStatus('trend-1', 'working', 'Trendleri analiz ediyor...', 0)
        
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(r => setTimeout(r, 200))
          updateWorkerStatus('trend-1', 'working', 'Trendleri analiz ediyor...', i)
        }
        
        // Add a new random trend
        const newTrend: TrendTopic = {
          id: Date.now().toString(),
          title: `Yeni Trend Konu ${Math.floor(Math.random() * 100)}`,
          category: ['Teknoloji', 'Yapay Zeka', 'YouTube', 'Finans'][Math.floor(Math.random() * 4)],
          trendScore: 80 + Math.floor(Math.random() * 20),
          searchVolume: `${Math.floor(Math.random() * 900) + 100}K`,
          competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          growthRate: `+${Math.floor(Math.random() * 300) + 50}%`,
          relatedKeywords: ['anahtar kelime 1', 'anahtar kelime 2'],
          suggestedTitles: ['Önerilen Başlık 1', 'Önerilen Başlık 2'],
          source: ['youtube', 'google', 'twitter', 'tiktok'][Math.floor(Math.random() * 4)] as TrendTopic['source'],
          discoveredAt: new Date().toISOString()
        }
        
        set((state) => ({
          trendTopics: [newTrend, ...state.trendTopics.slice(0, 9)]
        }))
        
        updateWorkerStatus('trend-1', 'completed', undefined, 100)
        
        // Reset after a delay
        setTimeout(() => {
          updateWorkerStatus('trend-1', 'idle', undefined, 0)
        }, 2000)
      },
      
      generateVideo: async (topic) => {
        const { updateWorkerStatus, addVideo } = get()
        const spendCredits = async (amount: number, reason: string) => {
          const res = await fetch('/api/credits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'spend', amount, reason })
          })
          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data?.error || 'Kredi yetersiz.')
          }
        }

        await spendCredits(2, 'SPEND_SCRIPT')
        await spendCredits(1, 'SPEND_SEO')
        
        const videoId = Date.now().toString()
        
        // Script writer
        updateWorkerStatus('script-1', 'working', `"${topic.title}" için senaryo yazılıyor...`, 0)
        for (let i = 0; i <= 100; i += 5) {
          await new Promise(r => setTimeout(r, 100))
          updateWorkerStatus('script-1', 'working', `"${topic.title}" için senaryo yazılıyor...`, i)
        }
        updateWorkerStatus('script-1', 'completed')
        
        // Thumbnail creator
        updateWorkerStatus('thumb-1', 'working', 'Thumbnail tasarlanıyor...', 0)
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(r => setTimeout(r, 80))
          updateWorkerStatus('thumb-1', 'working', 'Thumbnail tasarlanıyor...', i)
        }
        updateWorkerStatus('thumb-1', 'completed')
        
        // SEO Optimizer
        updateWorkerStatus('seo-1', 'working', 'SEO optimize ediliyor...', 0)
        for (let i = 0; i <= 100; i += 20) {
          await new Promise(r => setTimeout(r, 60))
          updateWorkerStatus('seo-1', 'working', 'SEO optimize ediliyor...', i)
        }
        updateWorkerStatus('seo-1', 'completed')
        
        // Create video with script and voice
        const generatedScript = `# ${topic.suggestedTitles[0] || topic.title}

## Giriş (0:00 - 0:30)
Merhaba arkadaşlar! Bugün sizlerle ${topic.title} hakkında konuşacağız. Bu video, ${topic.category} kategorisinde en çok merak edilen konulardan biri.

## Ana Konu (0:30 - 3:00)
${topic.title} son zamanlarda ${topic.growthRate} büyüme gösterdi. Bu konuyu araştırırken şu önemli noktaları keşfettik:

1. **${topic.relatedKeywords[0] || 'İlk Nokta'}**: Bu konu hakkında bilmeniz gereken en önemli detay...
2. **${topic.relatedKeywords[1] || 'İkinci Nokta'}**: Bir diğer kritik bilgi ise...
3. **Pratik Uygulama**: Şimdi size adım adım göstereceğim...

## Detaylı Analiz (3:00 - 5:00)
Şimdi daha derine inelim. ${topic.searchVolume} aylık arama hacmi ile bu konu gerçekten popüler. Rekabet seviyesi ${topic.competition === 'low' ? 'düşük, bu sizin için harika bir fırsat' : topic.competition === 'medium' ? 'orta seviyede' : 'yüksek ama doğru stratejiyle başarılı olabilirsiniz'}.

## Sonuç ve Öneriler (5:00 - 5:30)
Özetlemek gerekirse, ${topic.title} konusunda başarılı olmak için bu adımları takip edin. Videoyu beğenmeyi ve kanala abone olmayı unutmayın!

---
*Bu senaryo AutoTube AI tarafından otomatik oluşturulmuştur.*`

        const voiceText = `Merhaba arkadaşlar! Bugün sizlerle ${topic.title} hakkında konuşacağız. ${topic.category} kategorisinde en çok merak edilen konulardan biri olan bu başlık, son zamanlarda ${topic.growthRate} büyüme gösterdi.

${topic.relatedKeywords.join(', ')} gibi konuları ele alacağız. ${topic.searchVolume} aylık arama hacmi ile bu konu gerçekten popüler.

Videoyu beğenmeyi ve kanala abone olmayı unutmayın! Bir sonraki videoda görüşmek üzere.`

        const chapters = [
          { time: '0:00', title: 'Giriş' },
          { time: '0:30', title: 'Ana Konu' },
          { time: '3:00', title: 'Detaylı Analiz' },
          { time: '5:00', title: 'Sonuç ve Öneriler' }
        ]

        // Hedef kitleyi kategori ve trende göre belirle
        const targetAudience: TargetAudience = selectTargetAudience(topic.category, topic.relatedKeywords)
        
        // Hedef kitleye göre en uygun sesi seç
        const voiceSettings: VoiceSettings = selectVoiceForAudience(targetAudience)

        const newVideo: Video = {
          id: videoId,
          title: topic.suggestedTitles[0] || topic.title,
          description: `${topic.title} hakkında detaylı bir video. ${topic.relatedKeywords.join(', ')}

⏱️ Bölümler:
0:00 - Giriş
0:30 - Ana Konu
3:00 - Detaylı Analiz
5:00 - Sonuç

🎯 Hedef Kitle: ${getAudienceLabel(targetAudience)}
🎙️ Ses Tipi: ${getVoiceLabel(voiceSettings)}

#${topic.relatedKeywords.join(' #')}`,
          thumbnail: `https://picsum.photos/seed/${videoId}/320/180`,
          status: 'ready',
          views: 0,
          likes: 0,
          createdAt: new Date().toISOString(),
          trendScore: topic.trendScore,
          tags: topic.relatedKeywords,
          script: generatedScript,
          voiceText: voiceText,
          duration: 330, // 5:30
          chapters: chapters,
          targetAudience: targetAudience,
          voiceSettings: voiceSettings
        }
        
        addVideo(newVideo)
        
        // Reset workers
        setTimeout(() => {
          updateWorkerStatus('script-1', 'idle', undefined, 0)
          updateWorkerStatus('thumb-1', 'idle', undefined, 0)
          updateWorkerStatus('seo-1', 'idle', undefined, 0)
        }, 2000)
        
        return videoId
      }
    }),
    {
      name: 'autotube-storage'
    }
  )
)
