import Link from 'next/link'
import React from 'react'

import type { IxMainContent } from '@/main-site/defaults'

type Props = {
  content: IxMainContent
}

function SocialIcons({ social }: { social: IxMainContent['social'] }) {
  const items = [
    { key: 'instagram', href: social.instagram, label: 'Instagram' },
    { key: 'facebook', href: social.facebook, label: 'Facebook' },
    { key: 'linkedin', href: social.linkedin, label: 'LinkedIn' },
    { key: 'youtube', href: social.youtube, label: 'YouTube' },
  ].filter((i) => i.href)

  return (
    <div className="ix-footer__social">
      {items.map((item) => (
        <a key={item.key} href={item.href!} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
          {item.label.slice(0, 2).toUpperCase()}
        </a>
      ))}
    </div>
  )
}

export function IxFooter({ content }: Props) {
  return (
    <footer className="ix-footer" id="contact">
      <div className="ix-wrap">
        <div className="ix-cta__row">
          <div>
            <div className="ix-label ix-label--orange">{content.ctaEyebrow}</div>
            <h2 className="ix-display ix-cta__title">{content.ctaTitle}</h2>
          </div>
          <a className="ix-btn ix-btn--ghost-light" href={`mailto:${content.contactEmail}`}>
            {content.ctaButton} →
          </a>
        </div>

        <div className="ix-footer__grid">
          <div className="ix-footer__brand">
            <Link href="/" className="ix-logo ix-logo--mark" aria-label="IX">
              I<span className="ix-x">X</span>
            </Link>
            <p>{content.footerTagline}</p>
          </div>

          <div className="ix-footer__col">
            <h4>{content.footerExplore}</h4>
            <a href="/#about">{content.nav.about}</a>
            <a href="/#events">{content.nav.events}</a>
            <a href="/#culture">{content.nav.culture}</a>
            <a href="/#news">{content.nav.news}</a>
            <a href="/#contact">{content.nav.contact}</a>
          </div>

          <div className="ix-footer__col">
            <h4>{content.footerPlatforms}</h4>
            {content.platforms.map((p) => (
              <a
                key={p.title}
                href={p.href}
                target={p.external ? '_blank' : undefined}
                rel={p.external ? 'noopener noreferrer' : undefined}
              >
                {p.title}
              </a>
            ))}
          </div>

          <div className="ix-footer__col">
            <h4>{content.footerConnect}</h4>
            <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
            <a href={`tel:${content.contactPhone.replace(/\s+/g, '')}`}>{content.contactPhone}</a>
            <p style={{ whiteSpace: 'pre-line' }}>{content.address}</p>
          </div>
        </div>

        <div className="ix-footer__bottom">
          <span>{content.copyright}</span>
          <SocialIcons social={content.social} />
        </div>
      </div>
    </footer>
  )
}
