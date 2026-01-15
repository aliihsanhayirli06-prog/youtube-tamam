import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'

const toast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn()
}))

vi.mock('react-hot-toast', () => ({
  default: toast
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>{children}</a>
  )
}))

import SettingsPage from '@/app/dashboard/settings/page'

describe('SettingsPage', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    toast.success.mockReset()
    toast.error.mockReset()
  })

  afterEach(() => {
    cleanup()
    global.fetch = originalFetch
  })

  it('loads user data and updates profile', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { plan: 'PRO', creditsBalance: 200 } })
    }) as any

    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Profil'))
    fireEvent.submit(screen.getByRole('button', { name: 'Kaydet' }).closest('form') as HTMLFormElement)
    expect(toast.success).toHaveBeenCalled()
  })

  it('buys credits and handles failure', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { plan: 'FREE', creditsBalance: 5 } })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ balance: 55 })
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'nope' })
      }) as any

    render(<SettingsPage />)
    fireEvent.click(screen.getByText('Abonelik'))
    await screen.findByText('Ek Kredi Satin Al')
    const scopedButtons = screen.getAllByRole('button')
    const buy50 = scopedButtons.find((button) => button.textContent?.replace(/\s+/g, ' ').includes('50 Kredi'))
    expect(buy50).toBeDefined()
    if (buy50) {
      fireEvent.click(buy50)
    }
    await waitFor(() => expect(toast.success).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByText('55')).toBeInTheDocument())

    const buy100 = screen.getAllByRole('button').find((button) =>
      button.textContent?.replace(/\s+/g, ' ').includes('100 Kredi')
    )
    expect(buy100).toBeDefined()
    if (buy100) {
      await waitFor(() => expect(buy100).not.toBeDisabled())
      fireEvent.click(buy100)
    }
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(toast.error).toHaveBeenCalled())
  })
})
