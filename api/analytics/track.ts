import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

const ALLOWED_EVENTS = ['page_view', 'game_start', 'game_end', 'cv_download']

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

interface AnalyticsEvent {
  event: 'page_view' | 'game_start' | 'game_end' | 'cv_download'
  sessionId?: string
  game?: string
  metadata?: Record<string, unknown>
}

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const origin = request.headers.origin || process.env.VERCEL_URL || '*'
  response.setHeader('Access-Control-Allow-Origin', origin)
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
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

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = request.body as AnalyticsEvent
    const { event, sessionId, game, metadata } = body

    // Validación de evento
    if (!event || !ALLOWED_EVENTS.includes(event)) {
      return response.status(400).json({ error: 'Invalid event' })
    }

    // Validación de sessionId si se provee
    if (sessionId && !isValidUUID(sessionId)) {
      return response.status(400).json({ error: 'Invalid sessionId format' })
    }

    // Validación de game si se provee
    if (game && !ALLOWED_GAMES.includes(game)) {
      return response.status(400).json({ error: 'Invalid game' })
    }

    // Insertar evento
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert({
        event,
        session_id: sessionId || null,
        game: game || null,
        metadata: metadata || {}
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return response.status(500).json({ error: 'Failed to track event' })
    }

    return response.status(200).json({ success: true })
  } catch (err) {
    console.error('Handler error:', err)
    return response.status(500).json({ error: 'Internal server error' })
  }
}