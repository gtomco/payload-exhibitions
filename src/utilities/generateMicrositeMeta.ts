import type { Metadata } from 'next'

import type { Config, Media, Page, Post } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getRequestPublicOrigin } from '@/utilities/getRequestMicrosite'

type MetaDoc = Partial<Page> | Partial<Post> | null

const getImageURL = (serverUrl: string, image?: Media | Config['db']['defaultIDType'] | null) => {
  let url = `${serverUrl}/website-template-OG.webp`

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    url = ogUrl ? serverUrl + ogUrl : serverUrl + (image.url || '')
  }

  return url
}

export async function generateMicrositeMeta(args: {
  doc?: MetaDoc
  title?: string
  description?: string | null
  path?: string
  siteName?: string
}): Promise<Metadata> {
  const origin = await getRequestPublicOrigin()
  const siteName = args.siteName || 'Exhibition'
  const path = args.path || '/'
  const canonicalPath = path.startsWith('/') ? path : `/${path}`
  const canonical = `${origin}${canonicalPath === '/' ? '' : canonicalPath}`

  const docTitle = args.doc?.meta?.title || args.doc?.title
  const titleBase = args.title || docTitle || siteName
  const title = titleBase === siteName ? siteName : `${titleBase} | ${siteName}`
  const description = args.description || args.doc?.meta?.description || undefined
  const ogImage = getImageURL(origin, args.doc?.meta?.image)

  return {
    metadataBase: new URL(origin),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        sq: `${origin}/sq${canonicalPath === '/' ? '' : canonicalPath}`,
        en: `${origin}/en${canonicalPath === '/' ? '' : canonicalPath}`,
        'x-default': canonical,
      },
    },
    openGraph: mergeOpenGraph({
      description: description || '',
      images: [{ url: ogImage }],
      siteName,
      title,
      url: canonical,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
    },
  }
}
