import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

const ALLOWED_GAMES = ['snake', '2048', 'flappy-bird', 'brick-breaker', 'memory-game', 'tetris', 'minesweeper']

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 100

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

interface GameAnalytics {
  game: string
  total_plays: number
  unique_players: number
  avg_session_duration: number | null
  highest_score: number | null
  last_played: string | null
  scores_count: number
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

  const game = request.query?.game as string

  // Validación de juego
  if (!game || !ALLOWED_GAMES.includes(game)) {
    return response.status(400).json({ error: 'Invalid game' })
  }

  try {
    const [
      totalPlaysResult,
      uniquePlayersResult,
      scoresResult,
      lastPlayedResult
    ] = await Promise.all([
      // total_plays: COUNT de game_start para este juego
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('event', 'game_start')
        .eq('game', game),

      // unique_players: COUNT DISTINCT session_id
      supabase
        .from('analytics_events')
        .select('session_id', { count: 'exact', head: true })
        .eq('game', game)
        .not('session_id', 'is', null),

      // highest_score
      supabase
        .from('high_scores')
        .select('score')
        .eq('game', game)
        .order('score', { ascending: false })
        .limit(1),

      // last_played
      supabase
        .from('analytics_events')
        .select('created_at')
        .eq('event', 'game_start')
        .eq('game', game)
        .order('created_at', { ascending: false })
        .limit(1)
    ])

    const highestScore = scoresResult.data?.[0]?.score || null
    const lastPlayed = lastPlayedResult.data?.[0]?.created_at || null

    const analytics: GameAnalytics = {
      game,
      total_plays: totalPlaysResult.count || 0,
      unique_players: uniquePlayersResult.count || 0,
      avg_session_duration: null, // TODO: implement with duration tracking
      highest_score: highestScore,
      last_played: lastPlayed,
      scores_count: scoresResult.data?.length || 0
    }

    return response.status(200).json(analytics)
  } catch (err) {
    console.error('Game analytics error:', err)
    return response.status(500).json({ error: 'Internal server error' })
  }
}