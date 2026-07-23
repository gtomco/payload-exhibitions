import type { Metadata } from 'next'
import React from 'react'

import { EcgeHomePage } from '@/microsite/EcgeHomePage'
import { IxHomePage } from '@/main-site/IxHomePage'
import { getMainSiteContent } from '@/main-site/getMainSiteContent'
import { breadcrumbJsonLd, jsonLdScript, organizationJsonLd, webPageJsonLd } from '@/utilities/jsonLd'
import { generateMicrositeMeta } from '@/utilities/generateMicrositeMeta'
import {
  getRequestLang,
  getRequestMicrositeBasePath,
  getRequestMicrositeContext,
  getRequestPublicOrigin,
} from '@/utilities/getRequestMicrosite'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const context = await getRequestMicrositeContext()
  const lang = await getRequestLang()
  const origin = await getRequestPublicOrigin()
  const basePath = await getRequestMicrositeBasePath()

  if (!context) {
    const content = await getMainSiteContent(lang)
    const org = organizationJsonLd({
      name: 'IX Exhibitions',
      url: origin,
      description: content.heroBody,
      email: content.contactEmail,
      telephone: content.contactPhone,
      address: content.address,
    })
    const page = webPageJsonLd({
      name: 'IX Exhibitions',
      url: origin,
      description: content.heroBody,
      inLanguage: lang,
    })
    const crumbs = breadcrumbJsonLd({
      items: [{ name: 'IX Exhibitions', url: origin }],
    })
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [org, page, crumbs].map(({ ['@context']: _c, ...rest }) => rest),
    }

    return (
      <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
        <IxHomePage lang={lang} content={content} />
      </div>
    )
  }

  const settings = context.settings
  const brand = context.microsite.title
  const title =
    settings?.heroTitle ||
    (lang === 'sq'
      ? 'Panairi i Energjisë, Ndërtimit dhe Ekonomisë së Gjelbër'
      : 'Energy, Construction & Green Economy Fair')
  const subtitle = settings?.heroSubtitle || context.microsite.description

  const posts = (context.posts || []).slice(0, 3) as Array<{
    id: string | number
    title?: string
    slug?: string
    publishedAt?: string
    createdAt?: string
    meta?: { description?: string | null }
  }>

  const jsonLd = [
    organizationJsonLd({
      name: brand,
      url: origin,
      description: context.microsite.description,
      email: settings?.contactEmail,
      telephone: settings?.contactPhone,
      address: settings?.address,
    }),
    webPageJsonLd({
      name: title,
      url: origin,
      description: subtitle,
      inLanguage: lang,
    }),
    breadcrumbJsonLd({
      items: [{ name: brand, url: origin }],
    }),
  ]

  return (
    <div className="ecge-home">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
      <EcgeHomePage
        lang={lang}
        basePath={basePath}
        brand={brand}
        heroEyebrow={settings?.heroEyebrow}
        heroTitle={settings?.heroTitle}
        heroSubtitle={settings?.heroSubtitle}
        posts={posts}
      />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const context = await getRequestMicrositeContext()
  if (!context) {
    return generateMicrositeMeta({
      title: 'IX Exhibitions',
      description:
        'We build platforms — recurring meeting points where entire industries come together to open markets, spark collaboration and grow.',
      path: '/',
      siteName: 'IX Exhibitions',
    })
  }

  return generateMicrositeMeta({
    title: context.settings?.heroTitle || context.microsite.title,
    description: context.settings?.heroSubtitle || context.microsite.description,
    path: '/',
    siteName: context.microsite.title,
  })
}
