// Analytics API Types

// GET /api/analytics response
export interface GlobalAnalytics {
  total_games_played: number
  unique_sessions: number
  last_24h_games: number
  last_7d_games: number
  top_game: string | null
  total_scores_submitted: number
  total_cv_downloads: number
  updated_at: string
}

// GET /api/analytics/[game] response
export interface GameAnalytics {
  game: string
  total_plays: number
  unique_players: number
  avg_session_duration: number | null
  highest_score: number | null
  last_played: string | null
  scores_count: number
}

// GET /api/analytics/leaderboard response
export interface LeaderboardEntry {
  username: string
  total_score: number
  games_played: number
  best_game: string | null
}

// POST /api/analytics/track body
export interface AnalyticsEvent {
  event: 'page_view' | 'game_start' | 'game_end' | 'cv_download'
  sessionId?: string
  game?: string
  metadata?: Record<string, unknown>
}

// POST /api/analytics/track response
export interface TrackResponse {
  success?: boolean
  error?: string
}