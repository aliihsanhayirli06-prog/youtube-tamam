import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { useAppStore } from '@/lib/store'

describe('app store', () => {
  const originalFetch = global.fetch
  const initialState = useAppStore.getState()

  beforeEach(() => {
    useAppStore.setState(initialState, true)
    useAppStore.persist?.clearStorage()
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    global.fetch = originalFetch
  })

  it('refreshTrends spends credits and updates trends', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    }) as any

    const promise = useAppStore.getState().refreshTrends()
    await vi.runAllTimersAsync()
    await promise

    const state = useAppStore.getState()
    expect(state.trendTopics.length).toBeGreaterThan(0)
    expect(global.fetch).toHaveBeenCalledWith('/api/credits', expect.any(Object))
    expect(state.aiWorkers.find(w => w.id === 'trend-1')?.status).toBe('idle')
  })

  it('generateVideo creates a new video and updates workers', async () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    }) as any

    const topic = {
      id: 'topic-1',
      title: 'Cocuklar icin egitici icerik',
      category: 'Çocuk',
      trendScore: 90,
      searchVolume: '100K',
      competition: 'low' as const,
      growthRate: '+120%',
      relatedKeywords: ['çocuk', 'eğitici', 'oyun'],
      suggestedTitles: ['Cocuklar icin egitim'],
      source: 'youtube' as const,
      discoveredAt: new Date().toISOString()
    }

    const promise = useAppStore.getState().generateVideo(topic)
    await vi.runAllTimersAsync()
    const videoId = await promise

    const state = useAppStore.getState()
    const created = state.videos.find(v => v.id === videoId)
    expect(created?.title).toBe('Cocuklar icin egitim')
    expect(created?.targetAudience?.ageGroup).toBe('children')
    expect(created?.voiceSettings).toBeDefined()
    expect(state.aiWorkers.find(w => w.id === 'script-1')?.status).toBe('idle')
  })

  it('generateVideo throws when credits fail', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Kredi yetersiz.' })
    }) as any

    const topic = {
      id: 'topic-2',
      title: 'Finans trend',
      category: 'Finans',
      trendScore: 80,
      searchVolume: '50K',
      competition: 'medium' as const,
      growthRate: '+50%',
      relatedKeywords: ['yatırım', 'borsa'],
      suggestedTitles: [],
      source: 'google' as const,
      discoveredAt: new Date().toISOString()
    }

    await expect(useAppStore.getState().generateVideo(topic)).rejects.toThrow('Kredi yetersiz.')
  })
})
