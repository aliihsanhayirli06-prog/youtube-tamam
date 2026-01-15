import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

const push = vi.hoisted(() => vi.fn())
const toast = vi.hoisted(() => ({
  success: vi.fn()
}))

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

import NewChannelPage from '@/app/dashboard/channels/new/page'

describe('NewChannelPage', () => {
  beforeEach(() => {
    toast.success.mockReset()
    push.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('walks through steps and creates channel', () => {
    render(<NewChannelPage />)
    fireEvent.click(screen.getByText('İleri'))
    fireEvent.click(screen.getByText('İleri'))
    fireEvent.click(screen.getByText('İleri'))
    fireEvent.click(screen.getByText('İleri'))
    fireEvent.click(screen.getByText('SEO Paketi'))
    fireEvent.click(screen.getByText('Kanal Oluştur'))
    expect(toast.success).toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith('/dashboard')
  })
})
