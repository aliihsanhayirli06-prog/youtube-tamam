import React from 'react'
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('framer-motion', () => {
  const motion = new Proxy(
    {},
    {
      get: (_target, key) => (props: any) => {
        const tag = typeof key === 'string' ? key : 'div'
        const {
          whileHover,
          whileTap,
          initial,
          animate,
          exit,
          transition,
          ...rest
        } = props || {}
        return React.createElement(tag, rest)
      }
    }
  )

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children)
  }
})
