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

export const FONT_SIZE_VALUES: Record<string, string> = {
  large: '1.125rem',
  medium: '1rem',
  small: '0.9375rem',
  xlarge: '1.25rem',
}

export const FONT_SIZE_OPTIONS = [
  { label: 'Small (15px)', value: 'small' },
  { label: 'Medium (16px, default)', value: 'medium' },
  { label: 'Large (18px)', value: 'large' },
  { label: 'Extra Large (20px)', value: 'xlarge' },
]

export const LINE_HEIGHT_VALUES: Record<string, string> = {
  normal: '1.5',
  relaxed: '1.75',
  tight: '1.3',
}

export const LINE_HEIGHT_OPTIONS = [
  { label: 'Tight', value: 'tight' },
  { label: 'Normal (default)', value: 'normal' },
  { label: 'Relaxed', value: 'relaxed' },
]

export const HEADING_WEIGHT_VALUES: Record<string, string> = {
  bold: '700',
  medium: '500',
  normal: '400',
  semibold: '600',
}

export const HEADING_WEIGHT_OPTIONS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Medium', value: 'medium' },
  { label: 'Semibold (default)', value: 'semibold' },
  { label: 'Bold', value: 'bold' },
]

/**
 * Default color values per mode (hex), approximating the built-in oklch palette
 * in globals.css. Used as field defaults, for seeding, and in the live preview.
 */
export const DEFAULT_LIGHT_COLORS: Record<string, string> = {
  accent: '#f7f7f7',
  accentForeground: '#343434',
  background: '#ffffff',
  border: '#ebebeb',
  card: '#f3f4f6',
  cardForeground: '#252525',
  foreground: '#252525',
  muted: '#f7f7f7',
  mutedForeground: '#8e8e8e',
  primary: '#343434',
  primaryForeground: '#fbfbfb',
  secondary: '#f7f7f7',
  secondaryForeground: '#343434',
}

export const DEFAULT_DARK_COLORS: Record<string, string> = {
  accent: '#434343',
  accentForeground: '#fbfbfb',
  background: '#252525',
  border: '#434343',
  card: '#2a2a2a',
  cardForeground: '#fbfbfb',
  foreground: '#fbfbfb',
  muted: '#434343',
  mutedForeground: '#b5b5b5',
  primary: '#fbfbfb',
  primaryForeground: '#343434',
  secondary: '#434343',
  secondaryForeground: '#fbfbfb',
}
