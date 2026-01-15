'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useAppStore } from '@/lib/store'
import { FiArrowLeft, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiYoutube, FiEdit, FiTrash2, FiEye, FiThumbsUp, FiClock, FiTarget, FiCalendar, FiTag, FiList, FiFileText, FiMic, FiSkipBack, FiSkipForward } from 'react-icons/fi'

type Chapter = { time: string, title: string }

const normalizeDbVideo = (video: any) => {
  if (!video) return null
  const tags = Array.isArray(video.tags) ? video.tags.map((t: any) => t.tag?.name).filter(Boolean) : []
  const chapters = Array.isArray(video.chapters)
    ? video.chapters.map((c: any) => ({ time: c.timecode, title: c.title }))
    : []

  return {
    id: video.id,
    title: video.title || 'Video',
    description: video.description || '',
    thumbnail: video.thumbnailUrl || '',
    status: String(video.status || 'draft').toLowerCase(),
    views: video.views || 0,
    likes: video.likes || 0,
    trendScore: video.trendScore || 0,
    script: video.script || '',
    voiceText: video.voiceText || '',
    duration: video.durationSec || 0,
    chapters,
    tags,
    promptText: video.promptText || '',
    model: video.model || '',
    resolution: video.resolution || '',
    runwayTaskId: video.runwayTaskId || '',
    runwayStatus: video.runwayStatus || '',
    runwayOutputUrl: video.runwayOutputUrl || ''
  }
}

export default function VideoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { videos, updateVideo, deleteVideo } = useAppStore()
  const video = videos.find(v => v.id === params.id)
  const [dbVideo, setDbVideo] = useState<any>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [contentTab, setContentTab] = useState<'preview' | 'script' | 'voice' | 'chapters'>('preview')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPolling, setIsPolling] = useState(false)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeVideo = video || dbVideo
  const duration = activeVideo?.duration || activeVideo?.durationSec || 330
  
  const slides = (activeVideo?.chapters as Chapter[] | undefined)?.map((chapter, idx) => ({
    title: chapter.title,
    image: `https://picsum.photos/seed/${activeVideo.id}-${idx}/800/450`
  })) || [{ title: 'Video', image: activeVideo?.thumbnail || activeVideo?.thumbnailUrl || '' }]

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            return duration
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, duration])

  useEffect(() => {
    if (activeVideo?.chapters) {
      const chapter = (activeVideo.chapters as Chapter[]).findIndex((ch: Chapter, idx) => {
        const nextChapter = activeVideo.chapters?.[idx + 1]
        const nextTime = nextChapter ? parseChapterTime(nextChapter.time) : duration
        return currentTime >= parseChapterTime(ch.time) && currentTime < nextTime
      })
      if (chapter >= 0) setCurrentSlide(chapter)
    }
  }, [currentTime, activeVideo?.chapters, duration])

  useEffect(() => {
    const loadDbVideo = async () => {
      if (!params.id) return
      try {
        const res = await fetch(`/api/videos/${params.id}`)
        if (!res.ok) return
        const data = await res.json()
        const normalized = normalizeDbVideo(data?.item)
        if (normalized) {
          setDbVideo(normalized)
        }
      } catch (err) {
        setDbVideo(null)
      }
    }
    loadDbVideo()
  }, [params.id])

  useEffect(() => {
    window.speechSynthesis.getVoices()
  }, [])

  useEffect(() => {
    if (!activeVideo?.runwayTaskId) return
    if (activeVideo.runwayStatus === 'SUCCEEDED') return

    const poll = async () => {
      setIsPolling(true)
      try {
        const res = await fetch(`/api/ai/runway?id=${encodeURIComponent(activeVideo.runwayTaskId)}`)
        const data = await res.json()
        const nextStatus = data?.status || data?.state || data?.task?.status || ''
        const url =
          data?.output?.[0]?.url ||
          data?.output_url ||
          data?.video_url ||
          data?.result?.video_url ||
          ''

        if (dbVideo) {
          const updated = { ...dbVideo, runwayStatus: nextStatus, runwayOutputUrl: url || dbVideo.runwayOutputUrl }
          setDbVideo(updated)
        }

        await fetch(`/api/videos/${activeVideo.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            runwayStatus: nextStatus,
            runwayOutputUrl: url || null,
            status: nextStatus === 'SUCCEEDED' ? 'READY' : 'PROCESSING'
          })
        })

        if (nextStatus === 'SUCCEEDED' || nextStatus === 'FAILED' || nextStatus === 'CANCELLED') {
          if (pollRef.current) clearInterval(pollRef.current)
          setIsPolling(false)
        }
      } catch (err) {
        if (pollRef.current) clearInterval(pollRef.current)
        setIsPolling(false)
      }
    }

    poll()
    pollRef.current = setInterval(poll, 5000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [activeVideo?.runwayTaskId, activeVideo?.runwayStatus, activeVideo?.id, dbVideo])

  const parseChapterTime = (time: string): number => {
    const parts = time.split(':').map(Number)
    return parts.length === 2 ? parts[0] * 60 + parts[1] : 0
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startSpeech = () => {
    if (!activeVideo?.voiceText || isMuted) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(activeVideo.voiceText)
    utterance.lang = 'tr-TR'
    if (activeVideo.voiceSettings) {
      utterance.rate = activeVideo.voiceSettings.speed
      utterance.pitch = activeVideo.voiceSettings.pitch
    }
    utterance.onend = () => setIsSpeaking(false)
    speechRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const stopSpeech = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
      stopSpeech()
    } else {
      setIsPlaying(true)
      if (!isMuted) startSpeech()
    }
  }

  const handlePublish = () => {
    if (!activeVideo) return
    updateVideo(activeVideo.id, { status: 'published', publishedAt: new Date().toISOString() })
    if (!video && dbVideo) {
      fetch(`/api/videos/${activeVideo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED', publishedAt: new Date().toISOString() })
      })
    }
    toast.success('Video YouTube\'a yayınlandı!')
  }

  const handleDelete = () => {
    if (!activeVideo) return
    deleteVideo(activeVideo.id)
    if (!video && dbVideo) {
      fetch(`/api/videos/${activeVideo.id}`, { method: 'DELETE' })
    }
    toast.success('Video silindi!')
    router.push('/dashboard')
  }

  if (!activeVideo) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center"><p className="text-xl text-gray-400">Video bulunamadı</p></div>
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <FiArrowLeft className="text-xl" />
            <span>Geri Dön</span>
          </Link>
          <h1 className="text-xl font-bold truncate max-w-md">{activeVideo.title}</h1>
          <div className="flex items-center gap-2">
            {activeVideo.status === 'ready' && (
              <button onClick={handlePublish} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <FiYoutube /> Yayınla
              </button>
            )}
            <button onClick={handleDelete} className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors">
              <FiTrash2 />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-2 mb-4">
              {(['preview', 'script', 'voice', 'chapters'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setContentTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    contentTab === tab ? 'bg-primary-600 text-white' : 'glass-effect text-gray-400 hover:text-white'
                  }`}
                >
                  {tab === 'preview' && '🎬 Önizleme'}
                  {tab === 'script' && '📝 Senaryo'}
                  {tab === 'voice' && '🎙️ Ses'}
                  {tab === 'chapters' && '📋 Bölümler'}
                </button>
              ))}
            </div>

            {contentTab === 'preview' && (
              <div className="glass-effect rounded-2xl overflow-hidden">
                <div className="relative aspect-video bg-dark-800">
                  {activeVideo.runwayOutputUrl ? (
                    <video src={activeVideo.runwayOutputUrl} controls className="w-full h-full object-cover" />
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <img src={slides[currentSlide]?.image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/30 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-lg font-bold text-white">{activeVideo.title}</p>
                          <p className="text-sm text-gray-300">{slides[currentSlide]?.title}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button onClick={handlePlayPause} className="w-20 h-20 rounded-full bg-primary-600/80 hover:bg-primary-600 flex items-center justify-center transition-all">
                      {isPlaying ? <FiPause className="text-4xl" /> : <FiPlay className="text-4xl ml-1" />}
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
                    <div className="flex-1 h-1 bg-dark-700 rounded-full cursor-pointer" onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const percent = (e.clientX - rect.left) / rect.width
                      setCurrentTime(percent * duration)
                    }}>
                      <div className="h-full bg-gradient-to-r from-primary-500 to-blue-500 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }} />
                    </div>
                    <span className="text-sm text-gray-400">{formatTime(duration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrentTime(Math.max(0, currentTime - 10))} className="p-2 hover:bg-white/10 rounded-lg"><FiSkipBack /></button>
                      <button onClick={handlePlayPause} className="p-2 hover:bg-white/10 rounded-lg">{isPlaying ? <FiPause /> : <FiPlay />}</button>
                      <button onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))} className="p-2 hover:bg-white/10 rounded-lg"><FiSkipForward /></button>
                      <button onClick={() => { setIsMuted(!isMuted); if (!isMuted) stopSpeech() }} className="p-2 hover:bg-white/10 rounded-lg">{isMuted ? <FiVolumeX /> : <FiVolume2 />}</button>
                    </div>
                    {isSpeaking && <span className="text-xs text-green-400 flex items-center gap-1"><FiMic className="animate-pulse" /> Konuşuyor...</span>}
                  </div>
                </div>
              </div>
            )}

            {contentTab === 'script' && (
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FiFileText className="text-blue-400" /> Video Senaryosu</h3>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">{activeVideo.script}</pre>
                </div>
              </div>
            )}

            {contentTab === 'voice' && (
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FiMic className="text-green-400" /> Ses Metni</h3>
                {activeVideo.targetAudience && activeVideo.voiceSettings && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                    <p className="text-sm text-gray-400 mb-2">Hedef Kitle & Ses Ayarları:</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-500">Yaş:</span> <span className="text-white">{activeVideo.targetAudience.ageGroup}</span></div>
                      <div><span className="text-gray-500">Ses:</span> <span className="text-white">{activeVideo.voiceSettings.voiceType}</span></div>
                      <div><span className="text-gray-500">Hız:</span> <span className="text-white">{activeVideo.voiceSettings.speed}x</span></div>
                      <div><span className="text-gray-500">Ton:</span> <span className="text-white">{activeVideo.voiceSettings.emotion}</span></div>
                    </div>
                  </div>
                )}
                <div className="p-4 bg-dark-800 rounded-xl">
                  <p className="text-gray-300 leading-relaxed">{activeVideo.voiceText}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => { if (isSpeaking) stopSpeech(); else startSpeech() }} className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg font-medium flex items-center gap-2">
                    {isSpeaking ? <><FiPause /> Durdur</> : <><FiPlay /> Dinle</>}
                  </button>
                </div>
              </div>
            )}

            {contentTab === 'chapters' && (
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FiList className="text-purple-400" /> Video Bölümleri</h3>
                <div className="space-y-2">
                  {(activeVideo.chapters as Chapter[] | undefined)?.map((chapter, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setCurrentTime(parseChapterTime(chapter.time)); setCurrentSlide(idx); setContentTab('preview') }}
                      className={`w-full p-3 rounded-xl text-left flex items-center gap-4 transition-all ${
                        currentSlide === idx ? 'bg-primary-600/20 border-2 border-primary-500' : 'bg-dark-800 hover:bg-dark-700'
                      }`}
                    >
                      <span className="font-mono text-primary-400">{chapter.time}</span>
                      <span className="flex-1">{chapter.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="font-bold mb-4">Video Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-gray-400"><FiEye /> İzlenme</span><span className="font-bold">{activeVideo.views.toLocaleString()}</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-400"><FiThumbsUp /> Beğeni</span><span className="font-bold">{activeVideo.likes.toLocaleString()}</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-400"><FiClock /> Süre</span><span className="font-bold">{formatTime(duration)}</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-400"><FiTarget /> Trend</span><span className="font-bold text-primary-400">{activeVideo.trendScore}</span></div>
              </div>
              {activeVideo.runwayTaskId && (
                <div className="mt-4 text-xs text-gray-400">
                  <p>Runway Task: <span className="text-gray-200">{activeVideo.runwayTaskId}</span></p>
                  <p>Durum: <span className="text-gray-200">{activeVideo.runwayStatus || 'Bilinmiyor'}</span> {isPolling ? '(guncelleniyor...)' : ''}</p>
                </div>
              )}
            </div>
            {activeVideo.targetAudience && (
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="font-bold mb-4">🎯 Hedef Kitle</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Yaş:</span><span>{activeVideo.targetAudience.ageGroup}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Cinsiyet:</span><span>{activeVideo.targetAudience.gender}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Bölge:</span><span>{activeVideo.targetAudience.region}</span></div>
                </div>
              </div>
            )}
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="font-bold mb-4"><FiTag /> Etiketler</h3>
              <div className="flex flex-wrap gap-2">
                {(activeVideo.tags as string[] || []).map((tag: string, idx) => (
                  <span key={idx} className="px-3 py-1 bg-dark-700 rounded-full text-sm text-gray-300">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
