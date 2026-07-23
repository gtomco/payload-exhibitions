import type { MicrositeThemeTokens } from '@/utilities/resolveMicrositeTheme'

/** Maps Payload microsite theme tokens onto ECGE CSS variables. */
export function MicrositeThemeStyles({ theme }: { theme: MicrositeThemeTokens }) {
  const css = `:root {
  --microsite-primary: ${theme.primary};
  --microsite-secondary: ${theme.secondary};
  --microsite-dark: ${theme.dark};
  --microsite-font: ${theme.font}, system-ui, sans-serif;
  --microsite-home-bg-start: ${theme.homeBgStart};
  --microsite-home-bg-mid: ${theme.homeBgMid};
  --microsite-home-bg-end: ${theme.homeBgEnd};
  --microsite-header-bg: ${theme.headerBg};
  --primary: ${theme.primary};
  --secondary: ${theme.secondary};
  --dark: ${theme.dark};
  --font: ${theme.font};
  --home-bg-start: ${theme.homeBgStart};
  --home-bg-mid: ${theme.homeBgMid};
  --home-bg-end: ${theme.homeBgEnd};
  --header-bg: ${theme.headerBg};
  --calendar-bg-start: ${theme.calendarBgStart};
  --calendar-bg-mid: ${theme.calendarBgMid};
  --calendar-bg-end: ${theme.calendarBgEnd};
  --calendar-glow-primary: ${theme.calendarGlowPrimary};
  --calendar-glow-secondary: ${theme.calendarGlowSecondary};
}`

  return <style id="microsite-theme" dangerouslySetInnerHTML={{ __html: css }} />
}
