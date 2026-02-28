import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

function getCorsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export default async function handler(req: Request) {
  const origin = req.headers.get('origin') || process.env.VERCEL_URL || '*'
  const corsHeaders = getCorsHeaders(origin)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return Response.json(
      { error: 'Method not allowed' },
      { status: 405, headers: corsHeaders }
    )
  }

  const { error } = await supabase.from('high_scores').select('id').limit(1)
  
  const healthy = !error

  return Response.json(
    {
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'high-scores-api',
      version: '1.0.0',
      database: healthy ? 'connected' : 'error',
      ...(error && { error: error.message })
    },
    { 
      status: healthy ? 200 : 503,
      headers: corsHeaders 
    }
  )
}
