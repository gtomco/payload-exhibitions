import Script from 'next/script'
import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../ThemeSelector/types'

type InitThemeProps = {
  defaultMode?: 'dark' | 'light' | 'system'
}

export const InitTheme: React.FC<InitThemeProps> = ({ defaultMode }) => {
  const mode = defaultMode ?? defaultTheme

  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    function getImplicitPreference() {
      var mediaQuery = '(prefers-color-scheme: dark)'
      var mql = window.matchMedia(mediaQuery)
      var hasImplicitPreference = typeof mql.matches === 'boolean'

      if (hasImplicitPreference) {
        return mql.matches ? 'dark' : 'light'
      }

      return null
    }

    function themeIsValid(theme) {
      return theme === 'light' || theme === 'dark'
    }

    var configuredMode = '${mode}'
    var themeToSet = themeIsValid(configuredMode) ? configuredMode : 'light'
    var preference = window.localStorage.getItem('${themeLocalStorageKey}')

    if (themeIsValid(preference)) {
      themeToSet = preference
    } else {
      var implicitPreference = getImplicitPreference()

      // Honor the system preference when no explicit choice has been made,
      // or when the site is configured to follow the system.
      if (implicitPreference && (configuredMode === 'system' || !themeIsValid(configuredMode))) {
        themeToSet = implicitPreference
      }
    }

    document.documentElement.setAttribute('data-theme', themeToSet)
  })();
  `,
      }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}
