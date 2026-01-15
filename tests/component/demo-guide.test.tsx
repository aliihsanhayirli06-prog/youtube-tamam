import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>{children}</a>
  )
}))

import DemoPage from '@/app/demo/page'
import ChannelGuidePage from '@/app/dashboard/guide/page'

describe('demo and guide pages', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    cleanup()
  })

  it('renders demo page and toggles play', () => {
    render(<DemoPage />)
    expect(screen.getByText(/AutoTube AI Nasıl Çalışır/i)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Duraklat'))
    expect(screen.getByText('Oynat')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Baştan Başla'))
  })

  it('renders guide page and switches sections', () => {
    render(<ChannelGuidePage />)
    expect(screen.getByText(/Kanal Rehberi/i)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Marka Oluşturma'))
    expect(screen.getByText(/Marka Kimliği/i)).toBeInTheDocument()
  })
})
