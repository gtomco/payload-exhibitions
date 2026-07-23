import type { Payload } from 'payload'

import type { Page } from '@/payload-types'
import { resolveMicrositeTheme } from '@/utilities/resolveMicrositeTheme'

type NavPageRef = {
  id: string | number
  slug: string
  title?: string | null
}

type MicrositeNavItem = {
  page?: NavPageRef | null
  /** Derived from the related page for frontend consumers. */
  pageSlug: string
  labelSq: string
  labelEn: string
}

type MicrositeNavGroup = {
  key: string
  titleSq: string
  titleEn: string
  leadSq: string
  leadEn: string
  leadPage?: NavPageRef | null
  /** Derived from the related page for frontend consumers. */
  leadPageSlug: string
  items?: MicrositeNavItem[] | null
}

type MicrositeContextResult = {
  microsite: {
    id: string | number
    slug: string
    title: string
    description?: string | null
    devUrl?: string | null
    productionUrl?: string | null
    crmEventId?: string | null
    theme?: {
      primaryColor?: string | null
      secondaryColor?: string | null
      darkColor?: string | null
    }
  }
  settings: {
    label?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    address?: string | null
    heroEyebrow?: string | null
    heroTitle?: string | null
    heroSubtitle?: string | null
    footerNote?: string | null
    crmEventId?: string | null
    crmEventName?: string | null
    logoUrl?: string | null
    navigation?: MicrositeNavGroup[] | null
    theme?: ReturnType<typeof resolveMicrositeTheme>
  } | null
  events: unknown[]
  pages: unknown[]
  posts: unknown[]
}

function resolveNavPage(value: number | Page | null | undefined): NavPageRef | null {
  if (!value || typeof value !== 'object') return null
  if (!value.slug) return null
  return {
    id: value.id,
    slug: value.slug,
    title: value.title,
  }
}

function normalizeNavigation(
  navigation: unknown[] | null | undefined,
): MicrositeNavGroup[] | null {
  if (!navigation?.length) return null

  return navigation
    .map((raw) => {
      const group = raw as {
        key?: string
        titleSq?: string
        titleEn?: string
        leadSq?: string
        leadEn?: string
        leadPage?: number | Page | null
        items?: Array<{
          page?: number | Page | null
          labelSq?: string
          labelEn?: string
        }> | null
      }

      const leadPage = resolveNavPage(group.leadPage)
      if (!group.key || !leadPage) return null

      const items = (group.items || [])
        .map((item) => {
          const page = resolveNavPage(item.page)
          if (!page || !item.labelSq || !item.labelEn) return null
          return {
            page,
            pageSlug: page.slug,
            labelSq: item.labelSq,
            labelEn: item.labelEn,
          }
        })
        .filter(Boolean) as MicrositeNavItem[]

      return {
        key: group.key,
        titleSq: group.titleSq || '',
        titleEn: group.titleEn || '',
        leadSq: group.leadSq || '',
        leadEn: group.leadEn || '',
        leadPage,
        leadPageSlug: leadPage.slug,
        items,
      }
    })
    .filter(Boolean) as MicrositeNavGroup[]
}

export async function getMicrositeContext(
  payload: Payload,
  slug: string,
): Promise<MicrositeContextResult | null> {
  const micrositeResult = await payload.find({
    collection: 'microsites',
    where: {
      slug: { equals: slug },
      isActive: { equals: true },
    },
    limit: 1,
    depth: 0,
  })

  const microsite = micrositeResult.docs[0]
  if (!microsite) return null

  const micrositeId = microsite.id

  const [events, pages, posts, settingsResult] = await Promise.all([
    payload.find({
      collection: 'events',
      where: {
        and: [
          { microsite: { equals: micrositeId } },
          { _status: { equals: 'published' } },
        ],
      },
      depth: 1,
      limit: 100,
      sort: 'eventDate',
    }),
    payload.find({
      collection: 'pages',
      where: {
        and: [
          { microsite: { equals: micrositeId } },
          { _status: { equals: 'published' } },
        ],
      },
      depth: 2,
      limit: 100,
      sort: 'title',
    }),
    payload.find({
      collection: 'posts',
      where: {
        and: [
          { microsite: { equals: micrositeId } },
          { _status: { equals: 'published' } },
        ],
      },
      depth: 1,
      limit: 100,
      sort: '-publishedAt',
    }),
    payload.find({
      collection: 'microsite-settings',
      where: {
        microsite: { equals: micrositeId },
      },
      limit: 1,
      // Populate leadPage / item.page relationships for navigation.
      depth: 1,
    }),
  ])

  const settingsDoc = settingsResult.docs[0]
  const resolvedTheme = resolveMicrositeTheme(settingsDoc?.theme, {
    primaryColor: microsite.primaryColor,
    secondaryColor: microsite.secondaryColor,
    darkColor: microsite.darkColor,
  })

  const logo =
    settingsDoc?.logo && typeof settingsDoc.logo === 'object' ? settingsDoc.logo : null
  const logoUrl = logo && 'url' in logo && logo.url ? String(logo.url) : null

  return {
    microsite: {
      id: microsite.id,
      slug: microsite.slug,
      title: microsite.title,
      description: microsite.description,
      devUrl: microsite.devUrl,
      productionUrl: microsite.productionUrl,
      crmEventId: microsite.crmEventId,
      theme: {
        primaryColor: resolvedTheme.primary,
        secondaryColor: resolvedTheme.secondary,
        darkColor: resolvedTheme.dark,
      },
    },
    settings: settingsDoc
      ? {
          label: settingsDoc.label,
          contactEmail: settingsDoc.contactEmail,
          contactPhone: settingsDoc.contactPhone,
          address: settingsDoc.address,
          heroEyebrow: settingsDoc.heroEyebrow,
          heroTitle: settingsDoc.heroTitle,
          heroSubtitle: settingsDoc.heroSubtitle,
          footerNote: settingsDoc.footerNote,
          crmEventId: settingsDoc.crmEventId || microsite.crmEventId,
          crmEventName: settingsDoc.crmEventName || microsite.crmEventName,
          logoUrl,
          navigation: normalizeNavigation(settingsDoc.navigation as unknown[] | null | undefined),
          theme: resolvedTheme,
        }
      : { theme: resolvedTheme, logoUrl: null },
    events: events.docs,
    pages: pages.docs,
    posts: posts.docs,
  }
}
