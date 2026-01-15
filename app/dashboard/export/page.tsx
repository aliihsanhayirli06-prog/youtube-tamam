'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiArrowLeft, FiDownload, FiFileText, FiPackage } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ExportPackPage() {
  const [title, setTitle] = useState('Yeni Video Paketi')
  const [script, setScript] = useState('Bu videoda en onemli 5 ipucunu ogreniyoruz...')
  const [description, setDescription] = useState('AutoTube AI ile uretilen senaryo ve metadata paketi.')
  const [tags, setTags] = useState('autotube, youtube, ai')
  const [thumbnailText, setThumbnailText] = useState('SOK EDICI GERCEKLER')
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const res = await fetch('/api/export/pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          script,
          description,
          tags: tags.split(',').map((item) => item.trim()).filter(Boolean),
          thumbnailText,
          tts: script,
          srt: `1\n00:00:00,000 --> 00:00:05,000\n${script}`
        })
      })
      if (!res.ok) {
        throw new Error('Pack olusturulamadi.')
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'autotube-pack'}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Pack indiriliyor.')
    } catch (err) {
      toast.error('Indirme basarisiz.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80">
            <FiArrowLeft className="text-xl" />
            <span>Geri Dön</span>
          </Link>
          <h1 className="text-xl font-bold">Export/Pack</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FiPackage className="text-blue-400 text-2xl" />
            <div>
              <h2 className="text-2xl font-bold">ZIP Paketi Hazirla</h2>
              <p className="text-sm text-gray-400">Senaryo + aciklama + etiket + TTS + SRT + thumbnail metni</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Baslik</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail Metni</label>
              <input
                value={thumbnailText}
                onChange={(e) => setThumbnailText(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Senaryo</label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full min-h-[140px] px-4 py-3 bg-dark-700 border border-white/10 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Aciklama</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[120px] px-4 py-3 bg-dark-700 border border-white/10 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Etiketler</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-60"
          >
            <FiDownload /> {isDownloading ? 'Hazirlaniyor...' : 'ZIP Indir'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: FiFileText, title: 'Senaryo + Metadata', desc: 'Baslik, aciklama, etiketler ve thumbnail metni tek pakette.' },
            { icon: FiPackage, title: 'TTS + SRT', desc: 'TTS metni ve altyazi dosyasi ile hizli yayin.' }
          ].map((item) => (
            <div key={item.title} className="bg-dark-800/60 rounded-xl p-4 border border-white/5">
              <item.icon className="text-2xl text-primary-400 mb-2" />
              <p className="font-semibold mb-1">{item.title}</p>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
