'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiZap, FiPlay, FiPause, FiSettings, FiCheck, FiCalendar, FiClock, FiVideo, FiTrendingUp, FiShield, FiTarget } from 'react-icons/fi'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AutopilotPage() {
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [settings, setSettings] = useState({ videosPerWeek: 3, minTrendScore: 80, videoLength: 'medium', categories: ['Teknoloji', 'Yapay Zeka'] })
  const [promptText, setPromptText] = useState('')
  const [promptModel, setPromptModel] = useState('gpt-4o-mini')
  const [promptTone, setPromptTone] = useState('cinematic')
  const [model, setModel] = useState('gen3a_turbo')
  const [duration, setDuration] = useState(5)
  const [resolution, setResolution] = useState('720p')
  const [taskId, setTaskId] = useState('')
  const [status, setStatus] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [isPrompting, setIsPrompting] = useState(false)
  const [dbVideoId, setDbVideoId] = useState('')
  const [runwayVideos, setRunwayVideos] = useState<any[]>([])
  const [isLoadingVideos, setIsLoadingVideos] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const retryCountRef = useRef(0)
  const runwayParamsRef = useRef<{ model: string, prompt_text: string, duration: number, resolution: string } | null>(null)
  const MAX_RETRIES = 2
  const RETRY_DELAY_MS = 3000

  const handleToggle = () => {
    setIsActive(!isActive)
    toast.success(isActive ? 'Otomatik Pilot durduruldu' : 'Otomatik Pilot aktif!')
  }

  useEffect(() => {
    loadVideos()
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  const extractStatus = (data: any) => {
    return data?.status || data?.state || data?.task?.status || ''
  }

  const extractVideoUrl = (data: any) => {
    return (
      data?.output?.[0]?.url ||
      data?.output_url ||
      data?.video_url ||
      data?.result?.video_url ||
      ''
    )
  }

  const createRunwayTask = async (payload: { model: string, prompt_text: string, duration: number, resolution: string }) => {
    const res = await fetch('/api/ai/runway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error || 'Runway istegi basarisiz.')
    }

    const id = data?.id || data?.task_id || data?.taskId || data?.task?.id
    if (!id) {
      throw new Error('Task ID alinamadi.')
    }

    return { id, status: extractStatus(data) || 'QUEUED' }
  }

  const updateDbVideo = async (updates: Record<string, any>) => {
    if (!dbVideoId) return
    await fetch(`/api/videos/${dbVideoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
  }

  const scheduleRetry = (reason: string) => {
    if (retryCountRef.current >= MAX_RETRIES || !runwayParamsRef.current) {
      setIsGenerating(false)
      setError(reason)
      return
    }
    retryCountRef.current += 1
    setStatus('RETRYING')
    setError(`Video olusturma basarisiz oldu. Yeniden deneniyor (${retryCountRef.current}/${MAX_RETRIES}).`)
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
    retryTimeoutRef.current = setTimeout(async () => {
      try {
        const { id, status: nextStatus } = await createRunwayTask(runwayParamsRef.current as { model: string, prompt_text: string, duration: number, resolution: string })
        setTaskId(id)
        setStatus(nextStatus)
        setVideoUrl('')
        await updateDbVideo({
          status: 'PROCESSING',
          runwayTaskId: id,
          runwayStatus: nextStatus,
          runwayOutputUrl: null
        })
        pollTask(id)
      } catch (err) {
        scheduleRetry('Runway yeniden baslatilamadi.')
      }
    }, RETRY_DELAY_MS)
  }

  const pollTask = (id: string) => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
    }
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/ai/runway?id=${encodeURIComponent(id)}`)
        const data = await res.json()
        const nextStatus = extractStatus(data)
        setStatus(nextStatus)
        const url = extractVideoUrl(data)
        if (url) {
          setVideoUrl(url)
        }
        await updateDbVideo({
          status: nextStatus === 'SUCCEEDED' ? 'READY' : 'DRAFT',
          runwayStatus: nextStatus,
          runwayOutputUrl: url || null
        })

        if (nextStatus === 'SUCCEEDED' || nextStatus === 'FAILED' || nextStatus === 'CANCELLED') {
          if (pollRef.current) {
            clearInterval(pollRef.current)
          }
          loadVideos()
          if (nextStatus === 'SUCCEEDED') {
            setIsGenerating(false)
            setError('')
            return
          }
          scheduleRetry('Video olusturma basarisiz oldu.')
        }
      } catch (err) {
        setError('Task durumu kontrol edilemedi. Yeniden deneniyor.')
      }
    }, 4000)
  }

  const handleGenerate = async () => {
    if (!promptText.trim()) {
      toast.error('Lutfen bir prompt girin')
      return
    }
    setError('')
    setVideoUrl('')
    setStatus('')
    setTaskId('')
    setIsGenerating(true)

    try {
      retryCountRef.current = 0
      runwayParamsRef.current = { model, prompt_text: promptText, duration, resolution }

      const { id, status: nextStatus } = await createRunwayTask(runwayParamsRef.current)
      setTaskId(id)
      setStatus(nextStatus)

      const createRes = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText,
          model,
          resolution,
          durationSec: duration,
          status: 'PROCESSING',
          runwayTaskId: id,
          runwayStatus: nextStatus
        })
      })
      const created = await createRes.json()
      setDbVideoId(created?.item?.id || '')
      loadVideos()

      pollTask(id)
    } catch (err) {
      setIsGenerating(false)
      setError('Runway istegi gonderilemedi.')
    }
  }

  const handleGeneratePrompt = async () => {
    setIsPrompting(true)
    try {
      const toneMap: Record<string, string> = {
        cinematic: 'cinematic, dramatic lighting, rich atmosphere',
        documentary: 'documentary, natural light, realistic tone',
        anime: 'anime style, vibrant colors, dynamic framing',
        noir: 'film noir, high contrast, moody shadows',
        commercial: 'clean commercial, bright lighting, product focus'
      }
      const res = await fetch('/api/ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: promptModel,
          messages: [
            {
              role: 'system',
              content: `You are a creative director. Write a short, vivid Runway text-to-video prompt. Keep it under 2 sentences. Style cues: ${toneMap[promptTone]}.`
            },
            {
              role: 'user',
              content: `Konu veya ipucu: ${promptText || 'Sinematik bir sahne oner'}`
            }
          ],
          temperature: 0.8
        })
      })
      const data = await res.json()
      const content = data?.choices?.[0]?.message?.content
      if (content) {
        setPromptText(content.trim())
      } else {
        toast.error('Prompt uretilmedi.')
      }
    } catch (err) {
      toast.error('Prompt uretilirken hata olustu.')
    } finally {
      setIsPrompting(false)
    }
  }

  const loadVideos = async () => {
    setIsLoadingVideos(true)
    try {
      const res = await fetch('/api/videos')
      const data = await res.json()
      setRunwayVideos(data?.items || [])
    } catch (err) {
      setRunwayVideos([])
    } finally {
      setIsLoadingVideos(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80"><FiArrowLeft className="text-xl" /><span>Geri Dön</span></Link>
          <h1 className="text-xl font-bold">Otomatik Pilot</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 ${isActive ? 'bg-green-500/20' : 'bg-dark-800'}`}>
            <FiZap className={`text-5xl ${isActive ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Kanalınızı Otomatik Büyütün</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">AI çalışanları trend konuları bulur, video oluşturur ve YouTube kurallarına uygun şekilde yayınlar.</p>
          <button onClick={handleToggle} className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto transition-all ${isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}>
            {isActive ? <><FiPause /> Durdur</> : <><FiPlay /> Başlat</>}
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { icon: FiCalendar, title: 'Haftalık Video', value: `${settings.videosPerWeek} video`, color: 'text-blue-400' },
            { icon: FiTarget, title: 'Min. Trend Skoru', value: settings.minTrendScore, color: 'text-green-400' },
            { icon: FiClock, title: 'Video Uzunluğu', value: settings.videoLength === 'short' ? 'Kısa (1-3dk)' : settings.videoLength === 'medium' ? 'Orta (5-10dk)' : 'Uzun (15+dk)', color: 'text-purple-400' }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-effect rounded-xl p-6 text-center">
              <stat.icon className={`text-4xl ${stat.color} mx-auto mb-4`} />
              <h3 className="font-bold text-lg mb-2">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass-effect rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FiShield className="text-green-400" /> YouTube Kurallarına Uyumluluk</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { rule: 'Özgün İçerik', desc: 'AI tarafından benzersiz içerik üretimi', status: true },
              { rule: 'Telif Hakkı', desc: 'Royalty-free müzik ve görseller', status: true },
              { rule: 'Spam Koruması', desc: 'Doğal yayınlama sıklığı', status: true },
              { rule: 'Topluluk Kuralları', desc: 'İçerik filtreleme ve moderasyon', status: true }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-dark-800/50 rounded-xl">
                <FiCheck className="text-green-400 text-xl flex-shrink-0" />
                <div>
                  <p className="font-semibold">{item.rule}</p>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FiSettings className="text-primary-400" /> Ayarlar</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Haftalık Video Sayısı</label>
              <select value={settings.videosPerWeek} onChange={(e) => setSettings({ ...settings, videosPerWeek: Number(e.target.value) })} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg">
                {[1, 2, 3, 5, 7].map(n => <option key={n} value={n}>{n} video</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Trend Skoru</label>
              <select value={settings.minTrendScore} onChange={(e) => setSettings({ ...settings, minTrendScore: Number(e.target.value) })} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg">
                {[60, 70, 80, 90].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Video Uzunluğu</label>
              <select value={settings.videoLength} onChange={(e) => setSettings({ ...settings, videoLength: e.target.value })} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg">
                <option value="short">Kısa (1-3 dakika)</option>
                <option value="medium">Orta (5-10 dakika)</option>
                <option value="long">Uzun (15+ dakika)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 mt-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FiVideo className="text-blue-400" /> Runway Text-to-Video</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg">
                <option value="gen3a_turbo">Gen-3 Alpha Turbo</option>
                <option value="gen3a">Gen-3 Alpha</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cozunurluk</label>
              <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg">
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sure (sn)</label>
              <input type="number" min={4} max={10} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Prompt</label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Ornek: Sisli bir ormanda sabah gunesi, sinematik."
              className="w-full min-h-[120px] px-4 py-3 bg-dark-700 border border-white/10 rounded-lg"
            />
            <div className="mt-3 flex items-center gap-3">
              <select
                value={promptModel}
                onChange={(e) => setPromptModel(e.target.value)}
                className="px-3 py-2 bg-dark-700 border border-white/10 rounded-lg text-sm"
              >
                <option value="gpt-4o-mini">GPT-4o mini</option>
                <option value="gpt-4o">GPT-4o</option>
              </select>
              <select
                value={promptTone}
                onChange={(e) => setPromptTone(e.target.value)}
                className="px-3 py-2 bg-dark-700 border border-white/10 rounded-lg text-sm"
              >
                <option value="cinematic">Sinematik</option>
                <option value="documentary">Belgesel</option>
                <option value="anime">Anime</option>
                <option value="noir">Noir</option>
                <option value="commercial">Reklam</option>
              </select>
              <button
                onClick={handleGeneratePrompt}
                disabled={isPrompting}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPrompting ? 'Prompt uretiliyor...' : 'Prompt Uret'}
              </button>
              <span className="text-xs text-gray-400">OpenAI ile otomatik prompt onerisi</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">Quick Presets</p>
              <span className="text-xs text-gray-500">1 tikla ayar uygula</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Sosyal Reklam (5sn)', config: { duration: 5, resolution: '1080p', model: 'gen3a_turbo' } },
                { label: 'Sinema (8sn)', config: { duration: 8, resolution: '1080p', model: 'gen3a' } },
                { label: 'Dikey Short (6sn)', config: { duration: 6, resolution: '720p', model: 'gen3a_turbo' } },
                { label: 'Hizli Test (4sn)', config: { duration: 4, resolution: '720p', model: 'gen3a_turbo' } }
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setDuration(preset.config.duration)
                    setResolution(preset.config.resolution)
                    setModel(preset.config.model)
                  }}
                  className="px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">Prompt Bankasi</p>
              <span className="text-xs text-gray-500">Tek tikla promptu doldur</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Sisli Sehir Girisi',
                  desc: 'Neon yansimalar, yagmur, sinematik camera move',
                  prompt: 'Neon tabelalarla aydinlanan sisli bir sokakta gece yagmuru, kameranin yavasca ileri kaydigi sinematik bir sehir girisi.'
                },
                {
                  title: 'Urun Reklami',
                  desc: 'Macro cekim, parildayan detaylar, temiz fon',
                  prompt: 'Mat siyah arka planda lamba isigi ile aydinlanan premium bir kulaklik, makro detaylar, yumusak bokeh ve temiz reklam stili.'
                },
                {
                  title: 'Belgesel Dogasi',
                  desc: 'Sabah sisleri, dogal isik, sakin tempo',
                  prompt: 'Gunes dogarken sisli bir gol kiyisi, dogal isik ve yavas kamera hareketi ile sakin belgesel atmosferi.'
                },
                {
                  title: 'Anime Aksiyon',
                  desc: 'Dinamik kadraj, hizli pan, parlak renkler',
                  prompt: 'Anime tarzinda dar bir sokakta hizla kosan karakter, dinamik kamera panlari, parlak neon renkler ve enerji dolu atmosfer.'
                },
                {
                  title: 'Noir Sokak',
                  desc: 'Yuksek kontrast, yagmurlu gece, dramatik golgeler',
                  prompt: 'Film noir tarzinda yagmurlu bir gece, sigara dumanli bir dedektif, yuksek kontrast ve dramatik golgeler.'
                },
                {
                  title: 'Futuristik Kampanya',
                  desc: 'Hologramlar, temiz geometri, parlak highlights',
                  prompt: 'Futuristik bir showroom, holografik urun sunumu, temiz geometrik hatlar, parlak highlights ve minimal teknoloji atmosferi.'
                }
              ].map((item) => (
                <div key={item.title} className="bg-dark-800/60 border border-white/5 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setPromptText(item.prompt)}
                      className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-xs font-semibold"
                    >
                      Kullan
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 line-clamp-3">{item.prompt}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Olusturuluyor...' : 'Videoyu Olustur'}
          </button>

          <div className="mt-6 space-y-2 text-sm text-gray-300">
            {taskId && <p>Task ID: <span className="text-white">{taskId}</span></p>}
            {status && <p>Durum: <span className="text-white">{status}</span></p>}
            {error && <p className="text-red-400">{error}</p>}
            {videoUrl && (
              <div className="pt-4">
                <p className="mb-2">Video Hazir:</p>
                <video src={videoUrl} controls className="w-full rounded-lg" />
                <a href={videoUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline block mt-2">
                  Indirmek icin ac
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FiTrendingUp className="text-green-400" /> Runway Videolari
            </h3>
            <button onClick={loadVideos} className="px-3 py-2 bg-dark-700 rounded-lg text-sm hover:bg-dark-600 transition-colors">
              Yenile
            </button>
          </div>
          {isLoadingVideos ? (
            <p className="text-gray-400">Yukleniyor...</p>
          ) : runwayVideos.length === 0 ? (
            <p className="text-gray-400">Henüz bir video yok.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {runwayVideos.map((video) => (
                <div key={video.id} className="bg-dark-800/60 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold truncate">{video.title}</p>
                    <span className="text-xs text-gray-400">{video.runwayStatus || video.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Model: {video.model || '-'} | Cozunurluk: {video.resolution || '-'} | Sure: {video.durationSec || '-'} sn
                  </p>
                  {video.runwayOutputUrl ? (
                    <video src={video.runwayOutputUrl} controls className="w-full rounded-lg" />
                  ) : (
                    <div className="w-full h-32 rounded-lg bg-dark-700 flex items-center justify-center text-sm text-gray-400">
                      Video bekleniyor
                    </div>
                  )}
                  {video.runwayOutputUrl && (
                    <a href={video.runwayOutputUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline block mt-2 text-sm">
                      Indirmek icin ac
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
