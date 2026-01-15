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

import ReferralPage from '@/app/dashboard/referral/page'

describe('ReferralPage', () => {
  const originalClipboard = navigator.clipboard
  const originalFetch = global.fetch

  beforeEach(() => {
    toast.success.mockReset()
    toast.error.mockReset()
  })

  afterEach(() => {
    cleanup()
    global.fetch = originalFetch
    Object.defineProperty(navigator, 'clipboard', { value: originalClipboard })
  })

  it('loads referral code and copies link', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { referralCode: 'REF123' } })
    }) as any
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true
    })

    render(<ReferralPage />)
    await waitFor(() => expect(screen.getByText(/REF123/)).toBeInTheDocument())
    fireEvent.click(screen.getByText('Kopyala'))
    await waitFor(() => expect(toast.success).toHaveBeenCalled())
  })

  it('handles clipboard failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { referralCode: 'REFERRAL' } })
    }) as any
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('nope')) },
      configurable: true
    })

    render(<ReferralPage />)
    await waitFor(() => expect(screen.getByText(/REFERRAL/)).toBeInTheDocument())
    fireEvent.click(screen.getByText('Kopyala'))
    await waitFor(() => expect(toast.error).toHaveBeenCalled())
  })
})
