/**
 * Single source of truth for theme tokens.
 * Drives both the Payload field generation (config.ts) and the runtime CSS
 * variable injection (ThemeStyles.tsx), so the two never drift apart.
 */

export type ColorToken = {
  /** CSS custom properties this token maps to */
  cssVars: string[]
  /** Admin UI label */
  label: string
  /** Field name (also the key stored in the DB) */
  name: string
}

export const COLOR_TOKENS: ColorToken[] = [
  { name: 'background', cssVars: ['--background'], label: 'Background' },
  { name: 'foreground', cssVars: ['--foreground'], label: 'Foreground (Text)' },
  { name: 'primary', cssVars: ['--primary'], label: 'Primary' },
  { name: 'primaryForeground', cssVars: ['--primary-foreground'], label: 'Primary Foreground' },
  { name: 'secondary', cssVars: ['--secondary'], label: 'Secondary' },
  {
    name: 'secondaryForeground',
    cssVars: ['--secondary-foreground'],
    label: 'Secondary Foreground',
  },
  { name: 'accent', cssVars: ['--accent'], label: 'Accent' },
  { name: 'accentForeground', cssVars: ['--accent-foreground'], label: 'Accent Foreground' },
  { name: 'muted', cssVars: ['--muted'], label: 'Muted' },
  { name: 'mutedForeground', cssVars: ['--muted-foreground'], label: 'Muted Foreground' },
  { name: 'card', cssVars: ['--card'], label: 'Card' },
  { name: 'cardForeground', cssVars: ['--card-foreground'], label: 'Card Foreground' },
  { name: 'border', cssVars: ['--border', '--input'], label: 'Border / Input' },
]

export const FONT_STACKS: Record<string, string> = {
  geist: 'var(--font-geist-sans)',
  mono: 'var(--font-geist-mono)',
  sans: 'ui-sans-serif, system-ui, sans-serif',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", serif',
}

export const FONT_OPTIONS = [
  { label: 'Geist (default)', value: 'geist' },
  { label: 'System Sans', value: 'sans' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'mono' },
]

export const RADIUS_VALUES: Record<string, string> = {
  large: '1rem',
  medium: '0.625rem',
  none: '0rem',
  small: '0.375rem',
  xlarge: '1.5rem',
}

export const RADIUS_OPTIONS = [
  { label: 'None (square)', value: 'none' },
  { label: 'Small', value: 'small' },
  { label: 'Medium (default)', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Extra Large', value: 'xlarge' },
]
