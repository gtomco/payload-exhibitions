import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import PageClient from './page.client'
import { generateMicrositeMeta } from '@/utilities/generateMicrositeMeta'
import {
  getRequestLang,
  getRequestMicrositeContext,
} from '@/utilities/getRequestMicrosite'
import { queryMicrositePosts } from '@/utilities/queryMicrositeContent'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const posts = await queryMicrositePosts({ limit: 12 })
  const lang = await getRequestLang()

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{lang === 'sq' ? 'Postime' : 'Posts'}</h1>
          <p>
            <a href="/news">{lang === 'sq' ? 'Shiko lajmet' : 'View news'}</a>
          </p>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive docs={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const context = await getRequestMicrositeContext()
  const lang = await getRequestLang()
  return generateMicrositeMeta({
    title: lang === 'sq' ? 'Postime' : 'Posts',
    path: '/posts',
    siteName: context?.microsite.title,
  })
}
