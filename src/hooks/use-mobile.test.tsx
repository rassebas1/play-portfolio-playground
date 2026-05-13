import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIsMobile } from './use-mobile'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useIsMobile', () => {
  it('returns false when viewport is >= 768px', () => {
    window.innerWidth = 1024

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('returns true when viewport is < 768px', () => {
    window.innerWidth = 375

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })
})
