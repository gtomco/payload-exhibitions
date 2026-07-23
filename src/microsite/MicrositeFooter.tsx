import Link from 'next/link'
import React from 'react'

import type { PublicLang } from '@/microsite/constants'
import { copy, langChoice } from '@/microsite/copy'

type Props = {
  brand: string
  lang: PublicLang
  footerNote?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  address?: string | null
  logoSrc?: string | null
  basePath?: string
  homeHref?: string
}

function withBase(basePath: string, path: string) {
  if (!basePath) return path
  if (path === '/') return basePath
  return `${basePath}${path}`
}

export function MicrositeFooter({
  brand,
  lang,
  footerNote,
  contactEmail,
  contactPhone,
  address,
  logoSrc,
  basePath = '',
  homeHref = '/',
}: Props) {
  const email = contactEmail || 'info@icebergexhibitions.com'
  const phone = contactPhone || '+355 69 40 63 909'
  const social = [
    ['Instagram', 'https://www.instagram.com/ecge_fair'],
    ['Facebook', 'https://www.facebook.com/icebergexhibitions'],
    ['LinkedIn', 'https://www.linkedin.com/company/iceberg-exhibitions/'],
  ] as const

  const sectors = [
    [withBase(basePath, '/energy'), langChoice(lang, 'Energji', 'Energy')],
    [withBase(basePath, '/construction'), langChoice(lang, 'Ndertim', 'Construction')],
    [withBase(basePath, '/green-economy'), langChoice(lang, 'Ekonomi e Gjelber', 'Green Economy')],
  ] as const

  return (
    <footer className="ecge-contact-footer">
      <div className="contact-footer-inner">
        <div className="contact-footer-brand">
          <Link className="footer-logo" href={homeHref} aria-label={brand}>
            {logoSrc ? (
              <img src={logoSrc} alt={`${brand} logo`} />
            ) : (
              <>
                <span className="brand-mark">E</span>
                <strong>{brand}</strong>
              </>
            )}
          </Link>
          <p>
            {footerNote ||
              langChoice(
                lang,
                'Panairi i Energjise, Ndertimit dhe Ekonomise se Gjelber.',
                'Energy, Construction and Green Economy Fair.',
              )}
          </p>
          <div className="footer-sector-links">
            {sectors.map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="contact-footer-block">
          <span>{langChoice(lang, 'Organizatori', 'Organiser')}</span>
          <strong>Iceberg Exhibitions</strong>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
        </div>
        <div className="contact-footer-block">
          <span>{langChoice(lang, 'Vendndodhja', 'Venue')}</span>
          <strong>{address || copy(lang, 'venue')}</strong>
          <a
            href="https://maps.google.com/?q=Palace%20of%20Congresses%20Tirana"
            target="_blank"
            rel="noopener noreferrer"
          >
            {langChoice(lang, 'Hap ne Google Maps', 'Open in Google Maps')}
          </a>
        </div>
        <div className="contact-footer-block">
          <span>{langChoice(lang, 'Rrjete sociale', 'Social Media')}</span>
          <div className="footer-socials">
            {social.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
