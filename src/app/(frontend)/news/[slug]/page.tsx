import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import React from 'react'

import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { generateMicrositeMeta } from '@/utilities/generateMicrositeMeta'
import {
  getRequestLang,
  getRequestMicrositeContext,
  getRequestPublicOrigin,
} from '@/utilities/getRequestMicrosite'
import { queryMicrositePosts } from '@/utilities/queryMicrositeContent'
import { breadcrumbJsonLd, jsonLdScript, newsArticleJsonLd } from '@/utilities/jsonLd'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function NewsArticlePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const result = await queryMicrositePosts({ slug: decodedSlug, limit: 1 })
  const post = result.docs[0]
  const lang = await getRequestLang()
  const origin = await getRequestPublicOrigin()
  const context = await getRequestMicrositeContext()
  const siteName = context?.microsite.title || 'Exhibition'
  const url = `/news/${decodedSlug}`

  if (!post) {
    return <PayloadRedirects url={url} />
  }

  const heroImage =
    post.heroImage && typeof post.heroImage === 'object' && post.heroImage.url
      ? `${origin}${post.heroImage.url}`
      : post.meta?.image && typeof post.meta.image === 'object' && post.meta.image.url
        ? `${origin}${post.meta.image.url}`
        : undefined

  const jsonLd = [
    newsArticleJsonLd({
      headline: post.title,
      url: `${origin}${url}`,
      description: post.meta?.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      image: heroImage,
      publisherName: siteName,
      publisherUrl: origin,
      inLanguage: lang,
    }),
    breadcrumbJsonLd({
      items: [
        { name: siteName, url: origin },
        { name: lang === 'sq' ? 'Lajme' : 'News', url: `${origin}/news` },
        { name: post.title, url: `${origin}${url}` },
      ],
    }),
  ]

  return (
    <article className="container max-w-3xl py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <p className="text-sm text-muted-foreground">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(lang) : null}
      </p>
      <h1 className="mt-2 text-4xl font-bold">{post.title}</h1>
      {post.meta?.description ? (
        <p className="mt-4 text-lg text-muted-foreground">{post.meta.description}</p>
      ) : null}
      {post.content ? (
        <div className="mt-8">
          <RichText data={post.content} />
        </div>
      ) : null}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const result = await queryMicrositePosts({ slug: decodedSlug, limit: 1 })
  const post = result.docs[0]
  if (!post) return {}
  const context = await getRequestMicrositeContext()
  return generateMicrositeMeta({
    doc: post,
    path: `/news/${decodedSlug}`,
    siteName: context?.microsite.title,
  })
}
