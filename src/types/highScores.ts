export type GameName = 'snake' | '2048' | 'flappy-bird' | 'brick-breaker' | 'memory-game'

export const ALLOWED_GAMES: GameName[] = [
  'snake',
  '2048',
  'flappy-bird',
  'brick-breaker',
  'memory-game'
]

export const EXCLUDED_GAMES = ['tic-tac-toe'] as const

export interface HighScore {
  username: string
  score: number
  created_at: string
}

export interface ScoreSubmission {
  game: GameName
  username: string
  score: number
  sessionId?: string
  sessionDuration?: number
  moves?: number
}

export interface GameSession {
  id: string
  startTime: number
  moves: number
  game: GameName
}

export interface ScoreSubmitResult {
  success: boolean
  error?: string
}

export interface LeaderboardResult {
  data: HighScore[]
  error?: string
}

export interface HealthStatus {
  status: 'ok' | 'degraded'
  timestamp: string
  service: string
  version: string
  database: 'connected' | 'error'
  error?: string
}

export interface GameMinimums {
  minDuration: number
  minMoves: number
}

export const GAME_MINIMUMS: Record<GameName, GameMinimums> = {
  snake: { minDuration: 5000, minMoves: 10 },
  '2048': { minDuration: 3000, minMoves: 5 },
  'flappy-bird': { minDuration: 3000, minMoves: 5 },
  'brick-breaker': { minDuration: 5000, minMoves: 10 },
  'memory-game': { minDuration: 10000, minMoves: 8 }
}

export function isValidGameName(game: string): game is GameName {
  return ALLOWED_GAMES.includes(game as GameName)
}

export function createGameSession(game: GameName): GameSession {
  return {
    id: crypto.randomUUID(),
    startTime: Date.now(),
    moves: 0,
    game
  }
}

export function validateUsername(username: string): boolean {
  const clean = username.toUpperCase().replace(/[^A-Z0-9]/g, '')
  return clean.length === 3
}

export function validateScore(score: number): boolean {
  return typeof score === 'number' && score >= 0 && score <= 1000000
}
