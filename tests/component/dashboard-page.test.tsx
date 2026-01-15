import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'

const push = vi.hoisted(() => vi.fn())
const toast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  promise: vi.fn((promise: Promise<unknown>) => promise)
}))

const refreshTrends = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const generateVideo = vi.hoisted(() => vi.fn().mockResolvedValue('video-123'))
const deleteVideo = vi.hoisted(() => vi.fn())
const updateVideo = vi.hoisted(() => vi.fn())

const storeState = {
  user: {
    name: 'Demo',
    email: 'demo@autotube.ai',
    avatar: '',
    channelConnected: true,
    channelName: 'Demo Channel',
    plan: 'free'
  },
  stats: {
    totalVideos: 2,
    totalViews: 1000,
    subscribers: 200,
    trendScore: 80,
    videosThisMonth: 2,
    avgViews: 500
  },
  videos: [
    {
      id: 'v1',
      title: 'Video 1',
      description: '',
      thumbnail: 'https://example.com/thumb.jpg',
      status: 'ready',
      views: 100,
      likes: 10,
      createdAt: new Date().toISOString(),
      trendScore: 80,
      tags: []
    }
  ],
  trendTopics: [
    {
      id: 't1',
      title: 'Trend 1',
      category: 'Teknoloji',
      trendScore: 90,
      searchVolume: '10K',
      competition: 'low',
      growthRate: '+10%',
      relatedKeywords: [],
      suggestedTitles: [],
      source: 'youtube',
      discoveredAt: new Date().toISOString()
    }
  ],
  aiWorkers: [
    { id: 'trend-1', name: 'Trend Araştırmacı', type: 'trend-researcher', status: 'idle', progress: 0, tasksCompleted: 1, icon: '🔍' }
  ],
  refreshTrends,
  generateVideo,
  deleteVideo,
  updateVideo
}

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push })
}))

vi.mock('react-hot-toast', () => ({
  default: toast
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>{children}</a>
  )
}))

vi.mock('@/components/OnboardingTour', () => ({
  default: ({ onComplete, onSkip }: any) => (
    <div>
      <button onClick={onComplete}>Complete Tour</button>
      <button onClick={onSkip}>Skip Tour</button>
    </div>
  )
}))

vi.mock('@/components/UpsellModal', () => ({
  default: ({ isOpen }: any) => (isOpen ? <div>Upsell Open</div> : null)
}))

vi.mock('@/lib/store', () => ({
  useAppStore: () => storeState
}))

import DashboardPage from '@/app/dashboard/page'

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    refreshTrends.mockClear()
    generateVideo.mockClear()
    deleteVideo.mockClear()
    updateVideo.mockClear()
    push.mockClear()
    toast.success.mockClear()
    toast.error.mockClear()
    toast.promise.mockClear()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    cleanup()
  })

  it('renders overview and triggers onboarding completion', () => {
    render(<DashboardPage />)
    fireEvent.click(screen.getByText('Complete Tour'))
    expect(toast.success).toHaveBeenCalled()
    expect(screen.getByText('Hızlı İşlemler')).toBeInTheDocument()
  })

  it.skip('refreshes trends and generates video', async () => {
    render(<DashboardPage />)
    fireEvent.click(screen.getByText('Trend Ara'))
    expect(toast.promise).toHaveBeenCalled()

    fireEvent.click(screen.getByText('Trendler'))
    await Promise.resolve()
    expect(screen.getByText('Trend Konular')).toBeInTheDocument()
    const videoButtons = screen.getAllByRole('button', { name: /Video Oluştur/i })
    fireEvent.click(videoButtons[videoButtons.length - 1])
    vi.advanceTimersByTime(1100)
    expect(push).toHaveBeenCalledWith('/dashboard/videos/video-123')
  })

  it('shows upsell modal on visit count', async () => {
    localStorage.setItem('autotube_visit_count', '5')
    render(<DashboardPage />)
    await vi.runAllTimersAsync()
    await Promise.resolve()
    expect(screen.getByText('Upsell Open')).toBeInTheDocument()
  })
})
