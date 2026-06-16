'use client'

import { useAllFormFields } from '@payloadcms/ui'
import React from 'react'

import {
  COLOR_TOKENS,
  DEFAULT_DARK_COLORS,
  DEFAULT_LIGHT_COLORS,
  FONT_SIZE_VALUES,
  FONT_STACKS,
  HEADING_WEIGHT_VALUES,
  LINE_HEIGHT_VALUES,
} from './tokens'

type FieldValue = { value?: unknown }

const getStr = (fields: Record<string, FieldValue>, path: string): string | undefined => {
  const v = fields[path]?.value
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

const PreviewCard = ({
  colors,
  fonts,
  mode,
}: {
  colors: Record<string, string>
  fonts: {
    body: string
    heading: string
    headingWeight: string
    lineHeight: string
    size: string
  }
  mode: 'dark' | 'light'
}) => {
  const c = (name: string) =>
    colors[name] || (mode === 'dark' ? DEFAULT_DARK_COLORS[name] : DEFAULT_LIGHT_COLORS[name])

  return (
    <div
      style={{
        background: c('background'),
        border: `1px solid ${c('border')}`,
        borderRadius: 12,
        color: c('foreground'),
        fontFamily: fonts.body,
        fontSize: fonts.size,
        lineHeight: fonts.lineHeight,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          alignItems: 'center',
          borderBottom: `1px solid ${c('border')}`,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 16px',
        }}
      >
        <strong style={{ fontFamily: fonts.heading, fontWeight: Number(fonts.headingWeight) }}>
          {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </strong>
        <span style={{ color: c('mutedForeground'), fontSize: '0.85em' }}>Home · About · Blog</span>
      </div>

      {/* Hero / card */}
      <div style={{ padding: 16 }}>
        <div
          style={{
            background: c('card'),
            borderRadius: 10,
            color: c('cardForeground'),
            padding: 16,
          }}
        >
          <h2
            style={{
              fontFamily: fonts.heading,
              fontSize: '1.6em',
              fontWeight: Number(fonts.headingWeight),
              margin: '0 0 8px',
            }}
          >
            The quick brown fox
          </h2>
          <p style={{ color: c('mutedForeground'), margin: '0 0 12px' }}>
            Jumps over the lazy dog. This is how body paragraphs and muted text appear with your
            chosen colors, font and size.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{
                background: c('primary'),
                border: 'none',
                borderRadius: 8,
                color: c('primaryForeground'),
                cursor: 'default',
                padding: '8px 14px',
              }}
              type="button"
            >
              Primary
            </button>
            <button
              style={{
                background: c('secondary'),
                border: `1px solid ${c('border')}`,
                borderRadius: 8,
                color: c('secondaryForeground'),
                cursor: 'default',
                padding: '8px 14px',
              }}
              type="button"
            >
              Secondary
            </button>
            <button
              style={{
                background: c('accent'),
                border: 'none',
                borderRadius: 8,
                color: c('accentForeground'),
                cursor: 'default',
                padding: '8px 14px',
              }}
              type="button"
            >
              Accent
            </button>
          </div>
        </div>

        {/* Swatches */}
        <div
          style={{
            display: 'grid',
            gap: 6,
            gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
            marginTop: 14,
          }}
        >
          {COLOR_TOKENS.map((t) => (
            <div key={t.name} style={{ textAlign: 'center' }}>
              <div
                style={{
                  background: c(t.name),
                  border: `1px solid ${c('border')}`,
                  borderRadius: 6,
                  height: 28,
                }}
              />
              <span style={{ color: c('mutedForeground'), fontSize: 10 }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const ThemePreview: React.FC = () => {
  const [fields] = useAllFormFields()
  const f = fields as Record<string, FieldValue>

  const fonts = {
    body: FONT_STACKS[getStr(f, 'fontSans') || 'geist'] || FONT_STACKS.geist,
    heading: FONT_STACKS[getStr(f, 'fontHeading') || 'geist'] || FONT_STACKS.geist,
    headingWeight: HEADING_WEIGHT_VALUES[getStr(f, 'headingWeight') || 'semibold'] || '600',
    lineHeight: LINE_HEIGHT_VALUES[getStr(f, 'lineHeight') || 'normal'] || '1.5',
    size: FONT_SIZE_VALUES[getStr(f, 'baseFontSize') || 'medium'] || '1rem',
  }

  const lightColors: Record<string, string> = {}
  const darkColors: Record<string, string> = {}
  for (const t of COLOR_TOKENS) {
    const l = getStr(f, `lightColors.${t.name}`)
    const d = getStr(f, `darkColors.${t.name}`)
    if (l) lightColors[t.name] = l
    if (d) darkColors[t.name] = d
  }

  return (
    <div className="field-type">
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        <PreviewCard colors={lightColors} fonts={fonts} mode="light" />
        <PreviewCard colors={darkColors} fonts={fonts} mode="dark" />
      </div>
      <p style={{ color: 'var(--theme-elevation-500)', fontSize: 12, marginTop: 10 }}>
        Live preview updates as you edit. Save to apply changes to the site.
      </p>
    </div>
  )
}
