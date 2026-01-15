'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiArrowLeft, FiLock, FiPlay, FiStar } from 'react-icons/fi'
import toast from 'react-hot-toast'

type Pack = {
  id: string
  title: string
  description: string
  output: {
    ideas: string[]
    titles: string[]
    hooks: string[]
    shorts: string[]
  }
}

const packs: Pack[] = [
  {
    id: 'real-estate',
    title: 'Emlak Kanal Paketi',
    description: 'Yatirim, semt analizi ve ev turu fikirleri',
    output: {
      ideas: [
        '2026 ev fiyat trendleri',
        '1+1 mi 2+1 mi? Yatirim karsilastirmasi',
        'Yeni metro hattinin emlak etkisi',
        'Kira getirisi en yuksek semtler',
        'Ev alirken 5 kritik kontrol',
        'Konut kredisi stratejisi',
        'Tiny house trendi',
        'Luks konut pazarinda 2026',
        'Airbnb icin uygun ev secimi',
        'Butceyle ev yenileme rehberi'
      ],
      titles: [
        '2026 Emlak Trendleri: Hangi Semtler Ucuyor?',
        '1+1 mi 2+1 mi? Yatirimda Kazanan Hangisi?',
        'Metro Hatti Gelince Emlak Fiyatlari Ne Olur?',
        'Kira Getirisi En Yuksek 5 Semt',
        'Ev Almadan Once Mutlaka Kontrol Et!',
        'Konut Kredisiyle Ev Alirken 3 Kritik Hata',
        'Tiny House Yatirimi Mantikli mi?',
        'Luks Konut Pazarinda 2026 Tahminleri',
        'Airbnb Icin En Karlı Ev Tipi',
        'Ev Yenileme ile Degeri 2x Artirma'
      ],
      hooks: [
        'Bu semtlerde fiyatlar sessizce ucuyor...',
        'Ayni butceyle %30 daha fazla kira getirisi alabilirsiniz.',
        'Ev almadan once bu 5 kontrolu yapmayan kaybediyor.',
        'Metro hatti geldikten sonra fiyati patlayan semtler var.',
        'Bu ufak yenileme, ev degerini katliyor.'
      ],
      shorts: [
        '30 sn: Kira getirisi en yuksek semtler listesi',
        '30 sn: Ev alirken 3 hizli kontrol noktasi',
        '30 sn: Metro hatlari emlakta nasil etkiler?'
      ]
    }
  },
  {
    id: 'finance',
    title: 'Finans/Kripto Kanal Paketi',
    description: 'Risk, portfoy ve piyasa guncellemeleri',
    output: {
      ideas: [
        'Portfoy riskini azaltma taktikleri',
        'Bitcoin dönguleri ve 2026 beklentileri',
        'Altcoin seciminde 3 filtre',
        'Makro veriler kriptoyu nasil etkiliyor?',
        'Dolar endeksi ile borsa iliskisi',
        'Haftalik piyasa ozeti format',
        'Traderlarin yaptigi 5 hata',
        'Uzun vadeli yatirim plani',
        'Stablecoin getirileri karsilastirmasi',
        'Finansal ozgurluk icin 12 ay plan'
      ],
      titles: [
        'Portfoyunu %50 Daha Guvenli Hale Getir',
        'Bitcoin Dongusu: 2026 icin Senaryo',
        'Altcoin Secerken Bu 3 Filtreyi Kullan',
        'Makro Veriler Kriptoyu Nasıl Sallar?',
        'Dolar Endeksi Duserse Ne Olur?',
        'Haftalik Piyasa Ozeti: 3 Dakikada Her Sey',
        'Traderlarin En Buyuk 5 Hatasi',
        'Uzun Vadede Kazandiran Portfoy Orani',
        'Stablecoin Getirilerinde Gizli Fark',
        '12 Ayda Finansal Ozgurluk Plani'
      ],
      hooks: [
        'Bu hatalar portfoyu eritir.',
        'Bitcoin donguleri aslinda tekrar ediyor.',
        'Makro veri aciklandiginda piyasa ilk 5 dk nasil tepki verir?'
      ],
      shorts: [
        '30 sn: Altcoin secimi icin 3 filtre',
        '30 sn: Dolar endeksi ne anlatir?',
        '30 sn: Traderin 1 numarali hatasi'
      ]
    }
  },
  {
    id: 'fitness',
    title: 'Saglik/Fitness Kanal Paketi',
    description: 'Antrenman, beslenme ve motivasyon formatlari',
    output: {
      ideas: [
        '5 dakikalik sabah rutini',
        'Protein ihtiyacini hesaplama',
        'Evde ekipmansiz full body',
        'Kardiyo mu agirlik mi?',
        'Haftalik meal prep rutini',
        'Stresten kurtaran nefes egzersizi',
        'Kas kazanimi icin 3 altin kural',
        'Yag yakiminda en buyuk hata',
        'Sise takilmadan ilerleme',
        'Motivasyon icin 21 gun kural'
      ],
      titles: [
        '5 Dakikada Sabah Enerjisi',
        'Protein Ihtiyacinizi 1 Dakikada Hesaplayin',
        'Ekipmansiz Full Body Ev Programi',
        'Kardiyo mu Agirlik mi? Cevap Net',
        '1 Haftalik Meal Prep Plani',
        '2 Dakikada Stresi Azaltan Nefes',
        'Kas Kazanimi icin 3 Altin Kural',
        'Yag Yakiminda En Buyuk Hata',
        'Sise Takilmadan Gelisim Takibi',
        '21 Gun Motivasyon Plani'
      ],
      hooks: [
        '5 dakikada enerjinizi ikiye katlayin.',
        'Protein hedefiniz sandiginizdan farkli olabilir.',
        'Bu hata yag yakimini durduruyor.'
      ],
      shorts: [
        '30 sn: Sabah rutini mini plan',
        '30 sn: Protein hesabı ipucu',
        '30 sn: Yag yakiminda tek hata'
      ]
    }
  }
]

export default function TemplatesPage() {
  const [isPremium, setIsPremium] = useState(false)
  const [selectedPack, setSelectedPack] = useState(packs[0])

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/user')
        const data = await res.json()
        setIsPremium(['PRO', 'PREMIUM'].includes(data?.user?.plan))
      } catch (err) {
        setIsPremium(false)
      }
    }
    loadUser()
  }, [])

  const handleUnlock = () => {
    toast.error('Bu paketler Premium ile acilir.')
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="bg-dark-800 border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80">
            <FiArrowLeft className="text-xl" />
            <span>Geri Dön</span>
          </Link>
          <h1 className="text-xl font-bold">Templates Magazasi</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[360px_1fr] gap-8">
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Kategoriler</h2>
              <FiStar className="text-primary-400" />
            </div>
            <div className="space-y-3">
              {packs.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPack(pack)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selectedPack.id === pack.id ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 bg-dark-800/60 hover:bg-dark-700/60'}`}
                >
                  <p className="font-semibold">{pack.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{pack.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6 relative overflow-hidden">
            {!isPremium && (
              <div className="absolute inset-0 z-10 bg-dark-900/80 backdrop-blur flex flex-col items-center justify-center text-center p-8">
                <FiLock className="text-4xl text-yellow-400 mb-4" />
                <p className="text-xl font-bold mb-2">Premium ile acilir</p>
                <p className="text-sm text-gray-400 mb-4">Tek tikla 40 parca icerik paketi</p>
                <Link href="/dashboard/premium" className="px-5 py-2 bg-yellow-500 text-dark-900 rounded-lg font-semibold">
                  Premium'a Gec
                </Link>
              </div>
            )}

            <div className={isPremium ? '' : 'opacity-40'}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedPack.title}</h2>
                  <p className="text-sm text-gray-400">{selectedPack.description}</p>
                </div>
                <button
                  onClick={isPremium ? () => toast.success('Paket hazirlandi.') : handleUnlock}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold flex items-center gap-2"
                >
                  <FiPlay /> Paketi Uret
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-dark-800/60 rounded-xl p-4">
                  <h3 className="font-semibold mb-2">10 Video Fikri</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {selectedPack.output.ideas.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
                <div className="bg-dark-800/60 rounded-xl p-4">
                  <h3 className="font-semibold mb-2">10 Baslik</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {selectedPack.output.titles.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
                <div className="bg-dark-800/60 rounded-xl p-4">
                  <h3 className="font-semibold mb-2">10 Hook</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {selectedPack.output.hooks.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
                <div className="bg-dark-800/60 rounded-xl p-4">
                  <h3 className="font-semibold mb-2">10 Shorts Metni</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {selectedPack.output.shorts.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
