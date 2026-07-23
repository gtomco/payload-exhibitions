import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import type { RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { generateMicrositeMeta } from '@/utilities/generateMicrositeMeta'
import {
  getRequestLang,
  getRequestMicrosite,
  getRequestMicrositeContext,
  getRequestPublicOrigin,
} from '@/utilities/getRequestMicrosite'
import { queryMicrositePageBySlug } from '@/utilities/queryMicrositeContent'
import {
  breadcrumbJsonLd,
  jsonLdScript,
  webPageJsonLd,
} from '@/utilities/jsonLd'
import { VisitorRegistrationForm } from '@/visitors/VisitorRegistrationForm'
import { loadMicrositeRegistrationContext } from '@/visitors/registrationContext'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  const lang = await getRequestLang()
  const origin = await getRequestPublicOrigin()
  const microsite = await getRequestMicrosite()

  let page: RequiredDataFromCollectionSlug<'pages'> | null = await queryMicrositePageBySlug(
    decodedSlug,
  )

  if (!page && slug === 'home' && !microsite) {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page
  const theme = await getCachedGlobal('theme', 1)()
  const heroDarkOverlay = Boolean(theme?.heroDarkOverlay)
  const siteName = microsite?.microsite.title || 'Exhibition'
  const useEcgeChrome = Boolean(microsite)
  const showVisitorForm = useEcgeChrome && decodedSlug === 'visitor'

  let visitorEvent: {
    eventTitle?: string | null
    eventDates?: string | null
    eventLocation?: string | null
  } | null = null

  if (showVisitorForm && microsite) {
    const payload = await getPayload({ config: configPromise })
    const ctx = await loadMicrositeRegistrationContext(payload, microsite.microsite.slug)
    if (ctx) {
      visitorEvent = {
        eventTitle: ctx.eventTitle,
        eventDates: ctx.eventDates,
        eventLocation: ctx.eventLocation,
      }
    }
  }

  const jsonLd = [
    webPageJsonLd({
      name: page.title,
      url: `${origin}${url}`,
      description: page.meta?.description,
      inLanguage: lang,
    }),
    breadcrumbJsonLd({
      items: [
        { name: siteName, url: origin },
        { name: page.title, url: `${origin}${url}` },
      ],
    }),
  ]

  return (
    <article className={useEcgeChrome ? 'ecge-cms-page' : 'pt-16 pb-24'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      {useEcgeChrome ? (
        <div className="ecge-cms-shell">
          <header className="ecge-cms-hero">
            <p className="ecge-cms-kicker">{siteName}</p>
            <h1>{page.title}</h1>
            {page.meta?.description ? <p className="ecge-cms-lede">{page.meta.description}</p> : null}
          </header>
          <div className="ecge-cms-body prose dark:prose-invert max-w-none">
            {hero?.type && hero.type !== 'none' ? <RenderHero {...hero} darkOverlay={heroDarkOverlay} /> : null}
            <RenderBlocks blocks={layout} />
            {showVisitorForm ? (
              <VisitorRegistrationForm
                eventTitle={visitorEvent?.eventTitle}
                eventDates={visitorEvent?.eventDates}
                eventLocation={visitorEvent?.eventLocation}
                micrositeSlug={microsite?.microsite.slug}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <RenderHero {...hero} darkOverlay={heroDarkOverlay} />
          <RenderBlocks blocks={layout} />
        </>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryMicrositePageBySlug(decodedSlug)
  const context = await getRequestMicrositeContext()

  return generateMicrositeMeta({
    doc: page,
    path: decodedSlug === 'home' ? '/' : `/${decodedSlug}`,
    siteName: context?.microsite.title,
  })
}
