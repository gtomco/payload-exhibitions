import Link from 'next/link'
import React from 'react'

import type { PublicLang } from '@/microsite/constants'
import { Countdown } from '@/microsite/Countdown'
import { copy, langChoice } from '@/microsite/copy'
import { Btn } from '@/microsite/ui'

type HomePost = {
  id: string | number
  title?: string | null
  slug?: string | null
  publishedAt?: string | null
  createdAt?: string | null
  meta?: { description?: string | null } | null
}

type Props = {
  lang: PublicLang
  basePath?: string
  brand: string
  heroEyebrow?: string | null
  heroTitle?: string | null
  heroSubtitle?: string | null
  posts: HomePost[]
  confirmedCount?: number
}

function withBase(basePath: string, path: string) {
  if (!basePath) return path
  if (path === '/') return basePath
  return `${basePath}${path}`
}

function formatPostDate(value: string, lang: PublicLang) {
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? date.toLocaleDateString(lang) : ''
}

function HeroVideo({ lang }: { lang: PublicLang }) {
  const demoCaptions = [
    [
      langChoice(lang, 'ECGE 2026', 'ECGE 2026'),
      langChoice(
        lang,
        'Energjia, ndertimi dhe ekonomia e gjelber ne Tirane.',
        'Energy, construction and green economy in Tirana.',
      ),
    ],
    [
      langChoice(lang, 'Dy dite biznesi', 'Two business days'),
      langChoice(
        lang,
        'Ekspozues, investitore, zhvillues dhe institucione ne nje platforme.',
        'Exhibitors, investors, developers and institutions in one platform.',
      ),
    ],
    [
      langChoice(lang, 'Ndertim modern', 'Modern construction'),
      langChoice(
        lang,
        'Materiale, fasada, infrastrukture dhe godina inteligjente.',
        'Materials, facades, infrastructure and smart buildings.',
      ),
    ],
    [
      langChoice(lang, 'Tranzicion energjetik', 'Energy transition'),
      langChoice(
        lang,
        'Solar, eficience, storage, rrjet dhe teknologji te reja.',
        'Solar, efficiency, storage, grid and new technologies.',
      ),
    ],
    [
      langChoice(lang, '29-30 Tetor 2026', '29-30 October 2026'),
      langChoice(lang, 'Pallati i Kongreseve, Tirane.', 'Palace of Congresses, Tirana.'),
    ],
  ]

  return (
    <aside
      className="hero-video-card"
      aria-label={langChoice(lang, 'Video prezantuese ECGE', 'ECGE presentation video')}
    >
      <div className="video-shell demo-video">
        <div className="demo-video-track">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="demo-video-grid" />
        <div className="demo-video-pulse" />
        <div className="demo-video-captions">
          {demoCaptions.map(([title, text], index) => (
            <article key={title} style={{ ['--caption-index' as string]: index }}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="demo-video-ticker">
          <span>ECGE 2026</span>
          <span>{langChoice(lang, 'ENERGJI', 'ENERGY')}</span>
          <span>{langChoice(lang, 'NDERTIM', 'CONSTRUCTION')}</span>
          <span>{langChoice(lang, 'EKONOMI E GJELBER', 'GREEN ECONOMY')}</span>
        </div>
      </div>
    </aside>
  )
}

export function EcgeHomePage({
  lang,
  basePath = '',
  brand,
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  posts,
  confirmedCount = 0,
}: Props) {
  const title =
    heroTitle ||
    langChoice(
      lang,
      'Panairi i Energjise, Ndertimit dhe Ekonomise se Gjelber',
      'Energy, Construction & Green Economy Fair',
    )

  const gateways = [
    [
      withBase(basePath, '/visitor'),
      langChoice(lang, 'Regjistrimi i vizitoreve', 'Visitor Registration'),
      langChoice(
        lang,
        'Regjistrim, hyrje me QR dhe informacion per viziten.',
        'Registration, QR ticket and visit information.',
      ),
    ],
    [
      withBase(basePath, '/program'),
      langChoice(lang, 'Axhenda e panairit', 'Fair Agenda'),
      langChoice(
        lang,
        'Program, prezantime dhe diskutime sektoriale.',
        'Agenda, presentations and sector discussions.',
      ),
    ],
    [
      withBase(basePath, '/floor'),
      langChoice(lang, 'Planimetria', 'Floor Plan'),
      langChoice(
        lang,
        'Plan interaktiv me marker-a dhe stenda.',
        'Interactive plan with markers and booths.',
      ),
    ],
  ] as const

  const floorStyle = {
    backgroundImage: `linear-gradient(90deg, rgba(6,59,99,.92), rgba(6,59,99,.68)), url('/ecge/floorplan-preview.png')`,
  }

  return (
    <>
      <section className="home-expo-stage">
        <div className="stage-glow" />
        <div className="home-countdown-center">
          <Countdown lang={lang} />
        </div>
        <div className="home-video-wrap">
          <HeroVideo lang={lang} />
        </div>
        <div className="hero-title-block">
          {heroEyebrow ? <p className="hero-eyebrow">{heroEyebrow}</p> : null}
          <h1>{title}</h1>
          {heroSubtitle ? <p className="hero-subtitle">{heroSubtitle}</p> : null}
          <div className="home-event-lines">
            <span>{copy(lang, 'date')}</span>
            <span>{copy(lang, 'venue')}</span>
            <span>{copy(lang, 'edition')}</span>
          </div>
          <div className="home-hero-actions">
            <Btn href={withBase(basePath, '/visitor')}>{copy(lang, 'registerVisitor')}</Btn>
            <Btn className="secondary" href={withBase(basePath, '/exhibitor')}>
              {copy(lang, 'registerExhibitor')}
            </Btn>
          </div>
        </div>
      </section>

      <section className="section gateway-section">
        {gateways.map(([href, label, body]) => (
          <Link key={href} href={href} className="gateway-card glass">
            <span>{label}</span>
            <strong>{body}</strong>
          </Link>
        ))}
      </section>

      <section className="section floor-preview immersive-floor clean-floor-preview" style={floorStyle}>
        <div className="floor-preview-copy">
          <h2>{langChoice(lang, 'Planimetria interaktive', 'Interactive Floor Plan')}</h2>
          <Btn href={withBase(basePath, '/floor')}>
            {langChoice(lang, 'Hap planimetrine', 'Open floor plan')}
          </Btn>
          <span>
            {confirmedCount}{' '}
            {langChoice(lang, 'ekspozues te konfirmuar ne harte', 'confirmed exhibitors on map')}
          </span>
        </div>
        <div className="floor-preview-map">
          <div className="floor-preview-empty">
            <img src="/ecge/floorplan-preview.png" alt={langChoice(lang, 'Planimetria', 'Floor plan')} />
          </div>
        </div>
      </section>

      <section className="section recent-news">
        <div className="section-head split-head">
          <div>
            <h2>{langChoice(lang, 'Lajmet e fundit', 'Recent News')}</h2>
            <p>
              {langChoice(
                lang,
                'Lajme, trende dhe zhvillime nga energjia, ndertimi dhe ekonomia e gjelber.',
                'News, trends and developments from energy, construction and the green economy.',
              )}
            </p>
          </div>
          <Btn className="ghost" href={withBase(basePath, '/news')}>
            {langChoice(lang, 'Te gjitha lajmet', 'All news')}
          </Btn>
        </div>
        <div className="news-preview-list">
          {posts.map((post) => (
            <Link key={String(post.id)} href={withBase(basePath, `/news/${post.slug || ''}`)}>
              <span>{formatPostDate(String(post.publishedAt || post.createdAt || ''), lang)}</span>
              <strong>{post.title || 'News'}</strong>
              <em>{post.meta?.description || ''}</em>
            </Link>
          ))}
          {!posts.length ? (
            <div className="minimal-note">
              {langChoice(lang, 'Lajmet do te shfaqen ketu.', 'News will appear here.')}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section sponsors-preview">
        <div className="section-head">
          <h2>{langChoice(lang, 'Sponsore dhe partnere', 'Sponsors & Partners')}</h2>
        </div>
        <div className="sponsor-strip">
          <span>
            {langChoice(
              lang,
              'Partneret do te shfaqen ketu — shto media/sponsor ne CMS.',
              'Partners will appear here — add sponsor media in the CMS.',
            )}
          </span>
        </div>
        <p className="sr-only">{brand}</p>
      </section>
    </>
  )
}
