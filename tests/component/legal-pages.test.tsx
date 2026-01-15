import React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import TermsPage from '@/app/terms/page'
import PrivacyPage from '@/app/privacy/page'

describe('legal pages', () => {
  it('renders terms page', () => {
    render(<TermsPage />)
    expect(screen.getByText(/Kullanim Sartlari/i)).toBeInTheDocument()
  })

  it('renders privacy page', () => {
    render(<PrivacyPage />)
    expect(screen.getByText(/Gizlilik Politikasi/i)).toBeInTheDocument()
  })
})
