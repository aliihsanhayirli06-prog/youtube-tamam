import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

const push = vi.hoisted(() => vi.fn())
const toast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn()
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push })
}))

vi.mock('react-hot-toast', () => ({
  default: toast
}))

import ChannelSetupPage from '@/app/channel-setup/page'
import CreatingChannelView from '@/components/CreatingChannelView'

describe('channel setup', () => {
  beforeEach(() => {
    push.mockReset()
    toast.success.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('shows question and navigates to connect', async () => {
    render(<ChannelSetupPage />)
    fireEvent.click(screen.getByRole('button', { name: /Evet, Kanalım Var/i }))
    expect(await screen.findByRole('button', { name: /YouTube ile Bağlan/i })).toBeInTheDocument()
  })

  it('shows create channel view', () => {
    render(<ChannelSetupPage />)
    fireEvent.click(screen.getByRole('button', { name: /Hayır, Yeni Kanal/i }))
    expect(screen.getByRole('heading', { name: 'YouTube Kanalı Oluştur', exact: true })).toBeInTheDocument()
  })
})

describe('creating channel view', () => {
  it('calls onChannelCreated', () => {
    const onChannelCreated = vi.fn()
    render(
      <CreatingChannelView
        onChannelCreated={onChannelCreated}
        onClose={() => undefined}
        onBack={() => undefined}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Kanalım Hazır, Devam Et' }))
    expect(onChannelCreated).toHaveBeenCalled()
  })
})
