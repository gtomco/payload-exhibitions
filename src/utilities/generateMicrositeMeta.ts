import type { Metadata } from 'next'

import type { Config, Media, Page, Post, Event } from '@/payload-types'
import { DEFAULT_PUBLIC_LANG, type PublicLang } from '@/microsite/constants'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import {
  getRequestLang,
  getRequestLangPrefix,
  getRequestPublicOrigin,
} from '@/utilities/getRequestMicrosite'

type MetaDoc = Partial<Page> | Partial<Post> | Partial<Event> | null

const getImageURL = (serverUrl: string, image?: Media | Config['db']['defaultIDType'] | null) => {
  let url = `${serverUrl}/ix/hero-venue.png`

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    url = ogUrl ? serverUrl + ogUrl : serverUrl + (image.url || '')
  }

  return url
}

function localePath(lang: PublicLang | '', path: string) {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  if (!lang) return normalized || '/'
  return `${normalized === '/' || normalized === '' ? `/${lang}` : `/${lang}${normalized}`}`
}

export async function generateMicrositeMeta(args: {
  doc?: MetaDoc
  title?: string
  description?: string | null
  path?: string
  siteName?: string
  /** When true, caller supplies a full title — do not append siteName again. */
  absoluteTitle?: boolean
  robots?: Metadata['robots']
}): Promise<Metadata> {
  const origin = await getRequestPublicOrigin()
  const lang = await getRequestLang()
  const urlLangPrefix = await getRequestLangPrefix()
  const siteName = args.siteName || 'IX Exhibitions'
  const path = args.path || '/'
  const canonicalPath = path.startsWith('/') ? path : `/${path}`

  // Self-referencing canonical; default locale always uses unprefixed paths
  const selfPrefix =
    urlLangPrefix && urlLangPrefix !== DEFAULT_PUBLIC_LANG ? urlLangPrefix : ''
  const canonicalRel = localePath(selfPrefix, canonicalPath)
  const canonical = `${origin}${canonicalRel === '/' ? '' : canonicalRel}`

  const docTitle = args.doc?.meta?.title || args.doc?.title
  const titleBase = args.title || docTitle || siteName
  const title =
    args.absoluteTitle || titleBase === siteName ? titleBase : `${titleBase} | ${siteName}`
  const description = args.description || args.doc?.meta?.description || undefined
  const ogImage = getImageURL(origin, args.doc?.meta?.image)

  const sqPath = localePath(DEFAULT_PUBLIC_LANG === 'sq' ? '' : 'sq', canonicalPath)
  const enPath = localePath('en', canonicalPath)
  const xDefaultPath = localePath('', canonicalPath)

  return {
    metadataBase: new URL(origin),
    // Absolute string avoids layout title.template double-suffix
    title: { absolute: title },
    description,
    robots: args.robots,
    alternates: {
      canonical,
      languages: {
        sq: `${origin}${sqPath === '/' ? '' : sqPath}`,
        en: `${origin}${enPath === '/' ? '' : enPath}`,
        'x-default': `${origin}${xDefaultPath === '/' ? '' : xDefaultPath}`,
      },
    },
    openGraph: mergeOpenGraph({
      description: description || '',
      images: [{ url: ogImage }],
      siteName,
      title,
      url: canonical,
      locale: lang === 'sq' ? 'sq_AL' : 'en_US',
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      images: [ogImage],
    },
  }
}
