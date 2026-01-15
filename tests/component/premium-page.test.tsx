import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'

const toast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn()
}))

let searchParams = new URLSearchParams()

vi.mock('react-hot-toast', () => ({
  default: toast
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>{children}</a>
  )
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => searchParams
}))

import PremiumPage from '@/app/dashboard/premium/page'

describe('PremiumPage', () => {
  const originalFetch = global.fetch
  const originalLocation = window.location

  beforeEach(() => {
    toast.success.mockReset()
    toast.error.mockReset()
    searchParams = new URLSearchParams()
    delete (window as any).location
    ;(window as any).location = { href: '' }
  })

  afterEach(() => {
    cleanup()
    global.fetch = originalFetch
    window.location = originalLocation
  })

  it('shows success and cancel toasts from query', async () => {
    searchParams = new URLSearchParams('success=1&cancel=1')
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { creditsBalance: 5, plan: 'FREE' } })
    }) as any

    render(<PremiumPage />)
    await waitFor(() => expect(toast.success).toHaveBeenCalled())
    expect(toast.error).toHaveBeenCalled()
  })

  it('subscribes to pro plan and opens checkout', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { creditsBalance: 5, plan: 'FREE' } })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: 'https://stripe.test/checkout' })
      }) as any

    render(<PremiumPage />)
    await waitFor(() => expect(screen.getAllByRole('button', { name: /Hemen Başla/i }).length).toBeGreaterThan(0))
    fireEvent.click(screen.getAllByRole('button', { name: /Hemen Başla/i })[0])
    await waitFor(() => expect((window as any).location.href).toContain('stripe.test'))
  })

  it('opens customer portal and handles errors', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { creditsBalance: 5, plan: 'FREE' } })
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'nope' })
      }) as any

    render(<PremiumPage />)
    fireEvent.click(screen.getByText('Fatura & Iptal'))
    await waitFor(() => expect(toast.error).toHaveBeenCalled())
  })
})
