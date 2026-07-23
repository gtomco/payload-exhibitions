'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

import { type PublicLang } from '@/microsite/constants'
import type { IxMainContent, IxPlatformLink } from '@/main-site/defaults'

type Props = {
  lang: PublicLang
  nav: IxMainContent['nav']
  platforms: IxPlatformLink[]
}

function switchLangHref(target: PublicLang, pathname: string) {
  let path = pathname || '/'
  path = path.replace(/^\/(en|sq)(?=\/|$)/, '') || '/'
  // Always use an explicit /en or /sq prefix so middleware sets lang from the URL
  // (unprefixed `/` would keep a stale `en` cookie and Albanian would appear broken).
  return path === '/' ? `/${target}` : `/${target}${path}`
}

export function IxHeader({ lang, nav, platforms }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname() || '/'

  const links = [
    { href: '/#about', label: nav.about },
    { href: '/#culture', label: nav.culture },
    { href: '/#news', label: nav.news },
    { href: '/#contact', label: nav.contact },
  ]

  return (
    <header className="ix-header">
      <div className="ix-wrap ix-header__inner">
        <Link href="/" className="ix-logo ix-logo--mark" aria-label="IX Exhibitions">
          I<span className="ix-x">X</span>
        </Link>

        <nav className="ix-nav" aria-label="Primary">
          <a href="/#about">{nav.about}</a>
          <div className="ix-nav__dropdown">
            <button type="button" className="ix-nav__btn" aria-haspopup="true">
              {nav.events}
            </button>
            <div className="ix-nav__menu" role="menu">
              {platforms.map((p) => (
                <a
                  key={p.title}
                  href={p.href}
                  target={p.external ? '_blank' : undefined}
                  rel={p.external ? 'noopener noreferrer' : undefined}
                  role="menuitem"
                >
                  {p.title}
                  {p.subtitle ? <small>{p.subtitle}</small> : null}
                </a>
              ))}
            </div>
          </div>
          <a href="/#culture">{nav.culture}</a>
          <a href="/#news">{nav.news}</a>
          <a href="/#contact">{nav.contact}</a>
        </nav>

        <div className="ix-header__tools">
          <div className="ix-lang" aria-label="Language">
            <a href={switchLangHref('en', pathname)} aria-current={lang === 'en' ? 'true' : undefined}>
              EN
            </a>
            <span className="ix-lang__sep">|</span>
            <a href={switchLangHref('sq', pathname)} aria-current={lang === 'sq' ? 'true' : undefined}>
              SQ
            </a>
          </div>
          <button
            type="button"
            className="ix-menu-toggle"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </div>

      <div className={`ix-mobile-nav${open ? ' is-open' : ''}`}>
        {links.slice(0, 1).map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <details>
          <summary>{nav.events}</summary>
          {platforms.map((p) => (
            <a
              key={p.title}
              href={p.href}
              target={p.external ? '_blank' : undefined}
              rel={p.external ? 'noopener noreferrer' : undefined}
              onClick={() => setOpen(false)}
            >
              {p.title}
            </a>
          ))}
        </details>
        {links.slice(1).map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <div className="ix-mobile-nav__lang">
          <a href={switchLangHref('en', pathname)} aria-current={lang === 'en' ? 'true' : undefined}>
            EN
          </a>
          <span>|</span>
          <a href={switchLangHref('sq', pathname)} aria-current={lang === 'sq' ? 'true' : undefined}>
            SQ
          </a>
        </div>
      </div>
    </header>
  )
}
