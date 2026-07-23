import type { MetadataRoute } from 'next'

import { getRequestPublicOrigin } from '@/utilities/getRequestMicrosite'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getRequestPublicOrigin()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/next'],
    },
    sitemap: `${origin}/sitemap.xml`,
    host: origin.replace(/^https?:\/\//, ''),
  }
}
