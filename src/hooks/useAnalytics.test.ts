import { renderHook } from '@testing-library/react'
import { useAnalytics } from '@/hooks/useAnalytics'

const mockFetch = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('useAnalytics', () => {
  describe('interface', () => {
    it('returns an object with trackPageView, trackGameStart, and trackGameEnd', () => {
      const { result } = renderHook(() => useAnalytics())

      expect(result.current).toHaveProperty('trackPageView')
      expect(result.current).toHaveProperty('trackGameStart')
      expect(result.current).toHaveProperty('trackGameEnd')
      expect(Object.keys(result.current)).toHaveLength(3)
    })

    it('returns functions that are callable', () => {
      const { result } = renderHook(() => useAnalytics())

      expect(typeof result.current.trackPageView).toBe('function')
      expect(typeof result.current.trackGameStart).toBe('function')
      expect(typeof result.current.trackGameEnd).toBe('function')
    })
  })

  describe('trackPageView', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({ ok: true })
    })

    it('sends a POST request with event page_view and empty metadata when no page is provided', async () => {
      const { result } = renderHook(() => useAnalytics())

      await result.current.trackPageView()

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, config] = mockFetch.mock.calls[0]
      expect(url).toContain('/api/analytics/track')
      expect(config.method).toBe('POST')
      expect(config.headers['Content-Type']).toBe('application/json')

      const body = JSON.parse(config.body)
      expect(body.event).toBe('page_view')
      expect(body.metadata).toEqual({})
      expect(body.sessionId).toBeDefined()
    })

    it('includes page name in metadata when provided', async () => {
      const { result } = renderHook(() => useAnalytics())

      await result.current.trackPageView('dashboard')

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.metadata).toEqual({ page: 'dashboard' })
    })
  })

  describe('trackGameStart', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({ ok: true })
    })

    it('sends a POST request with event game_start and game name', async () => {
      const { result } = renderHook(() => useAnalytics())

      await result.current.trackGameStart('tic-tac-toe')

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.event).toBe('game_start')
      expect(body.game).toBe('tic-tac-toe')
      expect(body.sessionId).toBeDefined()
    })
  })

  describe('trackGameEnd', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({ ok: true })
    })

    it('sends a POST request with event game_end and game name', async () => {
      const { result } = renderHook(() => useAnalytics())

      await result.current.trackGameEnd('tic-tac-toe')

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.event).toBe('game_end')
      expect(body.game).toBe('tic-tac-toe')
    })

    it('includes score in metadata when provided', async () => {
      const { result } = renderHook(() => useAnalytics())

      await result.current.trackGameEnd('tic-tac-toe', 42)

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.metadata).toEqual({ score: 42 })
    })

    it('omits metadata when score is not provided', async () => {
      const { result } = renderHook(() => useAnalytics())

      await result.current.trackGameEnd('tic-tac-toe')

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.metadata).toEqual({})
    })
  })

  describe('session management', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({ ok: true })
    })

    it('generates a new session ID and stores it in localStorage', async () => {
      const { result } = renderHook(() => useAnalytics())

      await result.current.trackPageView()

      expect(localStorage.getItem('portfolio_session_id')).toBeDefined()
    })

    it('reuses an existing session ID from localStorage', async () => {
      const existingSessionId = 'existing-session-123'
      localStorage.setItem('portfolio_session_id', existingSessionId)

      const { result } = renderHook(() => useAnalytics())

      await result.current.trackPageView()

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.sessionId).toBe(existingSessionId)
    })
  })

  describe('error handling', () => {
    it('silently fails on fetch errors without throwing', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      vi.spyOn(console, 'debug').mockImplementation(() => {})

      const { result } = renderHook(() => useAnalytics())

      // Should not throw
      await expect(result.current.trackPageView()).resolves.not.toThrow()

      expect(console.debug).toHaveBeenCalledWith(
        'Analytics track failed:',
        expect.any(Error),
      )

      console.debug.mockRestore()
    })
  })
})
