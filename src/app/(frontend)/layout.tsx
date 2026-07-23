import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { ThemeStyles } from '@/globals/Theme/ThemeStyles'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { draftMode } from 'next/headers'
import { MicrositeFooter } from '@/microsite/MicrositeFooter'
import { MicrositeHeader } from '@/microsite/MicrositeHeader'
import { MicrositeThemeStyles } from '@/microsite/MicrositeThemeStyles'
import { buildMicrositeNav } from '@/microsite/buildNav'
import { IxHeader } from '@/main-site/IxHeader'
import { IxFooter } from '@/main-site/IxFooter'
import { IxThemeStyles } from '@/main-site/IxThemeStyles'
import { getMainSiteContent } from '@/main-site/getMainSiteContent'
import {
  getRequestLang,
  getRequestMicrositeBasePath,
  getRequestMicrositeContext,
  getRequestPublicOrigin,
} from '@/utilities/getRequestMicrosite'
import { ECGE_DEFAULT_THEME } from '@/fields/micrositeTheme'
import { resolveMicrositeTheme } from '@/utilities/resolveMicrositeTheme'

import './globals.css'
import '@/microsite/ecge.css'
import '@/microsite/ecge-overrides.css'
import '@/main-site/ix.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const theme = await getCachedGlobal('theme', 0)()
  const micrositeContext = await getRequestMicrositeContext()
  const lang = await getRequestLang()
  const basePath = await getRequestMicrositeBasePath()
  const mainContent = micrositeContext ? null : await getMainSiteContent(lang)

  const micrositeTheme = micrositeContext?.settings?.theme
    ? micrositeContext.settings.theme
    : micrositeContext
      ? resolveMicrositeTheme(null, micrositeContext.microsite.theme)
      : null

  const brand = micrositeContext?.microsite.title || 'Exhibition'
  const navigation = buildMicrositeNav(lang, micrositeContext?.settings?.navigation, basePath)
  const homeHref = basePath || '/'
  const withBase = (path: string) => {
    if (!basePath) return path
    if (path === '/') return basePath
    return `${basePath}${path}`
  }
  const logoSrc = micrositeContext?.settings?.logoUrl || '/ecge/logo.png'

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang={lang}
      suppressHydrationWarning
    >
      <head>
        <InitTheme defaultMode={theme?.defaultMode ?? (micrositeContext ? 'light' : 'light')} />
        {micrositeTheme ? (
          <MicrositeThemeStyles theme={micrositeTheme} />
        ) : mainContent ? (
          <IxThemeStyles theme={mainContent.theme} />
        ) : (
          <ThemeStyles />
        )}
        {micrositeTheme ? (
          <link
            href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(
              micrositeTheme.font || 'Inter',
            )}:wght@400;600;700;800;900&display=swap`}
            rel="stylesheet"
          />
        ) : null}
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body
        className={micrositeContext ? 'ecge-site' : 'ix-site'}
        style={
          micrositeTheme
            ? { fontFamily: `var(--font, ${ECGE_DEFAULT_THEME.font}), system-ui, sans-serif` }
            : undefined
        }
      >
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          {micrositeContext ? (
            <>
              <MicrositeHeader
                brand={brand}
                lang={lang}
                basePath={basePath}
                homeHref={homeHref}
                navigation={navigation}
                visitorHref={withBase('/visitor')}
                exhibitorHref={withBase('/exhibitor')}
                logoSrc={logoSrc}
              />
              <main>{children}</main>
              <MicrositeFooter
                brand={brand}
                lang={lang}
                footerNote={micrositeContext.settings?.footerNote}
                contactEmail={micrositeContext.settings?.contactEmail}
                contactPhone={micrositeContext.settings?.contactPhone}
                address={micrositeContext.settings?.address}
                logoSrc={logoSrc}
                basePath={basePath}
                homeHref={homeHref}
              />
            </>
          ) : mainContent ? (
            <>
              <IxHeader lang={lang} nav={mainContent.nav} platforms={mainContent.platforms} />
              <main>{children}</main>
              <IxFooter content={mainContent} />
            </>
          ) : (
            <main>{children}</main>
          )}
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestPublicOrigin()
  const context = await getRequestMicrositeContext()
  const siteName = context?.microsite.title || 'IX Exhibitions'

  return {
    metadataBase: new URL(origin || getServerSideURL()),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: context?.microsite.description || undefined,
    openGraph: mergeOpenGraph({
      siteName,
      title: siteName,
      description: context?.microsite.description || '',
      url: origin,
    }),
    twitter: {
      card: 'summary_large_image',
    },
  }
}
