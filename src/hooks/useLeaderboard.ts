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
}

/**
 * Leaderboard actions exposed by the hook
 */
export interface LeaderboardActions {
  fetchScores: () => Promise<void>
  submitScore: (username: string, score: number, session: GameSession | null) => Promise<boolean>
}

/**
 * Combined return type for the useLeaderboard hook
 */
export type UseLeaderboard = LeaderboardState & LeaderboardActions

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

  const service = options?.service || highScoresService
  const shouldAutoFetch = options?.autoFetch !== false

  /**
   * Fetches the leaderboard from the API
   */
  const fetchScores = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await service.fetchLeaderboard(game, limit)
      setScores(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch scores'
      setError(message)
      console.error('useLeaderboard: Failed to fetch scores:', err)
    } finally {
      setLoading(false)
    }
  }, [game, limit, service])

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
    fetchScores,
    submitScore: submitScoreAction,
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
