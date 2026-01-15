import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>{children}</a>
  )
}))

import LandingPage from '@/app/page'

describe('LandingPage', () => {
  it('renders primary CTAs', () => {
    render(<LandingPage />)
    expect(screen.getAllByText('Giriş Yap')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Başla')[0]).toBeInTheDocument()
    expect(screen.getByText('Demo İzle')).toBeInTheDocument()
  })
})
