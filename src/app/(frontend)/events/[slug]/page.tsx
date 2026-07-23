import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Event } from '@/payload-types'
import type { Where } from 'payload'

import { EventHero } from '@/heros/EventHero'
import { generateMicrositeMeta } from '@/utilities/generateMicrositeMeta'
import { getRequestMicrosite, getRequestMicrositeContext } from '@/utilities/getRequestMicrosite'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const events = await payload.find({
      collection: 'events',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    return events.docs.map(({ slug }) => {
      return { slug }
    })
  } catch {
    // Docker/CI builds often have no DB — render on demand
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function EventPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/events/' + decodedSlug
  const event = await queryEventBySlug({ slug: decodedSlug })

  if (!event) return <PayloadRedirects url={url} />

  const theme = await getCachedGlobal('theme', 1)()
  const heroDarkOverlay = Boolean(theme?.heroDarkOverlay)

  return (
    <article className="pt-16 pb-16">
      <PageClient heroDarkOverlay={heroDarkOverlay} />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <EventHero event={event} darkOverlay={heroDarkOverlay} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={event.content} enableGutter={false} />
          {event.relatedEvents && event.relatedEvents.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={event.relatedEvents.filter((event) => typeof event === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const event = await queryEventBySlug({ slug: decodedSlug })
  const context = await getRequestMicrositeContext()

  return generateMicrositeMeta({
    doc: event,
    path: `/events/${decodedSlug}`,
    siteName: context?.microsite.title,
  })
}

const queryEventBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const resolved = await getRequestMicrosite()
  const payload = await getPayload({ config: configPromise })

  const filters: Where[] = [{ slug: { equals: slug } }]
  if (resolved) filters.push({ microsite: { equals: resolved.microsite.id } })

  const result = await payload.find({
    collection: 'events',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { and: filters },
  })

  return result.docs?.[0] || null
})
