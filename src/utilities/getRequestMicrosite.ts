import configPromise from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import {
  DEFAULT_PUBLIC_LANG,
  PUBLIC_LANG_COOKIE,
  PUBLIC_LANG_HEADER,
  PUBLIC_LANGS,
  PUBLIC_MICROSITE_BASE_PATH_HEADER,
  PUBLIC_MICROSITE_HOST_HEADER,
  PUBLIC_MICROSITE_ORIGIN_HEADER,
  PUBLIC_MICROSITE_SLUG_HEADER,
  type PublicLang,
} from '@/microsite/constants'
import {
  resolveMicrositeByHost,
  type ResolvedPublicMicrosite,
} from '@/utilities/resolveMicrositeByHost'
import { getMicrositeContext } from '@/utilities/getMicrositeContext'

function parseLang(value: string | null | undefined): PublicLang | null {
  if (!value) return null
  const normalized = value.trim().toLowerCase()
  return (PUBLIC_LANGS as readonly string[]).includes(normalized)
    ? (normalized as PublicLang)
    : null
}

export const getRequestMicrosite = cache(async (): Promise<ResolvedPublicMicrosite | null> => {
  const headerStore = await nextHeaders()
  const slugHint = headerStore.get(PUBLIC_MICROSITE_SLUG_HEADER)
  const host =
    headerStore.get(PUBLIC_MICROSITE_HOST_HEADER) ||
    headerStore.get('x-forwarded-host') ||
    headerStore.get('host')

  const payload = await getPayload({ config: configPromise })
  return resolveMicrositeByHost(payload, { host, slugHint })
})

export const getRequestMicrositeContext = cache(async () => {
  const resolved = await getRequestMicrosite()
  if (!resolved) return null

  const payload = await getPayload({ config: configPromise })
  const context = await getMicrositeContext(payload, resolved.microsite.slug)
  if (!context) return null

  return {
    ...context,
    origin: resolved.origin,
    source: resolved.source,
  }
})

export async function getRequestPublicOrigin(): Promise<string> {
  const headerStore = await nextHeaders()
  const fromHeader = headerStore.get(PUBLIC_MICROSITE_ORIGIN_HEADER)
  if (fromHeader) return fromHeader.replace(/\/$/, '')

  const resolved = await getRequestMicrosite()
  if (resolved?.origin) return resolved.origin.replace(/\/$/, '')

  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  )
}

export async function getRequestLang(): Promise<PublicLang> {
  const headerStore = await nextHeaders()
  const fromHeader = parseLang(headerStore.get(PUBLIC_LANG_HEADER))
  if (fromHeader) return fromHeader

  const cookieHeader = headerStore.get('cookie')
  if (cookieHeader) {
    const match = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${PUBLIC_LANG_COOKIE}=`))
    if (match) {
      const value = decodeURIComponent(match.slice(PUBLIC_LANG_COOKIE.length + 1))
      const fromCookie = parseLang(value)
      if (fromCookie) return fromCookie
    }
  }

  return DEFAULT_PUBLIC_LANG
}

/** e.g. `/m/ecge` when testing via path; empty string on real subdomain hosts. */
export async function getRequestMicrositeBasePath(): Promise<string> {
  const headerStore = await nextHeaders()
  const value = headerStore.get(PUBLIC_MICROSITE_BASE_PATH_HEADER)?.trim()
  if (!value || value === '/') return ''
  return value.replace(/\/$/, '')
}

/** Prefix an app path with the local microsite base path when present. */
export async function micrositeHref(path: string): Promise<string> {
  const base = await getRequestMicrositeBasePath()
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (!base) return normalized
  if (normalized === '/') return base
  return `${base}${normalized}`
}
