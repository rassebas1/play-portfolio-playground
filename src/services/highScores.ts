/**
 * High Scores Service - Hexagonal Architecture
 * 
 * This module implements the adapter layer for the High Scores domain.
 * It provides pure functions to interact with the Vercel serverless API.
 * 
 * Architecture:
 * - Domain: src/types/highScores.ts (GameName, HighScore, ScoreSubmission, etc.)
 * - Port: This service interface (fetchLeaderboard, submitScore, checkHealth)
 * - Adapter: This implementation (HTTP calls to /api/scores)
 */

import type { 
  GameName, 
  HighScore, 
  ScoreSubmission, 
  HealthStatus 
} from '@/types/highScores'

/**
 * Port Interface - These functions define the contract for interacting
 * with the high scores system. They can be mocked for testing.
 */
export interface HighScoresPort {
  fetchLeaderboard(game: GameName, limit?: number): Promise<HighScore[]>
  submitScore(data: ScoreSubmission & { username: string }): Promise<boolean>
  checkHealth(): Promise<HealthStatus>
}

/**
 * API Adapter - Implementation of the HighScoresPort
 * Makes HTTP calls to the Vercel serverless API
 */

const API_BASE = '/api'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
  return response.json()
}

/**
 * Fetches the leaderboard for a specific game
 * @param game - The game name
 * @param limit - Maximum number of scores to retrieve (default: 10)
 * @returns Array of high scores sorted by score descending
 * @throws Error if the request fails
 */
export async function fetchLeaderboard(
  game: GameName, 
  limit: number = 10
): Promise<HighScore[]> {
  const url = new URL(`${API_BASE}/scores`, window.location.origin)
  url.searchParams.set('game', game)
  url.searchParams.set('limit', String(limit))

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  return handleResponse<HighScore[]>(response)
}

/**
 * Submits a new score to the leaderboard
 * @param data - Score submission data including game, username, score, and session info
 * @returns true if submission was successful
 * @throws Error if the submission fails
 */
export async function submitScore(
  data: ScoreSubmission & { username: string }
): Promise<boolean> {
  const response = await fetch(`${API_BASE}/scores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await handleResponse<{ success: boolean }>(response)
  return result.success
}

/**
 * Checks the health status of the high scores API
 * @returns Health status object
 * @throws Error if the health check fails
 */
export async function checkHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE}/health`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  return handleResponse<HealthStatus>(response)
}

/**
 * Default export - Object implementing the HighScoresPort interface
 * This allows for easy mocking/testing by replacing with a different adapter
 */
export const highScoresService: HighScoresPort = {
  fetchLeaderboard,
  submitScore,
  checkHealth,
}

/**
 * Factory function to create a custom high scores service
 * Useful for testing with different API endpoints or custom headers
 */
export function createHighScoresService(baseUrl: string): HighScoresPort {
  const apiBase = baseUrl || API_BASE

  async function customFetchLeaderboard(game: GameName, limit: number = 10): Promise<HighScore[]> {
    const url = new URL(`${apiBase}/scores`, window.location.origin)
    url.searchParams.set('game', game)
    url.searchParams.set('limit', String(limit))

    const response = await fetch(url.toString())
    return handleResponse<HighScore[]>(response)
  }

  async function customSubmitScore(data: ScoreSubmission & { username: string }): Promise<boolean> {
    const response = await fetch(`${apiBase}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await handleResponse<{ success: boolean }>(response)
    return result.success
  }

  async function customCheckHealth(): Promise<HealthStatus> {
    const response = await fetch(`${apiBase}/health`)
    return handleResponse<HealthStatus>(response)
  }

  return {
    fetchLeaderboard: customFetchLeaderboard,
    submitScore: customSubmitScore,
    checkHealth: customCheckHealth,
  }
}
