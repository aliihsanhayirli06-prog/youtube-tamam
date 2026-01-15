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

import ExportPackPage from '@/app/dashboard/export/page'

describe('ExportPackPage', () => {
  const originalFetch = global.fetch
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL

  beforeEach(() => {
    toast.success.mockReset()
    toast.error.mockReset()
  })

  afterEach(() => {
    cleanup()
    global.fetch = originalFetch
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
  })

  it('downloads ZIP on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['zip'])
    }) as any
    URL.createObjectURL = vi.fn(() => 'blob:mock')
    URL.revokeObjectURL = vi.fn()

    render(<ExportPackPage />)
    fireEvent.click(screen.getByText('ZIP Indir'))

    await waitFor(() => expect(toast.success).toHaveBeenCalled())
    expect(global.fetch).toHaveBeenCalledWith('/api/export/pack', expect.any(Object))
  })

  it('shows error on failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      blob: async () => new Blob([])
    }) as any

    render(<ExportPackPage />)
    fireEvent.click(screen.getByText('ZIP Indir'))

    await waitFor(() => expect(toast.error).toHaveBeenCalled())
  })
})
