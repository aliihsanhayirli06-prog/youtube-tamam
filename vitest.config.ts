import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  esbuild: {
    jsx: 'automatic'
  },
  test: {
    include: [
      'tests/unit/**/*.test.{ts,tsx}',
      'tests/component/**/*.test.{ts,tsx}',
      'tests/integration/**/*.test.{ts,tsx}'
    ],
    environment: 'jsdom',
    setupFiles: ['tests/component/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    }
  }
})
