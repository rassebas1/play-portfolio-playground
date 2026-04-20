import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// Rate limiting: simple in-memory store (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 100 // requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

interface GlobalAnalytics {
  total_games_played: number
  unique_sessions: number
  last_24h_games: number
  last_7d_games: number
  top_game: string | null
  total_scores_submitted: number
  total_cv_downloads: number
  updated_at: string
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const origin = request.headers.origin || process.env.VERCEL_URL || '*'
  response.setHeader('Access-Control-Allow-Origin', origin)
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (request.method === 'OPTIONS') {
    return response.status(204).send(null)
  }

  // Rate limiting
  const clientIp = request.headers['x-forwarded-for'] as string || 'unknown'
  if (!checkRateLimit(clientIp)) {
    response.setHeader('Retry-After', '60')
    return response.status(429).json({ error: 'Too many requests' })
  }

  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Queries en paralelo para mejor performance
    const [
      totalGamesResult,
      uniqueSessionsResult,
      last24hResult,
      last7dResult,
      topGameResult,
      scoresResult,
      cvDownloadsResult
    ] = await Promise.all([
      // total_games_played: COUNT de game_start + game_end
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .in('event', ['game_start', 'game_end']),

      // unique_sessions: COUNT DISTINCT session_id
      supabase
        .from('analytics_events')
        .select('session_id', { count: 'exact', head: true })
        .not('session_id', 'is', null),

      // last_24h_games
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .in('event', ['game_start', 'game_end'])
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),

      // last_7d_games
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .in('event', ['game_start', 'game_end'])
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),

      // top_game: game más jugado (por game_start)
      supabase
        .from('analytics_events')
        .select('game')
        .eq('event', 'game_start')
        .not('game', 'is', null),

      // total_scores_submitted
      supabase
        .from('high_scores')
        .select('id', { count: 'exact', head: true }),

      // total_cv_downloads
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('event', 'cv_download')
    ])

    // Calcular top game
    const gameCounts: Record<string, number> = {}
    if (topGameResult.data) {
      topGameResult.data.forEach((row) => {
        if (row.game) {
          gameCounts[row.game] = (gameCounts[row.game] || 0) + 1
        }
      })
    }
    const topGame = Object.entries(gameCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

    const analytics: GlobalAnalytics = {
      total_games_played: totalGamesResult.count || 0,
      unique_sessions: uniqueSessionsResult.count || 0,
      last_24h_games: last24hResult.count || 0,
      last_7d_games: last7dResult.count || 0,
      top_game: topGame,
      total_scores_submitted: scoresResult.count || 0,
      total_cv_downloads: cvDownloadsResult.count || 0,
      updated_at: new Date().toISOString()
    }

    return response.status(200).json(analytics)
  } catch (err) {
    console.error('Analytics error:', err)
    return response.status(500).json({ error: 'Internal server error' })
  }
}