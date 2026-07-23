import type { Field, GlobalConfig } from 'payload'

import { colorField } from '@/fields/colorPicker'
import { revalidateTheme } from './hooks/revalidateTheme'
import {
  COLOR_TOKENS,
  DEFAULT_DARK_COLORS,
  DEFAULT_LIGHT_COLORS,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  HEADING_WEIGHT_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  RADIUS_OPTIONS,
} from './tokens'

const colorGroup = (mode: 'dark' | 'light'): Field => {
  const defaults = mode === 'dark' ? DEFAULT_DARK_COLORS : DEFAULT_LIGHT_COLORS

  return {
    name: mode === 'dark' ? 'darkColors' : 'lightColors',
    type: 'group',
    admin: { width: '50%' },
    fields: COLOR_TOKENS.map((token) =>
      colorField({ name: token.name, defaultValue: defaults[token.name], label: token.label }),
    ),
    label: mode === 'dark' ? 'Dark Mode' : 'Light Mode',
  }
}

export const Theme: GlobalConfig = {
  slug: 'theme',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Configure the look and feel of the site — colors, typography, branding and shape.',
    group: 'Platform',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          description: 'Branding, default appearance and shape.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  admin: { description: 'Primary logo, shown in the header.', width: '50%' },
                  relationTo: 'media',
                },
                {
                  name: 'logoDark',
                  type: 'upload',
                  admin: { description: 'Optional alternate logo for dark mode.', width: '50%' },
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'defaultMode',
              type: 'select',
              admin: {
                description: 'The color mode new visitors see first.',
              },
              defaultValue: 'light',
              options: [
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
                { label: 'Follow system preference', value: 'system' },
              ],
            },
            {
              name: 'radius',
              type: 'select',
              admin: {
                description: 'Corner rounding applied to buttons, cards and inputs.',
              },
              defaultValue: 'medium',
              label: 'Corner radius',
              options: RADIUS_OPTIONS,
            },
            {
              name: 'stickyHeader',
              type: 'checkbox',
              admin: {
                description: 'Keep the header pinned to the top while scrolling.',
              },
              defaultValue: false,
            },
            {
              name: 'heroDarkOverlay',
              type: 'checkbox',
              admin: {
                description:
                  'Render image heroes (home & posts) in dark mode with white text. Turn off to follow the page theme colors instead.',
              },
              defaultValue: true,
              label: 'Dark overlay on image heroes',
            },
          ],
        },
        {
          label: 'Typography',
          description: 'Fonts and text sizing applied across the site.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'fontSans',
                  type: 'select',
                  admin: { width: '50%' },
                  defaultValue: 'geist',
                  label: 'Body font',
                  options: FONT_OPTIONS,
                },
                {
                  name: 'fontHeading',
                  type: 'select',
                  admin: { width: '50%' },
                  defaultValue: 'geist',
                  label: 'Heading font',
                  options: FONT_OPTIONS,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'fontMono',
                  type: 'select',
                  admin: { width: '50%' },
                  defaultValue: 'mono',
                  label: 'Monospace font',
                  options: FONT_OPTIONS,
                },
                {
                  name: 'headingWeight',
                  type: 'select',
                  admin: { width: '50%' },
                  defaultValue: 'semibold',
                  label: 'Heading weight',
                  options: HEADING_WEIGHT_OPTIONS,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'baseFontSize',
                  type: 'select',
                  admin: { width: '50%' },
                  defaultValue: 'medium',
                  label: 'Base font size',
                  options: FONT_SIZE_OPTIONS,
                },
                {
                  name: 'lineHeight',
                  type: 'select',
                  admin: { width: '50%' },
                  defaultValue: 'normal',
                  label: 'Body line height',
                  options: LINE_HEIGHT_OPTIONS,
                },
              ],
            },
          ],
        },
        {
          label: 'Colors',
          description:
            'Colors for light and dark mode. Leave a field blank to use the built-in default.',
          fields: [
            {
              type: 'row',
              fields: [colorGroup('light'), colorGroup('dark')],
            },
          ],
        },
        {
          label: 'Preview',
          description: 'A live preview of your current theme settings.',
          fields: [
            {
              name: 'preview',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/globals/Theme/ThemePreview.client#ThemePreview',
                },
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateTheme],
  },
}
