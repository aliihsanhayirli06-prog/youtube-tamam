import React from 'react'
import { describe, expect, it, vi, beforeEach, afterAll, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

const push = vi.hoisted(() => vi.fn())
const updateVideo = vi.hoisted(() => vi.fn())
const deleteVideo = vi.hoisted(() => vi.fn())
const toast = vi.hoisted(() => ({
  success: vi.fn()
}))

const video = {
  id: 'vid-1',
  title: 'Demo Video',
  description: 'Desc',
  thumbnail: 'https://example.com/thumb.jpg',
  status: 'ready',
  views: 100,
  likes: 10,
  createdAt: new Date().toISOString(),
  trendScore: 88,
  tags: ['ai', 'demo'],
  script: 'Script text',
  voiceText: 'Voice text',
  duration: 60,
  chapters: [
    { time: '0:00', title: 'Intro' },
    { time: '0:30', title: 'Body' }
  ]
}

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'vid-1' }),
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

vi.mock('@/lib/store', () => ({
  useAppStore: () => ({
    videos: [video],
    updateVideo,
    deleteVideo
  })
}))

import VideoDetailPage from '@/app/dashboard/videos/[id]/page'

describe('VideoDetailPage', () => {
  beforeEach(() => {
    updateVideo.mockReset()
    deleteVideo.mockReset()
    push.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  afterAll(() => {
    delete (globalThis as any).SpeechSynthesisUtterance
  })

  it('renders and switches tabs', () => {
    ;(window as any).speechSynthesis = { cancel: vi.fn(), speak: vi.fn(), getVoices: vi.fn() }
    ;(globalThis as any).SpeechSynthesisUtterance = function SpeechMock(this: any, text: string) {
      this.text = text
    } as any

    render(<VideoDetailPage />)
    expect(screen.getByRole('heading', { name: 'Demo Video' })).toBeInTheDocument()
    fireEvent.click(screen.getByText('📝 Senaryo'))
    expect(screen.getByText('Script text')).toBeInTheDocument()
    fireEvent.click(screen.getByText('🎙️ Ses'))
    expect(screen.getByText('Voice text')).toBeInTheDocument()
  })

  it('publishes and deletes video', () => {
    ;(window as any).speechSynthesis = { cancel: vi.fn(), speak: vi.fn(), getVoices: vi.fn() }
    ;(globalThis as any).SpeechSynthesisUtterance = function SpeechMock(this: any, text: string) {
      this.text = text
    } as any

    const { container } = render(<VideoDetailPage />)
    fireEvent.click(screen.getByText('Yayınla'))
    expect(updateVideo).toHaveBeenCalledWith('vid-1', expect.objectContaining({ status: 'published' }))
    const deleteButton = container.querySelector('button.bg-red-600\\/20')
    if (deleteButton) {
      fireEvent.click(deleteButton)
    }
    expect(deleteVideo).toHaveBeenCalledWith('vid-1')
    expect(push).toHaveBeenCalledWith('/dashboard')
  })
})
