import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const theme = await getCachedGlobal('theme', 1)()

  const navItems = footerData?.navItems || []

  const logo = typeof theme?.logo === 'object' && theme.logo ? theme.logo : null
  const logoDark = typeof theme?.logoDark === 'object' && theme.logoDark ? theme.logoDark : null

  return (
    <footer className="mt-auto border-t border-border bg-card text-card-foreground">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo
            alt={logo?.alt || 'Logo'}
            src={getMediaUrl(logo?.url) || undefined}
            srcDark={getMediaUrl(logoDark?.url) || undefined}
          />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-card-foreground" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
