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

import SocialAuthButtons from '@/components/SocialAuthButtons'

describe('SocialAuthButtons', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    push.mockReset()
    toast.success.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
    cleanup()
  })

  it('triggers Google auth and navigates', () => {
    render(<SocialAuthButtons mode="register" />)
    fireEvent.click(screen.getByText(/Google ile Devam Et/i))
    vi.advanceTimersByTime(1600)
    expect(push).toHaveBeenCalledWith('/channel-setup')
  })

  it('triggers YouTube auth and navigates to dashboard', () => {
    render(<SocialAuthButtons />)
    fireEvent.click(screen.getByText(/YouTube ile Giriş Yap/i))
    vi.advanceTimersByTime(1600)
    expect(push).toHaveBeenCalledWith('/dashboard')
  })
})
