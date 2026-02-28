import { createClient } from '@supabase/supabase-js'

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

function getCorsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export default async function handler(req: Request) {
  const origin = req.headers.get('origin') || process.env.VERCEL_URL || '*'
  const corsHeaders = getCorsHeaders(origin)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method === 'POST') {
    try {
      const body: ScoreSubmission = await req.json()
      const { game, username, score, sessionId, sessionDuration, moves } = body

      if (!game || !username || score === undefined) {
        return Response.json(
          { error: 'Missing required fields' },
          { status: 400, headers: corsHeaders }
        )
      }

      if (!ALLOWED_GAMES.includes(game)) {
        return Response.json(
          { error: 'Invalid game' },
          { status: 400, headers: corsHeaders }
        )
      }

      const cleanUsername = username.toUpperCase().replace(/[^A-Z0-9]/g, '')
      if (cleanUsername.length !== 3) {
        return Response.json(
          { error: 'Username must be 3 characters' },
          { status: 400, headers: corsHeaders }
        )
      }

      if (typeof score !== 'number' || score < 0 || score > 1000000) {
        return Response.json(
          { error: 'Invalid score' },
          { status: 400, headers: corsHeaders }
        )
      }

      if (sessionId !== undefined && sessionDuration !== undefined && moves !== undefined) {
        const limits = GAME_MINIMUMS[game]

        if (limits) {
          if (sessionDuration < limits.minDuration) {
            return Response.json(
              { error: 'Score submission too fast - suspicious' },
              { status: 400, headers: corsHeaders }
            )
          }

          if (moves < limits.minMoves) {
            return Response.json(
              { error: 'Insufficient game activity recorded' },
              { status: 400, headers: corsHeaders }
            )
          }

          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          if (!uuidRegex.test(sessionId)) {
            return Response.json(
              { error: 'Invalid session format' },
              { status: 400, headers: corsHeaders }
            )
          }
        }
      }

      const { error } = await supabase
        .from('high_scores')
        .insert({ game, username: cleanUsername, score })

      if (error) {
        console.error('Supabase error:', error)
        return Response.json(
          { error: 'Failed to save score' },
          { status: 500, headers: corsHeaders }
        )
      }

      return Response.json({ success: true }, { headers: corsHeaders })
    } catch (err) {
      console.error('Handler error:', err)
      return Response.json(
        { error: 'Internal server error' },
        { status: 500, headers: corsHeaders }
      )
    }
  }

  if (req.method === 'GET') {
    const url = new URL(req.url)
    const game = url.searchParams.get('game')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 100)

    if (!game || !ALLOWED_GAMES.includes(game)) {
      return Response.json(
        { error: 'Invalid game parameter' },
        { status: 400, headers: corsHeaders }
      )
    }

    const { data, error } = await supabase
      .from('high_scores')
      .select('username, score, created_at')
      .eq('game', game)
      .order('score', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Supabase error:', error)
      return Response.json(
        { error: 'Failed to fetch scores' },
        { status: 500, headers: corsHeaders }
      )
    }

    return Response.json(data || [], { headers: corsHeaders })
  }

  return Response.json(
    { error: 'Method not allowed' },
    { status: 405, headers: corsHeaders }
  )
}
