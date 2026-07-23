import type { Payload } from 'payload'

import { ECGE_DEFAULT_THEME } from '@/fields/micrositeTheme'
import { fetchCrmEvents } from '@/utilities/crmClient'

import { contentBlock, lexicalParagraph } from './ecgeLexical'
import { buildFaqPageLayout, buildPricesPageLayout } from './ecgeRichPages'

const RICH_PAGE_LAYOUTS: Record<string, ReturnType<typeof buildPricesPageLayout>> = {
  prices: buildPricesPageLayout(),
  faq: buildFaqPageLayout(),
}

const ECGE_PAGE_DEFINITIONS: Array<{ slug: string; title: string; intro: string }> = [
  {
    slug: 'about',
    title: 'About ECGE',
    intro: 'Overview of the Energy, Construction and Green Economy Fair.',
  },
  {
    slug: 'about-synopsis',
    title: 'ECGE Reports',
    intro: 'Synopsis reports and fair retrospectives.',
  },
  {
    slug: 'about-contacts',
    title: 'ECGE Contacts',
    intro: 'Organiser and department contacts for ECGE.',
  },
  {
    slug: 'categories',
    title: 'Exhibition Areas',
    intro: 'Sector zones and exhibition categories at ECGE.',
  },
  {
    slug: 'exhibitor',
    title: 'Stand Registration',
    intro: 'Register as an exhibitor and choose your booth package.',
  },
  {
    slug: 'partners',
    title: 'Partners & Sponsors',
    intro: 'Partnership opportunities and sponsor visibility packages.',
  },
  { slug: 'faq', title: 'FAQ', intro: 'Frequently asked questions for visitors and exhibitors.' },
    {
      slug: 'visitor',
      title: 'Visitor Registration',
      intro:
        'Register below to receive your visitor ticket by email. Bring the QR code (or attached PDF) to the entrance.',
    },
  { slug: 'gallery', title: 'Gallery', intro: 'Photo gallery from previous ECGE editions.' },
  { slug: 'media', title: 'Media', intro: 'Press resources, logos and media assets.' },
  {
    slug: 'contact',
    title: 'Contact',
    intro: 'Contact the ECGE team for visitors, exhibitors and media.',
  },
  { slug: 'legal', title: 'Legal Notice', intro: 'Legal information for the ECGE website.' },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    intro: 'How ECGE handles visitor and exhibitor data.',
  },
  {
    slug: 'prices',
    title: 'Prices',
    intro: 'Exhibition space and partnership package pricing.',
  },
  {
    slug: 'program',
    title: 'Agenda',
    intro: 'Conference and fair agenda for ECGE.',
  },
  {
    slug: 'news',
    title: 'News',
    intro: 'Latest news and announcements from ECGE.',
  },
  {
    slug: 'energy',
    title: 'Energy',
    intro: 'Energy transition, renewables and efficiency at ECGE.',
  },
  {
    slug: 'construction',
    title: 'Construction',
    intro: 'Modern construction, materials and infrastructure.',
  },
  {
    slug: 'green-economy',
    title: 'Green Economy',
    intro: 'Circular economy, sustainability and green finance.',
  },
]

const ECGE_NAVIGATION = [
  {
    key: 'about',
    titleSq: 'RRETH ECGE',
    titleEn: 'ABOUT ECGE',
    leadSq: 'Rreth ECGE',
    leadEn: 'About ECGE',
    leadPageSlug: 'about',
    items: [
      { pageSlug: 'about', labelSq: 'Rreth panairit', labelEn: 'About the Fair' },
      { pageSlug: 'about-synopsis', labelSq: 'Raporte', labelEn: 'Reports' },
      { pageSlug: 'about-contacts', labelSq: 'Kontakte', labelEn: 'Contacts' },
    ],
  },
  {
    key: 'exhibit',
    titleSq: 'EKSPOZO',
    titleEn: 'EXHIBIT',
    leadSq: 'Ekspozo',
    leadEn: 'Exhibit',
    leadPageSlug: 'exhibitor',
    items: [
      { pageSlug: 'categories', labelSq: 'Zonat e ekspozimit', labelEn: 'Exhibition Areas' },
      { pageSlug: 'exhibitor', labelSq: 'Regjistrimi i stendes', labelEn: 'Stand Registration' },
      { pageSlug: 'partners', labelSq: 'Partnere & Sponsore', labelEn: 'Partners & Sponsors' },
      { pageSlug: 'faq', labelSq: 'Pyetje te shpeshta', labelEn: 'FAQ' },
    ],
  },
  {
    key: 'visit',
    titleSq: 'VIZITO',
    titleEn: 'VISIT',
    leadSq: 'Vizito',
    leadEn: 'Visit',
    leadPageSlug: 'visitor',
    items: [
      { pageSlug: 'visitor', labelSq: 'Merr bileten', labelEn: 'Get Your Ticket' },
      { pageSlug: 'program', labelSq: 'Axhenda', labelEn: 'Agenda' },
      { pageSlug: 'categories', labelSq: 'Zonat e ekspozimit', labelEn: 'Exhibition Areas' },
    ],
  },
  {
    key: 'fair360',
    titleSq: 'FAIR 360°',
    titleEn: 'FAIR 360°',
    leadSq: 'Fair 360°',
    leadEn: 'Fair 360°',
    leadPageSlug: 'news',
    items: [
      { pageSlug: 'news', labelSq: 'Lajme', labelEn: 'News' },
      { pageSlug: 'gallery', labelSq: 'Galeri', labelEn: 'Gallery' },
      { pageSlug: 'media', labelSq: 'Media', labelEn: 'Media' },
    ],
  },
] as const

async function resolveDefaultCrmEvent(): Promise<{ crmEventId?: string; crmEventName?: string }> {
  try {
    const result = await fetchCrmEvents({ search: 'Energy', includeClosed: true, limit: 20 })
    const match =
      result.events.find((event) => /energy/i.test(event.name) && /2026/i.test(event.name)) ||
      result.events.find((event) => /energy/i.test(event.name)) ||
      result.events[0]

    if (!match) return {}

    return {
      crmEventId: match.id,
      crmEventName: match.name,
    }
  } catch {
    return {}
  }
}

export async function seedEcgeMicrosite(payload: Payload): Promise<void> {
  payload.logger.info('— Seeding ECGE microsite pages and navigation...')

  let microsite = (
    await payload.find({
      collection: 'microsites',
      where: { slug: { equals: 'ecge' } },
      limit: 1,
    })
  ).docs[0]

  if (!microsite) {
    microsite = await payload.create({
      collection: 'microsites',
      data: {
        title: 'ECGE 2026',
        slug: 'ecge',
        description: 'Energy, Construction and Green Economy Fair',
        isActive: true,
        devUrl: 'http://ecge.localhost:3000',
        productionUrl: 'https://ecge.i-exhibitions.com',
        primaryColor: '#1B8C66',
        secondaryColor: '#F15A27',
        darkColor: '#161F5E',
      },
    })
  } else {
    microsite = await payload.update({
      collection: 'microsites',
      id: microsite.id,
      data: {
        devUrl: microsite.devUrl || 'http://ecge.localhost:3000',
        productionUrl: microsite.productionUrl || 'https://ecge.i-exhibitions.com',
      },
    })
  }

  const micrositeId = microsite.id

  async function upsertPage(
    slug: string,
    title: string,
    intro: string,
    layout = [contentBlock([{ size: 'full', richText: lexicalParagraph(intro) }])],
  ) {
    const existing = await payload.find({
      collection: 'pages',
      where: {
        and: [
          { slug: { equals: slug } },
          { microsite: { equals: micrositeId } },
        ],
      },
      limit: 1,
    })

    const pageData = {
      title,
      slug,
      microsite: micrositeId,
      _status: 'published' as const,
      hero: {
        type: 'lowImpact' as const,
        richText: lexicalParagraph(title),
      },
      layout,
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        context: { disableRevalidate: true },
        data: pageData,
      })
      payload.logger.info(`  · updated page "${slug}"`)
      return existing.docs[0].id
    }

    const created = await payload.create({
      collection: 'pages',
      context: { disableRevalidate: true },
      data: pageData,
    })
    payload.logger.info(`  · created page "${slug}"`)
    return created.id
  }

  const pageIdsBySlug = new Map<string, string | number>()

  for (const pageDef of ECGE_PAGE_DEFINITIONS) {
    const richLayout = RICH_PAGE_LAYOUTS[pageDef.slug]
    if (richLayout) {
      const id = await upsertPage(pageDef.slug, pageDef.title, pageDef.intro, richLayout)
      pageIdsBySlug.set(pageDef.slug, id)
      continue
    }

    const existing = await payload.find({
      collection: 'pages',
      where: {
        and: [
          { slug: { equals: pageDef.slug } },
          { microsite: { equals: micrositeId } },
        ],
      },
      limit: 1,
    })

    if (existing.docs[0]) {
      pageIdsBySlug.set(pageDef.slug, existing.docs[0].id)
      payload.logger.info(`  · page "${pageDef.slug}" already exists — skipping`)
      continue
    }

    const id = await upsertPage(pageDef.slug, pageDef.title, pageDef.intro)
    pageIdsBySlug.set(pageDef.slug, id)
  }

  async function requirePageId(slug: string): Promise<string | number> {
    const cached = pageIdsBySlug.get(slug)
    if (cached) return cached

    const existing = await payload.find({
      collection: 'pages',
      where: {
        and: [
          { slug: { equals: slug } },
          { microsite: { equals: micrositeId } },
        ],
      },
      limit: 1,
    })

    if (!existing.docs[0]) {
      throw new Error(`ECGE seed: missing page "${slug}" required by navigation`)
    }

    pageIdsBySlug.set(slug, existing.docs[0].id)
    return existing.docs[0].id
  }

  const navigation = []
  for (const group of ECGE_NAVIGATION) {
    const items = []
    for (const item of group.items) {
      items.push({
        page: await requirePageId(item.pageSlug),
        labelSq: item.labelSq,
        labelEn: item.labelEn,
      })
    }
    navigation.push({
      key: group.key,
      titleSq: group.titleSq,
      titleEn: group.titleEn,
      leadSq: group.leadSq,
      leadEn: group.leadEn,
      leadPage: await requirePageId(group.leadPageSlug),
      items,
    })
  }

  const settingsResult = await payload.find({
    collection: 'microsite-settings',
    where: { microsite: { equals: micrositeId } },
    limit: 1,
  })

  const settingsData = {
    label: 'ECGE 2026 site settings',
    microsite: micrositeId,
    contactEmail: 'info@icebergexhibitions.com',
    contactPhone: '+355 69 40 63 909',
    address: 'Palace of Congresses, Tirana, Albania',
    heroEyebrow: 'ECGE 2026',
    heroTitle: 'Energy, Construction & Green Economy Fair',
    heroSubtitle: '29–30 October 2026 · Palace of Congresses, Tirana',
    footerNote: 'Energy, Construction and Green Economy Fair.',
    checkInPin: '2468',
    theme: { ...ECGE_DEFAULT_THEME },
    navigation,
    ...(await resolveDefaultCrmEvent()),
  }

  if (settingsResult.docs[0]) {
    await payload.update({
      collection: 'microsite-settings',
      id: settingsResult.docs[0].id,
      data: settingsData as never,
    })
    payload.logger.info('  · updated microsite settings + navigation')
  } else {
    await payload.create({
      collection: 'microsite-settings',
      data: settingsData as never,
    })
    payload.logger.info('  · created microsite settings + navigation')
  }

  payload.logger.info('ECGE microsite seed complete.')
}
