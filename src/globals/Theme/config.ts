import type { Field, GlobalConfig } from 'payload'

import { colorField } from '@/fields/colorPicker'
import { revalidateTheme } from './hooks/revalidateTheme'
import { COLOR_TOKENS, FONT_OPTIONS, RADIUS_OPTIONS } from './tokens'

const colorFields: Field[] = COLOR_TOKENS.map((token) =>
  colorField({ name: token.name, label: token.label }),
)

export const Theme: GlobalConfig = {
  slug: 'theme',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Configure the look and feel of the site. Leave color fields blank to use the built-in defaults.',
    group: 'Site Settings',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          description: 'Branding, fonts, shape and default appearance.',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              admin: {
                description: 'Primary logo, shown in the header.',
              },
              relationTo: 'media',
            },
            {
              name: 'logoDark',
              type: 'upload',
              admin: {
                description: 'Optional alternate logo used in dark mode.',
              },
              relationTo: 'media',
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
                  name: 'fontMono',
                  type: 'select',
                  admin: { width: '50%' },
                  defaultValue: 'mono',
                  label: 'Monospace font',
                  options: FONT_OPTIONS,
                },
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
          ],
        },
        {
          name: 'lightColors',
          label: 'Light Mode Colors',
          description: 'Colors used when the site is in light mode.',
          fields: colorFields,
        },
        {
          name: 'darkColors',
          label: 'Dark Mode Colors',
          description: 'Colors used when the site is in dark mode.',
          fields: colorFields,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateTheme],
  },
}
