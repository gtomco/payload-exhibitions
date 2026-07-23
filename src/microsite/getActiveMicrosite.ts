import type { PayloadRequest, Where } from 'payload'

import {
  ACTIVE_MICROSITE_CONTEXT_KEY,
  ACTIVE_MICROSITE_COOKIE,
  ACTIVE_MICROSITE_HEADER,
  DEFAULT_MICROSITE_SLUG,
} from './constants'

export type ActiveMicrositeSource = 'context' | 'header' | 'cookie' | 'default' | 'none'

export type ActiveMicrosite = {
  id: string | number
  source: ActiveMicrositeSource
}

function parseCookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined
  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
  if (!match) return undefined
  const value = match.slice(name.length + 1)
  return value ? decodeURIComponent(value) : undefined
}

export function readActiveMicrositeIdFromRequest(req: PayloadRequest): string | number | undefined {
  const fromContext = req.context?.[ACTIVE_MICROSITE_CONTEXT_KEY]
  if (fromContext !== undefined && fromContext !== null && fromContext !== '') {
    return fromContext as string | number
  }

  const fromHeader = req.headers.get(ACTIVE_MICROSITE_HEADER)
  if (fromHeader) return fromHeader

  const fromCookie = parseCookieValue(req.headers.get('cookie'), ACTIVE_MICROSITE_COOKIE)
  if (fromCookie) return fromCookie

  return undefined
}

export async function resolveActiveMicrosite(req: PayloadRequest): Promise<ActiveMicrosite | null> {
  const direct = readActiveMicrositeIdFromRequest(req)
  if (direct) {
    const source: ActiveMicrositeSource =
      req.context?.[ACTIVE_MICROSITE_CONTEXT_KEY] !== undefined
        ? 'context'
        : req.headers.get(ACTIVE_MICROSITE_HEADER)
          ? 'header'
          : 'cookie'
    return { id: direct, source }
  }

  if (process.env.NODE_ENV === 'production') return null

  const fallback = await req.payload.find({
    collection: 'microsites',
    where: {
      slug: { equals: DEFAULT_MICROSITE_SLUG },
      isActive: { equals: true },
    },
    limit: 1,
    depth: 0,
    req,
  })

  const id = fallback.docs[0]?.id
  return id ? { id, source: 'default' } : null
}

export async function getActiveMicrositeId(req: PayloadRequest): Promise<string | number | undefined> {
  const active = await resolveActiveMicrosite(req)
  return active?.id
}

export function micrositeWhere(micrositeId: string | number): Where {
  return { microsite: { equals: micrositeId } }
}
