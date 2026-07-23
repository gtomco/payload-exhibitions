import type { Metadata } from 'next'
import React from 'react'

import { FloorMapIsland } from '@/microsite/FloorMapIsland'
import { CalendarIsland } from '@/microsite/CalendarIsland'
import { generateMicrositeMeta } from '@/utilities/generateMicrositeMeta'
import {
  getRequestLang,
  getRequestMicrositeContext,
  getRequestPublicOrigin,
} from '@/utilities/getRequestMicrosite'
import { breadcrumbJsonLd, jsonLdScript, webPageJsonLd } from '@/utilities/jsonLd'

export const dynamic = 'force-dynamic'

export default async function FloorPage() {
  const lang = await getRequestLang()
  const origin = await getRequestPublicOrigin()
  const context = await getRequestMicrositeContext()
  const siteName = context?.microsite.title || 'Exhibition'
  const slug = context?.microsite.slug || 'ecge'

  const jsonLd = [
    webPageJsonLd({
      name: lang === 'sq' ? 'Plani i sallës' : 'Floor plan',
      url: `${origin}/floor`,
      inLanguage: lang,
    }),
    breadcrumbJsonLd({
      items: [
        { name: siteName, url: origin },
        { name: lang === 'sq' ? 'Plani i sallës' : 'Floor plan', url: `${origin}/floor` },
      ],
    }),
  ]

  return (
    <div className="container py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">{lang === 'sq' ? 'Plani i sallës' : 'Floor plan'}</h1>
          <p className="mt-3 text-muted-foreground">
            {lang === 'sq'
              ? 'Shiko zonat dhe stendat e ekspozimit.'
              : 'Browse exhibition areas and booths.'}
          </p>
        </div>
        <CalendarIsland
          title={siteName}
          subtitle={context?.settings?.heroSubtitle || context?.microsite.description || undefined}
          startIso="2026-10-29T09:00:00+02:00"
          endIso="2026-10-30T18:00:00+02:00"
          location={context?.settings?.address || undefined}
        />
      </div>
      <FloorMapIsland micrositeSlug={slug} />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const context = await getRequestMicrositeContext()
  const lang = await getRequestLang()
  return generateMicrositeMeta({
    title: lang === 'sq' ? 'Plani i sallës' : 'Floor plan',
    path: '/floor',
    siteName: context?.microsite.title,
  })
}
