import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { CardPostData } from '@/components/Card'
import { SearchIsland } from '@/microsite/SearchIsland'
import { generateMicrositeMeta } from '@/utilities/generateMicrositeMeta'
import {
  getRequestLang,
  getRequestMicrosite,
  getRequestMicrositeContext,
} from '@/utilities/getRequestMicrosite'

export const dynamic = 'force-dynamic'

type Args = {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })
  const resolved = await getRequestMicrosite()
  const lang = await getRequestLang()

  const filters = []
  if (resolved) filters.push({ microsite: { equals: resolved.microsite.id } })
  if (query) {
    filters.push({
      or: [
        { title: { like: query } },
        { 'meta.description': { like: query } },
        { 'meta.title': { like: query } },
        { slug: { like: query } },
      ],
    })
  }

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    pagination: false,
    ...(filters.length ? { where: { and: filters } } : {}),
  })

  return (
    <div className="container py-16">
      <h1 className="mb-8 text-center text-4xl font-bold">
        {lang === 'sq' ? 'Kërko' : 'Search'}
      </h1>
      <div className="mx-auto mb-12 max-w-[50rem]">
        <SearchIsland
          initialQuery={query || ''}
          placeholder={lang === 'sq' ? 'Kërko faqe dhe lajme…' : 'Search pages and news…'}
        />
      </div>
      {posts.docs.length > 0 ? (
        <CollectionArchive docs={posts.docs as CardPostData[]} />
      ) : (
        <p className="text-center text-muted-foreground">
          {lang === 'sq' ? 'Nuk u gjetën rezultate.' : 'No results found.'}
        </p>
      )}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const context = await getRequestMicrositeContext()
  const lang = await getRequestLang()
  return generateMicrositeMeta({
    title: lang === 'sq' ? 'Kërko' : 'Search',
    path: '/search',
    siteName: context?.microsite.title,
  })
}
