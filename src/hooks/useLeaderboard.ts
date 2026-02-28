/**
 * useLeaderboard Hook - Hexagonal Architecture
 * 
 * This module implements the adapter layer for the High Scores domain in React.
 * It bridges the service layer (src/services/highScores.ts) with React components.
 * 
 * Architecture:
 * - Domain: src/types/highScores.ts (GameName, HighScore, GameSession)
 * - Port: src/services/highScores.ts (HighScoresPort interface)
 * - Adapter: This hook (React state management + service calls)
 * - UI: src/components/ui/Leaderboard.tsx
 * 
 * Features:
 * - Offline handling with sessionStorage caching
 * - Online/offline event detection
 * - Accessibility support
 */

import { useState, useEffect, useCallback } from 'react'
import type { GameName, HighScore, GameSession } from '@/types/highScores'
import { 
  fetchLeaderboard, 
  submitScore, 
  highScoresService,
  type HighScoresPort 
} from '@/services/highScores'

/**
 * Leaderboard state managed by the hook
 */
export interface LeaderboardState {
  scores: HighScore[]
  loading: boolean
  error: string | null
  isOnline: boolean
  isOffline: boolean
  lastFetched: number | null
}

/**
 * Leaderboard actions exposed by the hook
 */
export interface LeaderboardActions {
  fetchScores: () => Promise<void>
  submitScore: (username: string, score: number, session: GameSession | null) => Promise<boolean>
  retry: () => Promise<void>
}

/**
 * Combined return type for the useLeaderboard hook
 */
export type UseLeaderboard = LeaderboardState & LeaderboardActions

/**
 * Session storage key generator for caching
 */
function getCacheKey(game: GameName, limit: number): string {
  return `leaderboard_${game}_${limit}`
}

/**
 * Load cached scores from sessionStorage
 */
function loadCachedScores(game: GameName, limit: number): { scores: HighScore[]; timestamp: number } | null {
  try {
    const key = getCacheKey(game, limit)
    const cached = sessionStorage.getItem(key)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch {
    // sessionStorage not available
  }
  return null
}

/**
 * Save scores to sessionStorage cache
 */
function saveScoresToCache(game: GameName, limit: number, scores: HighScore[]): void {
  try {
    const key = getCacheKey(game, limit)
    sessionStorage.setItem(key, JSON.stringify({
      scores,
      timestamp: Date.now()
    }))
  } catch {
    // sessionStorage not available or quota exceeded
  }
}

/**
 * Custom hook for managing leaderboard state and actions
 * 
 * @param game - The game name to fetch leaderboard for
 * @param limit - Maximum number of scores to retrieve (default: 10)
 * @param options - Optional configuration for the service
 * @returns Leaderboard state and actions
 * 
 * @example
 * ```tsx
 * const { scores, loading, error, fetchScores, submitScore } = useLeaderboard('snake')
 * 
 * // Fetch scores on mount
 * useEffect(() => { fetchScores() }, [])
 * 
 * // Submit a score
 * await submitScore('ABC', 1500, session)
 * ```
 */
export function useLeaderboard(
  game: GameName, 
  limit: number = 10,
  options?: {
    service?: HighScoresPort
    autoFetch?: boolean
  }
): UseLeaderboard {
  const [scores, setScores] = useState<HighScore[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [lastFetched, setLastFetched] = useState<number | null>(null)

  const service = options?.service || highScoresService
  const shouldAutoFetch = options?.autoFetch !== false

  // Monitor online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)
      setIsOffline(!online)
    }

    // Set initial status
    updateOnlineStatus()

    // Listen for changes
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  // Load cached data on mount if offline
  useEffect(() => {
    if (!isOnline && !lastFetched) {
      const cached = loadCachedScores(game, limit)
      if (cached) {
        setScores(cached.scores)
        setLastFetched(cached.timestamp)
      }
    }
  }, [isOnline, game, limit, lastFetched])

  /**
   * Fetches the leaderboard from the API
   */
  const fetchScores = useCallback(async () => {
    // If offline, try to load from cache
    if (!navigator.onLine) {
      const cached = loadCachedScores(game, limit)
      if (cached) {
        setScores(cached.scores)
        setLastFetched(cached.timestamp)
        setIsOffline(true)
        setError('Showing cached scores (offline)')
        setLoading(false)
        return
      }
    }

    setLoading(true)
    setError(null)
    setIsOffline(false)

    try {
      const data = await service.fetchLeaderboard(game, limit)
      setScores(data)
      setLastFetched(Date.now())
      // Cache the data
      saveScoresToCache(game, limit, data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch scores'
      setError(message)
      
      // Try to load from cache on error
      const cached = loadCachedScores(game, limit)
      if (cached) {
        setScores(cached.scores)
        setLastFetched(cached.timestamp)
      }
    } finally {
      setLoading(false)
    }
  }, [game, limit, service])

  /**
   * Retry fetching scores (useful after coming back online)
   */
  const retry = useCallback(async () => {
    setError(null)
    await fetchScores()
  }, [fetchScores])

  /**
   * Submits a score to the leaderboard
   * 
   * @param username - 3-letter player name
   * @param score - The achieved score
   * @param session - Optional game session for validation
   * @returns true if submission was successful
   */
  const submitScoreAction = useCallback(async (
    username: string,
    score: number,
    session: GameSession | null
  ): Promise<boolean> => {
    if (!username || username.length !== 3) {
      setError('Username must be 3 characters')
      return false
    }

    setError(null)

    try {
      const sessionDuration = session ? Date.now() - session.startTime : 0
      const moves = session?.moves || 0

      const success = await service.submitScore({
        game,
        username: username.toUpperCase(),
        score,
        sessionId: session?.id,
        sessionDuration,
        moves,
      })

      if (success) {
        await fetchScores()
      }

      return success
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit score'
      setError(message)
      console.error('useLeaderboard: Failed to submit score:', err)
      return false
    }
  }, [game, service, fetchScores])

  // Auto-fetch scores on mount
  useEffect(() => {
    if (shouldAutoFetch) {
      fetchScores()
    }
  }, [fetchScores, shouldAutoFetch])

  return {
    scores,
    loading,
    error,
    isOnline,
    isOffline,
    lastFetched,
    fetchScores,
    submitScore: submitScoreAction,
    retry,
  }
}

/**
 * Hook for submitting scores after game ends
 * Provides a simpler interface for score submission without auto-fetching
 * 
 * @param game - The game name
 * @returns submit function and state
 */
export function useScoreSubmitter(game: GameName) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(async (
    username: string,
    score: number,
    session: GameSession | null
  ): Promise<boolean> => {
    if (!username || username.length !== 3) {
      setError('Username must be 3 characters')
      return false
    }

    setSubmitting(true)
    setError(null)
    setSubmitted(false)

    try {
      const sessionDuration = session ? Date.now() - session.startTime : 0
      const moves = session?.moves || 0

      const success = await submitScore({
        game,
        username: username.toUpperCase(),
        score,
        sessionId: session?.id,
        sessionDuration,
        moves,
      })

      if (success) {
        setSubmitted(true)
      } else {
        setError('Failed to submit score')
      }

      return success
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit score'
      setError(message)
      return false
    } finally {
      setSubmitting(false)
    }
  }, [game])

  const reset = useCallback(() => {
    setSubmitted(false)
    setError(null)
  }, [])

  return {
    submit,
    submitting,
    submitted,
    error,
    reset,
  }
}
