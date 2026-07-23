/**
 * Env-driven public URL helpers for apex (IX) + microsite subdomains.
 *
 * ROOT_DOMAIN=i-exhibitions.com
 * PUBLIC_PROTOCOL=https
 * → apex https://i-exhibitions.com
 * → microsite https://ecge.i-exhibitions.com
 *
 * When NEXT_PUBLIC_SERVER_URL includes a non-default port (e.g. :3002 / :3080),
 * that port is kept on derived origins for local Docker.
 */

function stripPort(host: string): string {
  return host.trim().toLowerCase().replace(/\.$/, '').split(':')[0] || ''
}

export function getRootDomain(): string {
  return (process.env.ROOT_DOMAIN || '').trim().toLowerCase().replace(/^\.+|\.+$/g, '')
}

export function getPublicProtocol(): 'http' | 'https' {
  const raw = (process.env.PUBLIC_PROTOCOL || '').trim().toLowerCase()
  if (raw === 'http' || raw === 'https') return raw
  try {
    const fromServer = process.env.NEXT_PUBLIC_SERVER_URL
    if (fromServer) return new URL(fromServer).protocol.replace(':', '') as 'http' | 'https'
  } catch {
    /* ignore */
  }
  if (process.env.NODE_ENV !== 'production') return 'http'
  return 'https'
}

/** Non-default port from NEXT_PUBLIC_SERVER_URL or PUBLIC_PORT, e.g. ":3002" */
export function publicPortSuffix(): string {
  if (process.env.PUBLIC_PORT) {
    const p = process.env.PUBLIC_PORT.replace(/^:/, '')
    if (p && p !== '80' && p !== '443') return `:${p}`
    return ''
  }
  try {
    const u = new URL(process.env.NEXT_PUBLIC_SERVER_URL || '')
    if (u.port && u.port !== '80' && u.port !== '443') return `:${u.port}`
  } catch {
    /* ignore */
  }
  return ''
}

export function apexOrigin(): string {
  const root = getRootDomain()
  if (root) return `${getPublicProtocol()}://${root}${publicPortSuffix()}`
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://localhost' : 'http://localhost:3000')
  ).replace(/\/$/, '')
}

export function micrositeOrigin(slug: string): string {
  const clean = slug.trim().toLowerCase()
  const root = getRootDomain()
  if (root && clean) {
    return `${getPublicProtocol()}://${clean}.${root}${publicPortSuffix()}`
  }
  if (process.env.ENABLE_PATH_MICROSITES !== 'false') {
    const base = process.env.NEXT_PUBLIC_SERVER_URL || apexOrigin()
    return `${base.replace(/\/$/, '')}/m/${clean}`
  }
  return apexOrigin()
}

export function isApexHost(hostHeader: string | null | undefined): boolean {
  const host = stripPort(hostHeader || '')
  const root = getRootDomain()
  if (!host) return false
  if (!root) {
    return host === 'localhost' || host === '127.0.0.1'
  }
  return host === root || host === `www.${root}`
}

/** First label of `{slug}.{ROOT_DOMAIN}` (ignores www). */
export function subdomainSlugFromHost(hostHeader: string | null | undefined): string | null {
  const host = stripPort(hostHeader || '')
  const root = getRootDomain()
  if (!host || !root) return null
  if (host === root || host === `www.${root}`) return null
  if (!host.endsWith(`.${root}`)) return null

  const sub = host.slice(0, -(root.length + 1))
  const labels = sub.split('.')
  if (labels.length !== 1) return null
  const slug = labels[0]
  if (!slug || ['www', 'cms', 'admin', 'api', 'www2', 'app', 'mail'].includes(slug)) return null
  return slug
}

export function pathMicrositesEnabled(): boolean {
  if (process.env.ENABLE_PATH_MICROSITES === 'false') return false
  if (process.env.ENABLE_PATH_MICROSITES === 'true') return true
  return process.env.NODE_ENV !== 'production'
}

export function trustProxy(): boolean {
  return process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1'
}
