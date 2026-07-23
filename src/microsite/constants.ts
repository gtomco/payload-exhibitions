/** Cookie set by the admin microsite switcher (and Playwright tests). */
export const ACTIVE_MICROSITE_COOKIE = 'payload-active-microsite'

/** Optional request header for API/tests when cookies are awkward. */
export const ACTIVE_MICROSITE_HEADER = 'x-active-microsite'

/** Key on `req.context` populated by hooks. */
export const ACTIVE_MICROSITE_CONTEXT_KEY = 'activeMicrositeId'

/** Slug used when no microsite is selected yet (first visit). */
export const DEFAULT_MICROSITE_SLUG = 'ecge'

/** Public SSR: microsite slug resolved from Host / subdomain (set by middleware). */
export const PUBLIC_MICROSITE_SLUG_HEADER = 'x-microsite-slug'

/** Public SSR: original Host header (host:port). */
export const PUBLIC_MICROSITE_HOST_HEADER = 'x-microsite-host'

/** Public SSR: absolute origin for canonicals (e.g. https://ecge.example.com). */
export const PUBLIC_MICROSITE_ORIGIN_HEADER = 'x-microsite-origin'

/** Public SSR: path prefix for local multi-tenant testing, e.g. /m/ecge */
export const PUBLIC_MICROSITE_BASE_PATH_HEADER = 'x-microsite-base-path'

/** Public SSR: language from /en|/sq prefix rewrite. */
export const PUBLIC_LANG_HEADER = 'x-microsite-lang'

/** When the request URL included /en or /sq, the prefix code (for canonical/hreflang). */
export const PUBLIC_LANG_PREFIX_HEADER = 'x-microsite-lang-prefix'

/** Cookie for visitor language preference. */
export const PUBLIC_LANG_COOKIE = 'microsite-lang'

export const PUBLIC_LANGS = ['sq', 'en'] as const
export type PublicLang = (typeof PUBLIC_LANGS)[number]
export const DEFAULT_PUBLIC_LANG: PublicLang = 'sq'
