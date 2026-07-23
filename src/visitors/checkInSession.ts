import { createHmac, timingSafeEqual } from 'crypto'

import { VISITOR_CHECKIN_TTL_SECONDS } from './constants'

type CheckInSessionPayload = {
  micrositeId: string
  exp: number
}

function secret(): string {
  return process.env.PAYLOAD_SECRET || 'dev-secret'
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function createCheckInToken(micrositeId: string | number): string {
  const body: CheckInSessionPayload = {
    micrositeId: String(micrositeId),
    exp: Math.floor(Date.now() / 1000) + VISITOR_CHECKIN_TTL_SECONDS,
  }
  const encoded = Buffer.from(JSON.stringify(body)).toString('base64url')
  return `${encoded}.${sign(encoded)}`
}

export function verifyCheckInToken(token: string | undefined | null): CheckInSessionPayload | null {
  if (!token) return null
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null

  const expected = sign(encoded)
  try {
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }

  try {
    const body = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as CheckInSessionPayload
    if (!body?.micrositeId || typeof body.exp !== 'number') return null
    if (body.exp < Math.floor(Date.now() / 1000)) return null
    return body
  } catch {
    return null
  }
}

export function parseCheckInCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('visitor-checkin='))
  if (!match) return null
  return decodeURIComponent(match.slice('visitor-checkin='.length))
}
