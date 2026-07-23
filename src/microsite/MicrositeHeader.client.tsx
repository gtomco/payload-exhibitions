'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

import type { PublicLang } from '@/microsite/constants'
import { copy, langChoice } from '@/microsite/copy'
import type { MicrositeNavLink } from '@/microsite/MicrositeHeader'
import { Btn, QuickIcon } from '@/microsite/ui'

type Props = {
  brand: string
  lang: PublicLang
  navigation: MicrositeNavLink[]
  basePath?: string
  homeHref?: string
  visitorHref?: string
  exhibitorHref?: string
  logoSrc?: string | null
  mapsUrl?: string
}

function switchLangHref(next: PublicLang, basePath: string, pathname: string) {
  let path = pathname || '/'
  path = path.replace(/^\/m\/[a-z0-9-]+/i, '') || '/'
  path = path.replace(/^\/(en|sq)(?=\/|$)/, '') || '/'

  const prefix = basePath || ''
  if (path === '/') return `${prefix}/${next}`
  return `${prefix}/${next}${path}`
}

function withBase(basePath: string, path: string) {
  if (!basePath) return path
  if (path === '/') return basePath
  return `${basePath}${path}`
}

function isHomePath(pathname: string, basePath: string) {
  const normalized = pathname.replace(/\/$/, '') || '/'
  const home = (basePath || '/').replace(/\/$/, '') || '/'
  const withoutLang = normalized.replace(/\/(en|sq)$/, '') || '/'
  return withoutLang === home || withoutLang === `${home}` || normalized === '/' || normalized === basePath
}

export function MicrositeHeaderClient({
  brand,
  lang,
  navigation,
  basePath = '',
  homeHref = '/',
  visitorHref = '/visitor',
  exhibitorHref = '/exhibitor',
  logoSrc,
  mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Pallati%20i%20Kongreseve%20Tirane',
}: Props) {
  const pathname = usePathname() || '/'
  const [openKey, setOpenKey] = useState<string | null>(null)
  const active = navigation.find((group) => group.key === openKey) || navigation[0]
  const otherLang: PublicLang = lang === 'sq' ? 'en' : 'sq'
  const overHero = isHomePath(pathname, basePath)

  return (
    <header className={`site-header expo-header ${overHero ? 'over-hero' : 'scrolled'}`}>
      <nav className="nav">
        <Link className="brand logo-only" href={homeHref} aria-label={brand}>
          <span className="brand-mark">
            {logoSrc ? <img src={logoSrc} alt={`${brand} logo`} /> : 'E'}
          </span>
        </Link>
        <div className="itb-main-nav">
          {navigation.map((group) => (
            <button
              key={group.key}
              type="button"
              className={openKey === group.key ? 'active' : ''}
              aria-expanded={openKey === group.key}
              aria-controls="ecge-header-dropdown"
              onClick={() => setOpenKey(openKey === group.key ? null : group.key)}
            >
              {group.title}
            </button>
          ))}
        </div>
        <div className="nav-actions quick-actions">
          <Link
            href={switchLangHref(otherLang, basePath, pathname)}
            className="quick-icon lang-toggle"
            title={langChoice(lang, 'Gjuha', 'Language')}
            hrefLang={otherLang}
          >
            <QuickIcon name="globe" />
            <span>{lang === 'sq' ? 'EN' : 'SQ'}</span>
          </Link>
          <a
            className="quick-icon"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={langChoice(lang, 'Vendodhja ne Google Maps', 'Venue on Google Maps')}
          >
            <QuickIcon name="pin" />
          </a>
          <Link
            className="quick-icon"
            href={withBase(basePath, '/program')}
            title={langChoice(lang, 'Shto ne kalendar', 'Add to calendar')}
          >
            <QuickIcon name="calendar" />
          </Link>
          <Link
            className="quick-icon"
            href={visitorHref}
            title={langChoice(lang, 'Profil / Regjistrim', 'Profile / Sign up')}
          >
            <QuickIcon name="user" />
          </Link>
          <Link
            className="quick-icon"
            href={withBase(basePath, '/search')}
            title={langChoice(lang, 'Kerko', 'Search')}
          >
            <QuickIcon name="search" />
          </Link>
        </div>
      </nav>
      <div
        id="ecge-header-dropdown"
        className={`header-dropdown ${openKey ? 'open' : ''}`}
        aria-hidden={!openKey}
      >
        {active ? (
          <div className="header-dropdown-inner">
            <Link
              className="header-dropdown-lead"
              href={active.leadHref}
              onClick={() => setOpenKey(null)}
            >
              {active.lead}
              <span>&rarr;</span>
            </Link>
            <div className="header-dropdown-links">
              {active.items.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className="menu-link"
                  onClick={() => setOpenKey(null)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="header-dropdown-actions">
              <Btn href={visitorHref}>{copy(lang, 'registerVisitor')}</Btn>
              <Btn className="secondary" href={exhibitorHref}>
                {copy(lang, 'registerExhibitor')}
              </Btn>
            </div>
          </div>
        ) : null}
      </div>
      {openKey ? (
        <button
          type="button"
          className="menu-backdrop open"
          aria-label="Close menu"
          onClick={() => setOpenKey(null)}
        />
      ) : null}
    </header>
  )
}
