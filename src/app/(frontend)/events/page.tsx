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
import { queryMicrositeEvents } from '@/utilities/queryMicrositeContent'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const events = await queryMicrositeEvents({ limit: 12 })
  const lang = await getRequestLang()

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{lang === 'sq' ? 'Evente' : 'Events'}</h1>
          <p>
            <a href="/program">{lang === 'sq' ? 'Shiko axhendën' : 'View programme'}</a>
          </p>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collectionLabels={{ plural: 'Events', singular: 'Event' }}
          currentPage={events.page}
          limit={12}
          totalDocs={events.totalDocs}
        />
      </div>

      <CollectionArchive docs={events.docs} relationTo="events" />

      <div className="container">
        {events.totalPages > 1 && events.page && (
          <Pagination page={events.page} totalPages={events.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const context = await getRequestMicrositeContext()
  const lang = await getRequestLang()
  return generateMicrositeMeta({
    title: lang === 'sq' ? 'Evente' : 'Events',
    path: '/events',
    siteName: context?.microsite.title,
  })
}
