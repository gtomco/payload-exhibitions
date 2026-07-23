import React from 'react'

import type { IxTheme } from '@/main-site/defaults'

export function IxThemeStyles({ theme }: { theme: IxTheme }) {
  const css = `
.ix-site {
  --ix-black: ${theme.black};
  --ix-white: ${theme.white};
  --ix-orange: ${theme.accent};
  --ix-grey: ${theme.grey};
  --ix-soft: ${theme.soft};
  --ix-film: ${theme.film};
  --ix-muted: ${theme.muted};
}
`.trim()

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
