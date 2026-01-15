import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>{children}</a>
  )
}))

import UpsellModal from '@/components/UpsellModal'

describe('UpsellModal', () => {
  it('renders content when open and calls onClose', () => {
    const onClose = vi.fn()
    render(<UpsellModal isOpen onClose={onClose} type="feature" feature="Test" />)

    expect(screen.getByText(/Premium Özellik/i)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Şimdilik geç'))
    expect(onClose).toHaveBeenCalled()
  })

  it('renders nothing when closed', () => {
    const { container } = render(<UpsellModal isOpen={false} onClose={vi.fn()} type="update" />)
    expect(container).toBeEmptyDOMElement()
  })
})
