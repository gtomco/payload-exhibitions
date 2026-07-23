import React from 'react'

import type { PublicLang } from '@/microsite/constants'
import { MicrositeHeaderClient } from '@/microsite/MicrositeHeader.client'

export type MicrositeNavLink = {
  key: string
  title: string
  lead: string
  leadHref: string
  items: Array<{ href: string; label: string }>
}

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

export function MicrositeHeader(props: Props) {
  return <MicrositeHeaderClient {...props} />
}
