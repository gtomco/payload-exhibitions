import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/ix/og-default.png'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)
  const isPost = Boolean(doc && ('publishedAt' in doc || 'categories' in doc))
  const path = doc?.slug
    ? isPost
      ? `/news/${Array.isArray(doc.slug) ? doc.slug.join('/') : doc.slug}`
      : `/${Array.isArray(doc.slug) ? doc.slug.join('/') : doc.slug}`
    : '/'

  const title = doc?.meta?.title
    ? `${doc.meta.title} | IX Exhibitions`
    : 'IX Exhibitions'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: path,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description: doc?.meta?.description || undefined,
      images: [ogImage],
    },
    title,
  }
}
