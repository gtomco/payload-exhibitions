import { ECGE_DEFAULT_THEME } from '@/fields/micrositeTheme'

export type MicrositeThemeTokens = {
  primary: string
  secondary: string
  dark: string
  font: string
  homeBgStart: string
  homeBgMid: string
  homeBgEnd: string
  headerBg: string
  calendarBgStart: string
  calendarBgMid: string
  calendarBgEnd: string
  calendarGlowPrimaryColor: string
  calendarGlowSecondaryColor: string
  calendarGlowPrimary: string
  calendarGlowSecondary: string
}

type ThemeSource = {
  primary?: string | null
  secondary?: string | null
  dark?: string | null
  font?: string | null
  homeBgStart?: string | null
  homeBgMid?: string | null
  homeBgEnd?: string | null
  headerBg?: string | null
  calendarBgStart?: string | null
  calendarBgMid?: string | null
  calendarBgEnd?: string | null
  calendarGlowPrimaryColor?: string | null
  calendarGlowSecondaryColor?: string | null
}

type MicrositeColorFallback = {
  primaryColor?: string | null
  secondaryColor?: string | null
  darkColor?: string | null
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '').trim()
  if (!/^[0-9a-f]{3,8}$/i.test(normalized)) return `rgba(50,255,194,${alpha})`
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized.slice(0, 6)
  const value = Number.parseInt(expanded, 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  return `rgba(${r},${g},${b},${alpha})`
}

function pick(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const trimmed = value?.trim()
    if (trimmed) return trimmed
  }
  return undefined
}

export function resolveMicrositeTheme(
  settingsTheme?: ThemeSource | null,
  microsite?: MicrositeColorFallback | null,
): MicrositeThemeTokens {
  const primary = pick(settingsTheme?.primary, microsite?.primaryColor, ECGE_DEFAULT_THEME.primary)!
  const secondary = pick(settingsTheme?.secondary, microsite?.secondaryColor, ECGE_DEFAULT_THEME.secondary)!
  const dark = pick(settingsTheme?.dark, microsite?.darkColor, ECGE_DEFAULT_THEME.dark)!
  const font = pick(settingsTheme?.font, ECGE_DEFAULT_THEME.font)!
  const homeBgStart = pick(settingsTheme?.homeBgStart, ECGE_DEFAULT_THEME.homeBgStart)!
  const homeBgMid = pick(settingsTheme?.homeBgMid, ECGE_DEFAULT_THEME.homeBgMid)!
  const homeBgEnd = pick(settingsTheme?.homeBgEnd, ECGE_DEFAULT_THEME.homeBgEnd)!
  const headerBg = pick(settingsTheme?.headerBg, dark, ECGE_DEFAULT_THEME.headerBg)!
  const calendarBgStart = pick(settingsTheme?.calendarBgStart, ECGE_DEFAULT_THEME.calendarBgStart)!
  const calendarBgMid = pick(settingsTheme?.calendarBgMid, ECGE_DEFAULT_THEME.calendarBgMid)!
  const calendarBgEnd = pick(settingsTheme?.calendarBgEnd, ECGE_DEFAULT_THEME.calendarBgEnd)!
  const calendarGlowPrimaryColor = pick(
    settingsTheme?.calendarGlowPrimaryColor,
    ECGE_DEFAULT_THEME.calendarGlowPrimaryColor,
  )!
  const calendarGlowSecondaryColor = pick(
    settingsTheme?.calendarGlowSecondaryColor,
    ECGE_DEFAULT_THEME.calendarGlowSecondaryColor,
  )!

  return {
    primary,
    secondary,
    dark,
    font,
    homeBgStart,
    homeBgMid,
    homeBgEnd,
    headerBg,
    calendarBgStart,
    calendarBgMid,
    calendarBgEnd,
    calendarGlowPrimaryColor,
    calendarGlowSecondaryColor,
    calendarGlowPrimary: hexToRgba(calendarGlowPrimaryColor, 0.34),
    calendarGlowSecondary: hexToRgba(calendarGlowSecondaryColor, 0.24),
  }
}
