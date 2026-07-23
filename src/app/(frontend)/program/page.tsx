import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { generateMicrositeMeta } from '@/utilities/generateMicrositeMeta'
import {
  getRequestLang,
  getRequestMicrositeContext,
  getRequestPublicOrigin,
} from '@/utilities/getRequestMicrosite'
import { queryMicrositeEvents } from '@/utilities/queryMicrositeContent'
import {
  breadcrumbJsonLd,
  eventJsonLd,
  jsonLdScript,
  webPageJsonLd,
} from '@/utilities/jsonLd'

export const dynamic = 'force-dynamic'

export default async function ProgramPage() {
  const lang = await getRequestLang()
  const origin = await getRequestPublicOrigin()
  const context = await getRequestMicrositeContext()
  const events = await queryMicrositeEvents({ limit: 100 })
  const siteName = context?.microsite.title || 'Exhibition'

  const jsonLd = [
    webPageJsonLd({
      name: lang === 'sq' ? 'Axhenda' : 'Agenda',
      url: `${origin}/program`,
      inLanguage: lang,
    }),
    breadcrumbJsonLd({
      items: [
        { name: siteName, url: origin },
        { name: lang === 'sq' ? 'Axhenda' : 'Agenda', url: `${origin}/program` },
      ],
    }),
    ...events.docs.map((event) =>
      eventJsonLd({
        name: event.title,
        url: `${origin}/events/${event.slug}`,
        description: event.meta?.description,
        startDate: event.eventDate,
        locationName: context?.settings?.address,
      }),
    ),
  ]

  return (
    <div className="ecge-cms-page">
      <div className="ecge-cms-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
        <header className="ecge-cms-hero">
          <h1>{lang === 'sq' ? 'Axhenda' : 'Agenda'}</h1>
          <p className="ecge-cms-lede">
            {lang === 'sq'
              ? 'Programi i konferencave dhe aktiviteteve.'
              : 'Conference and fair programme.'}
          </p>
        </header>
        <ol className="news-preview-list">
          {events.docs.map((event) => (
            <li key={event.id}>
              <Link href={`/events/${event.slug}`}>
                <span>
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleString(lang, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : null}
                </span>
                <strong>{event.title}</strong>
                <em>{event.meta?.description || ''}</em>
              </Link>
            </li>
          ))}
        </ol>
        {!events.docs.length ? (
          <p className="minimal-note">
            {lang === 'sq' ? 'Nuk ka evente të publikuara ende.' : 'No published events yet.'}
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
    title: lang === 'sq' ? 'Axhenda' : 'Agenda',
    path: '/program',
    siteName: context?.microsite.title,
  })
}
