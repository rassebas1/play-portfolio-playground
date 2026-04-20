import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

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

interface LeaderboardEntry {
  username: string
  total_score: number
  games_played: number
  best_game: string | null
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

  const limit = Math.min(parseInt((request.query?.limit as string) || '10'), 100)

  try {
    // Obtener los top players por score total
    const { data: scoresData, error: scoresError } = await supabase
      .from('high_scores')
      .select('username, score, game')
      .order('score', { ascending: false })
      .limit(limit * 2) // Get more to aggregate

    if (scoresError) {
      console.error('Scores error:', scoresError)
      return response.status(500).json({ error: 'Failed to fetch leaderboard' })
    }

    // Agregar por username
    const playerStats: Record<string, { totalScore: number; gamesPlayed: number; games: Record<string, number> }> = {}

    scoresData?.forEach((row) => {
      const username = row.username
      if (!playerStats[username]) {
        playerStats[username] = { totalScore: 0, gamesPlayed: 0, games: {} }
      }
      playerStats[username].totalScore += row.score || 0
      playerStats[username].gamesPlayed++
      if (row.game) {
        playerStats[username].games[row.game] = (playerStats[username].games[row.game] || 0) + (row.score || 0)
      }
    })

    // Convertir a array y ordenar
    const leaderboard: LeaderboardEntry[] = Object.entries(playerStats)
      .map(([username, stats]) => ({
        username,
        total_score: stats.totalScore,
        games_played: stats.gamesPlayed,
        best_game: Object.entries(stats.games).sort((a, b) => b[1] - a[1])[0]?.[0] || null
      }))
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, limit)

    return response.status(200).json(leaderboard)
  } catch (err) {
    console.error('Leaderboard error:', err)
    return response.status(500).json({ error: 'Internal server error' })
  }
}