import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import {
  COLOR_TOKENS,
  FONT_STACKS,
  FONT_SIZE_VALUES,
  HEADING_WEIGHT_VALUES,
  LINE_HEIGHT_VALUES,
  RADIUS_VALUES,
} from './tokens'

// Allow only characters that can legitimately appear in a CSS color/length value.
const sanitize = (value: string): null | string => {
  const trimmed = value.trim()
  if (!trimmed) return null
  return /^[#0-9a-zA-Z(),.%\s-]+$/.test(trimmed) ? trimmed : null
}

const buildColorBlock = (
  colors: Record<string, unknown> | null | undefined,
): string => {
  if (!colors) return ''

  const declarations: string[] = []
  for (const token of COLOR_TOKENS) {
    const raw = colors[token.name]
    if (typeof raw !== 'string') continue
    const value = sanitize(raw)
    if (!value) continue
    for (const cssVar of token.cssVars) {
      declarations.push(`${cssVar}: ${value};`)
    }
  }
  return declarations.join('\n  ')
}

export async function ThemeStyles() {
  const theme = await getCachedGlobal('theme', 1)()

  if (!theme) return null

  const rootDeclarations: string[] = []

  const fontSans = FONT_STACKS[theme.fontSans ?? 'geist']
  if (fontSans) rootDeclarations.push(`--font-sans: ${fontSans};`)

  const fontHeading = FONT_STACKS[theme.fontHeading ?? 'geist']
  if (fontHeading) rootDeclarations.push(`--font-heading: ${fontHeading};`)

  const fontMono = FONT_STACKS[theme.fontMono ?? 'mono']
  if (fontMono) rootDeclarations.push(`--font-mono: ${fontMono};`)

  const baseFontSize = FONT_SIZE_VALUES[theme.baseFontSize ?? 'medium']
  if (baseFontSize) rootDeclarations.push(`--font-size-base: ${baseFontSize};`)

  const lineHeight = LINE_HEIGHT_VALUES[theme.lineHeight ?? 'normal']
  if (lineHeight) rootDeclarations.push(`--line-height: ${lineHeight};`)

  const headingWeight = HEADING_WEIGHT_VALUES[theme.headingWeight ?? 'semibold']
  if (headingWeight) rootDeclarations.push(`--heading-weight: ${headingWeight};`)

  const radius = RADIUS_VALUES[theme.radius ?? 'medium']
  if (radius) rootDeclarations.push(`--radius: ${radius};`)

  const lightColors = buildColorBlock(theme.lightColors as Record<string, unknown>)
  const darkColors = buildColorBlock(theme.darkColors as Record<string, unknown>)

  const css = [
    `:root {\n  ${[...rootDeclarations, lightColors].filter(Boolean).join('\n  ')}\n}`,
    darkColors ? `[data-theme='dark'] {\n  ${darkColors}\n}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return <style dangerouslySetInnerHTML={{ __html: css }} id="theme-overrides" />
}
