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
    fireEvent.change(screen.getAllByPlaceholderText('Adınız Soyadınız')[0], { target: { value: 'Demo Kullanici' } })
    fireEvent.change(screen.getAllByPlaceholderText('ornek@email.com')[0], { target: { value: 'demo@autotube.ai' } })
    const passwordInputs = screen.getAllByPlaceholderText('••••••••')
    fireEvent.change(passwordInputs[0], { target: { value: 'abc12345' } })
    fireEvent.change(passwordInputs[1], { target: { value: 'abc123' } })
    const form = document.querySelector('form')
    if (form) {
      fireEvent.submit(form)
    }
    expect(toast.error).toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
  })

  it('register success navigates to channel setup', async () => {
    const { container } = render(<RegisterPage />)
    fireEvent.change(screen.getAllByPlaceholderText('Adınız Soyadınız')[0], { target: { value: 'Demo Kullanici' } })
    fireEvent.change(screen.getAllByPlaceholderText('ornek@email.com')[0], { target: { value: 'demo@autotube.ai' } })
    const passwordInputs = screen.getAllByPlaceholderText('••••••••')
    fireEvent.change(passwordInputs[0], { target: { value: 'abc12345' } })
    fireEvent.change(passwordInputs[1], { target: { value: 'abc12345' } })
    const timeoutSpy = vi.spyOn(window, 'setTimeout').mockImplementation((fn: any) => {
      if (typeof fn === 'function') fn()
      return 0 as any
    })
    const submit = container.querySelector('button[type="submit"]')
    if (submit) {
      fireEvent.click(submit)
    }
    expect(push).toHaveBeenCalledWith('/channel-setup')
    timeoutSpy.mockRestore()
  })
})
