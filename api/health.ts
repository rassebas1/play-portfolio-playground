import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

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

  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const { error } = await supabase.from('high_scores').select('id').limit(1)
  
  const healthy = !error

  return response.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    service: 'high-scores-api',
    version: '1.0.0',
    database: healthy ? 'connected' : 'error',
    ...(error && { error: error.message })
  })
}
