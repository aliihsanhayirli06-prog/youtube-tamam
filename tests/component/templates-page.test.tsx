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

import TemplatesPage from '@/app/dashboard/templates/page'

describe('TemplatesPage', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    toast.success.mockReset()
    toast.error.mockReset()
  })

  afterEach(() => {
    cleanup()
    global.fetch = originalFetch
  })

  it('shows lock overlay for free users', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { plan: 'FREE' } })
    }) as any

    render(<TemplatesPage />)
    await waitFor(() => expect(screen.getByText(/Premium ile acilir/i)).toBeInTheDocument())
    fireEvent.click(screen.getByText('Paketi Uret'))
    expect(toast.error).toHaveBeenCalled()
  })

  it('allows premium users to generate pack', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { plan: 'PREMIUM' } })
    }) as any

    render(<TemplatesPage />)
    await waitFor(() => expect(screen.getByText(/Templates Magazasi/i)).toBeInTheDocument())
    fireEvent.click(screen.getByText('Paketi Uret'))
    expect(toast.success).toHaveBeenCalled()
  })
})
