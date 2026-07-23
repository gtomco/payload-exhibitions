import type { Payload } from 'payload'

import type { Microsite } from '@/payload-types'
import { resolveMicrositeBySlug } from '@/utilities/resolveMicrositeBySlug'
import {
  getRootDomain,
  isApexHost,
  micrositeOrigin,
  subdomainSlugFromHost,
} from '@/utilities/publicUrls'

function normalizeHost(value: string | null | undefined): string {
  if (!value) return ''
  return value.trim().toLowerCase().replace(/\.$/, '')
}

/** Extract hostname (no port) from a Host header or absolute URL. */
export function hostnameFrom(value: string | null | undefined): string {
  const raw = normalizeHost(value)
  if (!raw) return ''
  try {
    if (raw.includes('://')) return new URL(raw).hostname.toLowerCase()
    return raw.split('/')[0]?.split(':')[0] || ''
  } catch {
    return raw.split('/')[0]?.split(':')[0] || ''
  }
}

export function hostMatchesUrl(hostHeader: string, url: string | null | undefined): boolean {
  if (!url) return false
  const requestHost = hostnameFrom(hostHeader)
  const urlHost = hostnameFrom(url)
  return Boolean(requestHost && urlHost && requestHost === urlHost)
}

/**
 * Guess microsite slug from subdomain.
 * Prefers ROOT_DOMAIN (`ecge.i-exhibitions.com` → `ecge`); otherwise any 3+ label host.
 */
export function slugHintFromHostname(hostname: string): string | null {
  const host = hostnameFrom(hostname)
  if (!host || host === 'localhost' || host === '127.0.0.1') return null
  if (isApexHost(host)) return null

  const fromRoot = subdomainSlugFromHost(host)
  if (fromRoot) return fromRoot

  // Fallback when ROOT_DOMAIN is unset: a.b.com → a
  const parts = host.split('.')
  if (parts.length < 3) return null
  const sub = parts[0]
  if (!sub || ['www', 'cms', 'admin', 'api', 'www2', 'app', 'mail'].includes(sub)) return null
  return sub
}

export function publicOriginForMicrosite(
  microsite: Pick<Microsite, 'slug' | 'devUrl' | 'productionUrl'>,
  requestHost?: string | null,
): string {
  const isProd = process.env.NODE_ENV === 'production'
  const preferred =
    (isProd ? microsite.productionUrl : microsite.devUrl) ||
    microsite.productionUrl ||
    microsite.devUrl

  if (preferred) {
    try {
      return new URL(preferred).origin
    } catch {
      /* fall through */
    }
  }

  if (microsite.slug && getRootDomain()) {
    return micrositeOrigin(microsite.slug)
  }

  if (requestHost) {
    const host = normalizeHost(requestHost)
    const useHttp =
      host.startsWith('localhost') ||
      host.startsWith('127.0.0.1') ||
      host.endsWith('.local') ||
      process.env.NODE_ENV !== 'production'
    return `${useHttp ? 'http' : 'https'}://${host.split('/')[0]}`
  }

  if (microsite.slug) return micrositeOrigin(microsite.slug)

  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}

export type ResolvedPublicMicrosite = {
  microsite: Microsite
  origin: string
  source: 'slug-hint' | 'url-match'
}

/**
 * Resolve the active public microsite from Host / slug hint.
 * Apex (ROOT_DOMAIN / www) never resolves to a microsite.
 */
export async function resolveMicrositeByHost(
  payload: Payload,
  options: {
    host?: string | null
    slugHint?: string | null
  },
): Promise<ResolvedPublicMicrosite | null> {
  const host = options.host || ''
  const requestHost = hostnameFrom(host)
  const slugHint = options.slugHint?.trim() || null

  // Apex with no explicit slug → IX main site. Path `/m/{slug}` still sets slugHint.
  if (requestHost && isApexHost(requestHost) && !slugHint) {
    return null
  }

  if (slugHint) {
    const bySlug = await resolveMicrositeBySlug(payload, slugHint)
    if (bySlug) {
      return {
        microsite: bySlug as Microsite,
        origin: publicOriginForMicrosite(bySlug as Microsite, host),
        source: 'slug-hint',
      }
    }
  }

  if (host) {
    const isLocalHost =
      requestHost === 'localhost' ||
      requestHost === '127.0.0.1' ||
      requestHost.endsWith('.local')

    if (!isLocalHost) {
      const result = await payload.find({
        collection: 'microsites',
        where: { isActive: { equals: true } },
        limit: 100,
        depth: 0,
      })

      for (const doc of result.docs) {
        const derived =
          doc.slug && getRootDomain() ? micrositeOrigin(doc.slug) : null
        if (
          hostMatchesUrl(host, doc.productionUrl) ||
          hostMatchesUrl(host, doc.devUrl) ||
          (derived && hostMatchesUrl(host, derived))
        ) {
          return {
            microsite: doc as Microsite,
            origin: publicOriginForMicrosite(doc as Microsite, host),
            source: 'url-match',
          }
        }
      }
    }

    const fromSub = slugHintFromHostname(host)
    if (fromSub) {
      const bySub = await resolveMicrositeBySlug(payload, fromSub)
      if (bySub) {
        return {
          microsite: bySub as Microsite,
          origin: publicOriginForMicrosite(bySub as Microsite, host),
          source: 'slug-hint',
        }
      }
    }
  }

  return null
}
