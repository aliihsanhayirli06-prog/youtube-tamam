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

import AutopilotPage from '@/app/dashboard/autopilot/page'

describe('AutopilotPage', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    toast.success.mockReset()
    toast.error.mockReset()
  })

  afterEach(() => {
    cleanup()
    global.fetch = originalFetch
  })

  it('generates a prompt with OpenAI', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'Cinematic prompt' } }] })
      }) as any

    render(<AutopilotPage />)
    fireEvent.change(screen.getByPlaceholderText(/Sinematik/i), { target: { value: 'Test' } })
    fireEvent.click(screen.getByText('Prompt Uret'))

    await waitFor(() => expect(screen.getByDisplayValue('Cinematic prompt')).toBeInTheDocument())
  })

  it('shows error when starting without prompt', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] })
    }) as any

    render(<AutopilotPage />)
    fireEvent.click(screen.getByText('Videoyu Olustur'))
    expect(toast.error).toHaveBeenCalled()
  })
})
