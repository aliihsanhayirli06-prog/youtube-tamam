import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

import OnboardingTour from '@/components/OnboardingTour'

describe('OnboardingTour', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    cleanup()
  })

  it('advances steps and completes', async () => {
    const onComplete = vi.fn()
    render(<OnboardingTour onComplete={onComplete} onSkip={vi.fn()} />)

    expect(screen.getByText(/Hoş Geldiniz/i)).toBeInTheDocument()
    for (let i = 0; i < 6; i += 1) {
      fireEvent.click(screen.getByText('İleri'))
    }
    expect(screen.getByText(/Hazırsınız/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText('Başla'))
    vi.advanceTimersByTime(300)
    expect(onComplete).toHaveBeenCalled()
  })

  it('skips tour via close button', () => {
    const onSkip = vi.fn()
    render(<OnboardingTour onComplete={vi.fn()} onSkip={onSkip} />)

    fireEvent.click(screen.getAllByRole('button')[0])
    vi.advanceTimersByTime(300)
    expect(onSkip).toHaveBeenCalled()
  })
})
