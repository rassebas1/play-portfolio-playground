import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

const ALLOWED_GAMES = ['snake', '2048', 'flappy-bird', 'brick-breaker', 'memory-game', 'tetris']

const ALLOWED_METRICS = ['score', 'lines', 'level', 'bricks', 'highestTile']

const PROFANITY_LIST = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'bastard', 'crap', 'dick',
  'cock', 'pussy', 'cunt', 'whore', 'slut', 'fag', 'nigger', 'retard'
]

function containsProfanity(username: string): boolean {
  const normalized = username.toLowerCase()
  return PROFANITY_LIST.some(word => normalized.includes(word))
}

interface ScoreSubmission {
  game: string
  username: string
  score: number
  metric?: string
  metrics?: Record<string, number>
  sessionId?: string
  sessionDuration?: number
  moves?: number
}

const GAME_MINIMUMS: Record<string, { minDuration: number; minMoves: number }> = {
  snake: { minDuration: 5000, minMoves: 10 },
  '2048': { minDuration: 3000, minMoves: 5 },
  'flappy-bird': { minDuration: 3000, minMoves: 5 },
  'brick-breaker': { minDuration: 5000, minMoves: 10 },
  'memory-game': { minDuration: 10000, minMoves: 8 },
  tetris: { minDuration: 3000, minMoves: 5 }
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
      const { game, username, score, metric, metrics, sessionId, sessionDuration, moves } = body

      if (!game || !username || score === undefined) {
        return response.status(400).json({ error: 'Missing required fields' })
      }

      if (!ALLOWED_GAMES.includes(game)) {
        return response.status(400).json({ error: 'Invalid game' })
      }

      const cleanUsername = username.toUpperCase().replace(/[^A-Z0-9]/g, '')
      if (cleanUsername.length < 3 || cleanUsername.length > 7) {
        return response.status(400).json({ error: 'Username must be 3-7 characters' })
      }

      if (containsProfanity(username)) {
        return response.status(400).json({ error: 'Username contains inappropriate words' })
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

      // Determine which metrics to insert
      const metricsToInsert: { metric: string; score: number }[] = []

      if (metrics && typeof metrics === 'object') {
        // New format: insert one row per metric
        for (const [m, s] of Object.entries(metrics)) {
          if (typeof s !== 'number' || s < 0) {
            return response.status(400).json({ error: `Invalid score for metric: ${m}` })
          }
          if (!ALLOWED_METRICS.includes(m)) {
            return response.status(400).json({ error: `Invalid metric: ${m}` })
          }
          metricsToInsert.push({ metric: m, score: s })
        }
      } else {
        // Backward compatible: use single metric
        const finalMetric = metric || 'score'
        if (!ALLOWED_METRICS.includes(finalMetric)) {
          return response.status(400).json({ error: 'Invalid metric' })
        }
        metricsToInsert.push({ metric: finalMetric, score })
      }

      // Insert all metrics
      for (const { metric: m, score: s } of metricsToInsert) {
        const { error } = await supabase
          .from('high_scores')
          .insert({ game, username: cleanUsername, score: s, metric: m })

        if (error) {
          console.error('Supabase error:', error)
          return response.status(500).json({ error: 'Failed to save score' })
        }
      }

      return response.status(200).json({ success: true })
    } catch (err) {
      console.error('Handler error:', err)
      return response.status(500).json({ error: 'Internal server error' })
    }
  }

  if (request.method === 'GET') {
    const game = request.query.game as string
    const metric = (request.query.metric as string) || 'score'
    const limit = Math.min(parseInt((request.query.limit as string) || '10'), 100)

    if (!game || !ALLOWED_GAMES.includes(game)) {
      return response.status(400).json({ error: 'Invalid game parameter' })
    }

    if (!ALLOWED_METRICS.includes(metric)) {
      return response.status(400).json({ error: 'Invalid metric parameter' })
    }

    const { data, error } = await supabase
      .from('high_scores')
      .select('username, score, created_at')
      .eq('game', game)
      .eq('metric', metric)
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
