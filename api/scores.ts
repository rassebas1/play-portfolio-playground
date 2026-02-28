import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

const ALLOWED_GAMES = ['snake', '2048', 'flappy-bird', 'brick-breaker', 'memory-game']

interface ScoreSubmission {
  game: string
  username: string
  score: number
  sessionId?: string
  sessionDuration?: number
  moves?: number
}

const GAME_MINIMUMS: Record<string, { minDuration: number; minMoves: number }> = {
  snake: { minDuration: 5000, minMoves: 10 },
  '2048': { minDuration: 3000, minMoves: 5 },
  'flappy-bird': { minDuration: 3000, minMoves: 5 },
  'brick-breaker': { minDuration: 5000, minMoves: 10 },
  'memory-game': { minDuration: 10000, minMoves: 8 }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const origin = request.headers.origin || process.env.VERCEL_URL || '*'
  response.setHeader('Access-Control-Allow-Origin', origin)
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (request.method === 'OPTIONS') {
    return response.status(204).send(null)
  }

  if (request.method === 'POST') {
    try {
      const body = request.body as ScoreSubmission
      const { game, username, score, sessionId, sessionDuration, moves } = body

      if (!game || !username || score === undefined) {
        return response.status(400).json({ error: 'Missing required fields' })
      }

      if (!ALLOWED_GAMES.includes(game)) {
        return response.status(400).json({ error: 'Invalid game' })
      }

      const cleanUsername = username.toUpperCase().replace(/[^A-Z0-9]/g, '')
      if (cleanUsername.length !== 3) {
        return response.status(400).json({ error: 'Username must be 3 characters' })
      }

      if (typeof score !== 'number' || score < 0 || score > 1000000) {
        return response.status(400).json({ error: 'Invalid score' })
      }

      if (sessionId !== undefined && sessionDuration !== undefined && moves !== undefined) {
        const limits = GAME_MINIMUMS[game]

        if (limits) {
          if (sessionDuration < limits.minDuration) {
            return response.status(400).json({ error: 'Score submission too fast - suspicious' })
          }

          if (moves < limits.minMoves) {
            return response.status(400).json({ error: 'Insufficient game activity recorded' })
          }

          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          if (!uuidRegex.test(sessionId)) {
            return response.status(400).json({ error: 'Invalid session format' })
          }
        }
      }

      const { error } = await supabase
        .from('high_scores')
        .insert({ game, username: cleanUsername, score })

      if (error) {
        console.error('Supabase error:', error)
        return response.status(500).json({ error: 'Failed to save score' })
      }

      return response.status(200).json({ success: true })
    } catch (err) {
      console.error('Handler error:', err)
      return response.status(500).json({ error: 'Internal server error' })
    }
  }

  if (request.method === 'GET') {
    const game = request.query.game as string
    const limit = Math.min(parseInt((request.query.limit as string) || '10'), 100)

    if (!game || !ALLOWED_GAMES.includes(game)) {
      return response.status(400).json({ error: 'Invalid game parameter' })
    }

    const { data, error } = await supabase
      .from('high_scores')
      .select('username, score, created_at')
      .eq('game', game)
      .order('score', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Supabase error:', error)
      return response.status(500).json({ error: 'Failed to fetch scores' })
    }

    return response.status(200).json(data || [])
  }

  return response.status(405).json({ error: 'Method not allowed' })
}
