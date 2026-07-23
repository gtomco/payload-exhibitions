import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getRequestMicrosite, getRequestPublicOrigin } from '@/utilities/getRequestMicrosite'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getRequestPublicOrigin()
  const resolved = await getRequestMicrosite()
  const payload = await getPayload({ config: configPromise })

  const entries: MetadataRoute.Sitemap = [
    { url: origin, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${origin}/news`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${origin}/program`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${origin}/floor`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${origin}/search`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  if (!resolved) return entries

  const micrositeId = resolved.microsite.id

  const [pages, posts, events] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: {
        and: [
          { microsite: { equals: micrositeId } },
          { _status: { equals: 'published' } },
        ],
      },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
      pagination: false,
    }),
    payload.find({
      collection: 'posts',
      where: {
        and: [
          { microsite: { equals: micrositeId } },
          { _status: { equals: 'published' } },
        ],
      },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
      pagination: false,
    }),
    payload.find({
      collection: 'events',
      where: {
        and: [
          { microsite: { equals: micrositeId } },
          { _status: { equals: 'published' } },
        ],
      },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
      pagination: false,
    }),
  ])

  for (const page of pages.docs) {
    if (!page.slug || page.slug === 'home') continue
    entries.push({
      url: `${origin}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : undefined,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  for (const post of posts.docs) {
    if (!post.slug) continue
    entries.push({
      url: `${origin}/news/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  }

  for (const event of events.docs) {
    if (!event.slug) continue
    entries.push({
      url: `${origin}/events/${event.slug}`,
      lastModified: event.updatedAt ? new Date(event.updatedAt) : undefined,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  }

  return entries
}
