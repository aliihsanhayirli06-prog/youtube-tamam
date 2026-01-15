import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act, waitFor } from '@testing-library/react'

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

vi.mock('@/components/SocialAuthButtons', () => ({
  default: () => <div data-testid="social-auth" />
}))

import LoginPage from '@/app/login/page'
import RegisterPage from '@/app/register/page'

describe('auth pages', () => {
  beforeEach(() => {
    push.mockReset()
    toast.success.mockReset()
    toast.error.mockReset()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    cleanup()
  })

  it('login submits and navigates', async () => {
    render(<LoginPage />)
    fireEvent.change(screen.getByPlaceholderText('ornek@email.com'), { target: { value: 'demo@autotube.ai' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Giriş Yap' }))
    vi.advanceTimersByTime(1600)
    expect(push).toHaveBeenCalledWith('/dashboard')
  })

  it('register shows error on mismatch', () => {
    render(<RegisterPage />)
    fireEvent.change(screen.getByLabelText('Ad Soyad'), { target: { value: 'Demo Kullanici' } })
    fireEvent.change(screen.getByLabelText('E-posta'), { target: { value: 'demo@autotube.ai' } })
    fireEvent.change(screen.getByLabelText('Şifre'), { target: { value: 'abc12345' } })
    fireEvent.change(screen.getByLabelText('Şifre Tekrar'), { target: { value: 'abc123' } })
    const form = document.querySelector('form')
    if (form) {
      fireEvent.submit(form)
    }
    expect(toast.error).toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
  })

  it('register success navigates to channel setup', async () => {
    vi.useRealTimers()
    const { container } = render(<RegisterPage />)
    fireEvent.change(screen.getByLabelText('Ad Soyad'), { target: { value: 'Demo Kullanici' } })
    fireEvent.change(screen.getByLabelText('E-posta'), { target: { value: 'demo@autotube.ai' } })
    fireEvent.change(screen.getByLabelText('Şifre'), { target: { value: 'abc12345' } })
    fireEvent.change(screen.getByLabelText('Şifre Tekrar'), { target: { value: 'abc12345' } })
    const form = container.querySelector('form')
    expect(form).toBeTruthy()
    act(() => {
      fireEvent.submit(form as HTMLFormElement)
    })
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/channel-setup')
    }, { timeout: 2000 })
  })
})
