import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  DEFAULT_PUBLIC_LANG,
  PUBLIC_LANG_COOKIE,
  PUBLIC_LANG_HEADER,
  PUBLIC_LANG_PREFIX_HEADER,
  PUBLIC_LANGS,
  PUBLIC_MICROSITE_BASE_PATH_HEADER,
  PUBLIC_MICROSITE_HOST_HEADER,
  PUBLIC_MICROSITE_ORIGIN_HEADER,
  PUBLIC_MICROSITE_SLUG_HEADER,
  type PublicLang,
} from '@/microsite/constants'
import { hostnameFrom, slugHintFromHostname } from '@/utilities/resolveMicrositeByHost'
import { pathMicrositesEnabled, trustProxy } from '@/utilities/publicUrls'

function isPublicLang(value: string): value is PublicLang {
  return (PUBLIC_LANGS as readonly string[]).includes(value)
}

function withLangCookie(response: NextResponse, lang: PublicLang) {
  response.cookies.set(PUBLIC_LANG_COOKIE, lang, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })
  return response
}

function requestHost(request: NextRequest): string {
  if (trustProxy()) {
    return (
      request.headers.get('x-forwarded-host') ||
      request.headers.get('host') ||
      ''
    )
  }
  return request.headers.get('host') || request.headers.get('x-forwarded-host') || ''
}

/**
 * Edge middleware: attach microsite host/slug/lang headers for SSR.
 *
 * - Apex / ROOT_DOMAIN → IX main site (no slug header)
 * - {slug}.ROOT_DOMAIN → microsite
 * - /m/{slug}/... when ENABLE_PATH_MICROSITES is enabled (default locally)
 * - /en/... and /sq/... are crawlable: rewrite (keep URL), never redirect away
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdmin = pathname.startsWith('/admin')
  const isPayloadApi = pathname.startsWith('/api/') && !pathname.startsWith('/api/microsites/')

  const host = requestHost(request)
  const hostname = hostnameFrom(host)
  const proto =
    (trustProxy() && request.headers.get('x-forwarded-proto')) ||
    request.headers.get('x-forwarded-proto') ||
    (hostname.includes('localhost') || hostname.startsWith('127.') ? 'http' : 'https')
  const origin = host ? `${proto}://${host.split(',')[0].trim()}` : ''

  let lang: PublicLang = DEFAULT_PUBLIC_LANG
  const cookieLang = request.cookies.get(PUBLIC_LANG_COOKIE)?.value
  if (cookieLang && isPublicLang(cookieLang)) lang = cookieLang

  const langQuery = request.nextUrl.searchParams.get('lang')
  if (langQuery && isPublicLang(langQuery)) {
    const clean = request.nextUrl.clone()
    clean.searchParams.delete('lang')
    const prefix = langQuery === DEFAULT_PUBLIC_LANG ? '' : `/${langQuery}`
    const path = clean.pathname === '/' ? '/' : clean.pathname
    clean.pathname = prefix ? `${prefix}${path === '/' ? '' : path}` : path
    return withLangCookie(NextResponse.redirect(clean), langQuery)
  }

  let workingPath = pathname
  let pathSlug: string | null = null
  let basePath: string | null = null
  let langPrefixCode: PublicLang | null = null

  const allowPathMicrosites = pathMicrositesEnabled()
  const micrositePath = workingPath.match(/^\/m\/([a-z0-9-]+)(?=\/|$)/i)
  if (micrositePath) {
    if (!allowPathMicrosites) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    pathSlug = micrositePath[1].toLowerCase()
    basePath = `/m/${pathSlug}`
    workingPath = workingPath.slice(basePath.length) || '/'
  }

  const langPrefix = workingPath.match(/^\/(en|sq)(?=\/|$)/)
  if (langPrefix) {
    lang = langPrefix[1] as PublicLang
    langPrefixCode = lang
    workingPath = workingPath.replace(/^\/(en|sq)/, '') || '/'
  }

  const needsRewrite = workingPath !== pathname
  const rewritePath = needsRewrite ? workingPath : null

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(PUBLIC_MICROSITE_HOST_HEADER, host)
  if (origin) requestHeaders.set(PUBLIC_MICROSITE_ORIGIN_HEADER, origin)
  requestHeaders.set(PUBLIC_LANG_HEADER, lang)
  if (langPrefixCode) requestHeaders.set(PUBLIC_LANG_PREFIX_HEADER, langPrefixCode)
  if (basePath) requestHeaders.set(PUBLIC_MICROSITE_BASE_PATH_HEADER, basePath)

  const querySlug = request.nextUrl.searchParams.get('microsite')
  const slug = pathSlug || querySlug || slugHintFromHostname(hostname)

  if (slug) requestHeaders.set(PUBLIC_MICROSITE_SLUG_HEADER, slug)

  if (isAdmin || isPayloadApi) {
    return withLangCookie(NextResponse.next({ request: { headers: requestHeaders } }), lang)
  }

  const response = rewritePath
    ? NextResponse.rewrite(new URL(rewritePath + request.nextUrl.search, request.url), {
        request: { headers: requestHeaders },
      })
    : NextResponse.next({ request: { headers: requestHeaders } })

  return withLangCookie(response, lang)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
