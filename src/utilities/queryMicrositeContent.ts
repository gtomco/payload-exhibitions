import type { Where } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import { getRequestMicrosite } from '@/utilities/getRequestMicrosite'

export const queryMicrositePageBySlug = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const resolved = await getRequestMicrosite()
  const payload = await getPayload({ config: configPromise })

  const where: Where = resolved
    ? {
        and: [
          { slug: { equals: slug } },
          { microsite: { equals: resolved.microsite.id } },
        ],
      }
    : { slug: { equals: slug } }

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    depth: 2,
    where,
  })

  return result.docs?.[0] || null
})

export const queryMicrositePosts = cache(
  async (options?: { limit?: number; page?: number; slug?: string }) => {
    const { isEnabled: draft } = await draftMode()
    const resolved = await getRequestMicrosite()
    const payload = await getPayload({ config: configPromise })

    const filters: Where[] = []
    if (resolved) filters.push({ microsite: { equals: resolved.microsite.id } })
    if (options?.slug) filters.push({ slug: { equals: options.slug } })
    if (!draft) filters.push({ _status: { equals: 'published' } })

    return payload.find({
      collection: 'posts',
      draft,
      depth: 1,
      limit: options?.limit ?? 12,
      page: options?.page,
      overrideAccess: draft,
      where: filters.length ? { and: filters } : undefined,
      sort: '-publishedAt',
    })
  },
)

export const queryMicrositeEvents = cache(async (options?: { limit?: number; slug?: string }) => {
  const { isEnabled: draft } = await draftMode()
  const resolved = await getRequestMicrosite()
  const payload = await getPayload({ config: configPromise })

  const filters: Where[] = []
  if (resolved) filters.push({ microsite: { equals: resolved.microsite.id } })
  if (options?.slug) filters.push({ slug: { equals: options.slug } })
  if (!draft) filters.push({ _status: { equals: 'published' } })

  return payload.find({
    collection: 'events',
    draft,
    depth: 1,
    limit: options?.limit ?? 100,
    overrideAccess: draft,
    where: filters.length ? { and: filters } : undefined,
    sort: 'eventDate',
  })
})
