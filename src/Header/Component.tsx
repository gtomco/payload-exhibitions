import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import React from 'react'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()
  const theme = await getCachedGlobal('theme', 1)()

  const logo = typeof theme?.logo === 'object' && theme.logo ? theme.logo : null
  const logoDark = typeof theme?.logoDark === 'object' && theme.logoDark ? theme.logoDark : null

  return (
    <HeaderClient
      data={headerData}
      logoAlt={logo?.alt || 'Logo'}
      logoSrc={getMediaUrl(logo?.url) || undefined}
      logoSrcDark={getMediaUrl(logoDark?.url) || undefined}
      sticky={Boolean(theme?.stickyHeader)}
    />
  )
}
