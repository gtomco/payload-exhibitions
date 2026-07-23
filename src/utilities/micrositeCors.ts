const DEFAULT_ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  'http://localhost:8082',
  'http://localhost:8081',
  'http://127.0.0.1:8082',
  'http://127.0.0.1:8081',
]

export function micrositeCorsHeaders(origin: string | null, cacheControl?: string) {
  const allowed = new Set(DEFAULT_ALLOWED_ORIGINS)
  const headerOrigin = origin && allowed.has(origin) ? origin : 'http://localhost:8082'

  return {
    'Access-Control-Allow-Origin': headerOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Microsite',
    'Cache-Control': cacheControl || 'public, s-maxage=30, stale-while-revalidate=120',
  }
}
