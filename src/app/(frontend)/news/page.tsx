import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { generateMicrositeMeta } from '@/utilities/generateMicrositeMeta'
import {
  getRequestLang,
  getRequestMicrositeContext,
} from '@/utilities/getRequestMicrosite'
import { queryMicrositePosts } from '@/utilities/queryMicrositeContent'
import { breadcrumbJsonLd, jsonLdScript, webPageJsonLd } from '@/utilities/jsonLd'
import { getRequestPublicOrigin } from '@/utilities/getRequestMicrosite'

export const dynamic = 'force-dynamic'

export default async function NewsIndexPage() {
  const lang = await getRequestLang()
  const origin = await getRequestPublicOrigin()
  const context = await getRequestMicrositeContext()
  const posts = await queryMicrositePosts({ limit: 24 })
  const siteName = context?.microsite.title || 'Exhibition'

  const jsonLd = [
    webPageJsonLd({
      name: lang === 'sq' ? 'Lajme' : 'News',
      url: `${origin}/news`,
      inLanguage: lang,
    }),
    breadcrumbJsonLd({
      items: [
        { name: siteName, url: origin },
        { name: lang === 'sq' ? 'Lajme' : 'News', url: `${origin}/news` },
      ],
    }),
  ]

  return (
    <div className="ecge-cms-page">
      <div className="ecge-cms-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
        <header className="ecge-cms-hero">
          <h1>{lang === 'sq' ? 'Lajme' : 'News'}</h1>
          <p className="ecge-cms-lede">
            {lang === 'sq' ? 'Njoftime dhe artikuj të panairit.' : 'Fair announcements and articles.'}
          </p>
        </header>
        <div className="news-preview-list">
          {posts.docs.map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`}>
              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(lang) : ''}</span>
              <strong>{post.title}</strong>
              <em>{post.meta?.description || ''}</em>
            </Link>
          ))}
        </div>
        {!posts.docs.length ? (
          <p className="minimal-note">
            {lang === 'sq' ? 'Nuk ka lajme ende.' : 'No news yet.'}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const context = await getRequestMicrositeContext()
  const lang = await getRequestLang()
  return generateMicrositeMeta({
    title: lang === 'sq' ? 'Lajme' : 'News',
    path: '/news',
    siteName: context?.microsite.title,
  })
}
