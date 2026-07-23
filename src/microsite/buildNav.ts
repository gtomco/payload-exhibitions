import type { PublicLang } from '@/microsite/constants'
import type { MicrositeNavLink } from '@/microsite/MicrositeHeader'

type NavGroup = {
  key: string
  titleSq: string
  titleEn: string
  leadSq: string
  leadEn: string
  leadPageSlug: string
  items?: Array<{
    pageSlug: string
    labelSq: string
    labelEn: string
  }> | null
}

function withBase(basePath: string, path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (!basePath) return normalized
  if (normalized === '/') return basePath
  return `${basePath}${normalized}`
}

export function buildMicrositeNav(
  lang: PublicLang,
  navigation?: NavGroup[] | null,
  basePath = '',
): MicrositeNavLink[] {
  if (!navigation?.length) return []

  return navigation.map((group) => ({
    key: group.key,
    title: lang === 'sq' ? group.titleSq : group.titleEn,
    lead: lang === 'sq' ? group.leadSq : group.leadEn,
    leadHref: withBase(basePath, `/${group.leadPageSlug}`),
    items: (group.items || []).map((item) => ({
      href: withBase(basePath, `/${item.pageSlug}`),
      label: lang === 'sq' ? item.labelSq : item.labelEn,
    })),
  }))
}
