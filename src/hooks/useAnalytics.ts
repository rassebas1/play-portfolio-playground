import { useEffect, useCallback } from 'react'

// Analytics API URL - pointing to Vercel deployment
const ANALYTICS_API = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/analytics/track`
  : '/api/analytics/track'

function getOrCreateSessionId(): string {
  const STORAGE_KEY = 'portfolio_session_id'
  const existing = localStorage.getItem(STORAGE_KEY)
  if (existing) return existing
  
  const newId = crypto.randomUUID()
  localStorage.setItem(STORAGE_KEY, newId)
  return newId
}

export type AnalyticsEvent = 'page_view' | 'game_start' | 'game_end' | 'cv_download'

export function useAnalytics() {
  const trackPageView = useCallback(async (page?: string) => {
    try {
      const sessionId = getOrCreateSessionId()
      await fetch(ANALYTICS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          event: 'page_view', 
          sessionId,
          metadata: page ? { page } : {}
        })
      })
    } catch (err) {
      // Silently fail -Analytics no debe afectar la UX
      console.debug('Analytics track failed:', err)
    }
  }, [])

  const trackGameStart = useCallback(async (game: string) => {
    try {
      const sessionId = getOrCreateSessionId()
      await fetch(ANALYTICS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          event: 'game_start', 
          sessionId,
          game
        })
      })
    } catch (err) {
      console.debug('Analytics track failed:', err)
    }
  }, [])

  const trackGameEnd = useCallback(async (game: string, score?: number) => {
    try {
      const sessionId = getOrCreateSessionId()
      await fetch(ANALYTICS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          event: 'game_end', 
          sessionId,
          game,
          metadata: score ? { score } : {}
        })
      })
    } catch (err) {
      console.debug('Analytics track failed:', err)
    }
  }, [])

  return {
    trackPageView,
    trackGameStart,
    trackGameEnd
  }
}

// Hook para usar en páginas - hace track automáticamente al montar
export function usePageView(pageName: string) {
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    trackPageView(pageName)
  }, [pageName, trackPageView])
}