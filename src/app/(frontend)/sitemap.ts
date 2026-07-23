import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getRequestMicrosite, getRequestPublicOrigin } from '@/utilities/getRequestMicrosite'

export const dynamic = 'force-dynamic'

function entry(
  origin: string,
  path: string,
  opts: Partial<MetadataRoute.Sitemap[number]> = {},
): MetadataRoute.Sitemap[number] {
  const rel = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return {
    url: `${origin}${rel}`,
    changeFrequency: 'weekly',
    priority: 0.7,
    ...opts,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getRequestPublicOrigin()
  const resolved = await getRequestMicrosite()
  const payload = await getPayload({ config: configPromise })

  const entries: MetadataRoute.Sitemap = [
    entry(origin, '/', { changeFrequency: 'weekly', priority: 1, lastModified: new Date() }),
    entry(origin, '/en', { changeFrequency: 'weekly', priority: 0.9 }),
    entry(origin, '/news', { changeFrequency: 'daily', priority: 0.8 }),
    entry(origin, '/en/news', { changeFrequency: 'daily', priority: 0.7 }),
    entry(origin, '/events', { changeFrequency: 'weekly', priority: 0.8 }),
    entry(origin, '/en/events', { changeFrequency: 'weekly', priority: 0.7 }),
    entry(origin, '/program', { changeFrequency: 'weekly', priority: 0.8 }),
    entry(origin, '/en/program', { changeFrequency: 'weekly', priority: 0.7 }),
    entry(origin, '/floor', { changeFrequency: 'weekly', priority: 0.7 }),
    entry(origin, '/en/floor', { changeFrequency: 'weekly', priority: 0.6 }),
    entry(origin, '/search', { changeFrequency: 'monthly', priority: 0.3 }),
  ]

  if (!resolved) {
    return entries
  }

  const micrositeId = resolved.microsite.id

  const [pages, posts, events] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: {
        and: [{ microsite: { equals: micrositeId } }, { _status: { equals: 'published' } }],
      },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
      pagination: false,
    }),
    payload.find({
      collection: 'posts',
      where: {
        and: [{ microsite: { equals: micrositeId } }, { _status: { equals: 'published' } }],
      },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
      pagination: false,
    }),
    payload.find({
      collection: 'events',
      where: {
        and: [{ microsite: { equals: micrositeId } }, { _status: { equals: 'published' } }],
      },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
      pagination: false,
    }),
  ])

  for (const page of pages.docs) {
    if (!page.slug || page.slug === 'home') continue
    const lastModified = page.updatedAt ? new Date(page.updatedAt) : undefined
    entries.push(entry(origin, `/${page.slug}`, { lastModified, priority: 0.7 }))
    entries.push(entry(origin, `/en/${page.slug}`, { lastModified, priority: 0.6 }))
  }

  for (const post of posts.docs) {
    if (!post.slug) continue
    const lastModified = post.updatedAt ? new Date(post.updatedAt) : undefined
    entries.push(entry(origin, `/news/${post.slug}`, { lastModified, priority: 0.6 }))
    entries.push(entry(origin, `/en/news/${post.slug}`, { lastModified, priority: 0.5 }))
  }

  for (const event of events.docs) {
    if (!event.slug) continue
    const lastModified = event.updatedAt ? new Date(event.updatedAt) : undefined
    entries.push(entry(origin, `/events/${event.slug}`, { lastModified, priority: 0.6 }))
    entries.push(entry(origin, `/en/events/${event.slug}`, { lastModified, priority: 0.5 }))
  }

  return entries
}
