import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWindowSize } from './useWindowSize'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useWindowSize', () => {
  it('returns initial window dimensions', () => {
    const { result } = renderHook(() => useWindowSize())

    expect(result.current).toHaveProperty('width')
    expect(result.current).toHaveProperty('height')
    expect(typeof result.current.width).toBe('number')
    expect(typeof result.current.height).toBe('number')
  })

  it('updates on window resize', () => {
    const { result } = renderHook(() => useWindowSize())

    act(() => {
      window.innerWidth = 800
      window.innerHeight = 600
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current.width).toBe(800)
    expect(result.current.height).toBe(600)
  })

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useWindowSize())

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
