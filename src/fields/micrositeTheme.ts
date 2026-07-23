import type { Field } from 'payload'

export const MICROSITE_FONT_OPTIONS = [
  'Inter',
  'Arial',
  'Helvetica',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Georgia',
  'Times New Roman',
  'Garamond',
  'Palatino Linotype',
  'Courier New',
  'Lucida Sans',
  'Segoe UI',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Poppins',
  'Lato',
] as const

export const ECGE_DEFAULT_THEME = {
  primary: '#1B8C66',
  secondary: '#F15A27',
  dark: '#161F5E',
  font: 'Inter',
  homeBgStart: '#161F5E',
  homeBgMid: '#1D299B',
  homeBgEnd: '#2DA88C',
  headerBg: '#161F5E',
  calendarBgStart: '#161F5E',
  calendarBgMid: '#1D299B',
  calendarBgEnd: '#1B8C66',
  calendarGlowPrimaryColor: '#32FFC2',
  calendarGlowSecondaryColor: '#F15A27',
} as const

export const micrositeThemeGroup: Field = {
  name: 'theme',
  type: 'group',
  label: 'Theme & branding',
  admin: {
    description:
      'Colors and typography for the public microsite. Applied as CSS variables on every page.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'primary',
          type: 'text',
          label: 'Primary color',
          defaultValue: ECGE_DEFAULT_THEME.primary,
          admin: { description: 'Brand green / sustainability' },
        },
        {
          name: 'secondary',
          type: 'text',
          label: 'Secondary / CTA color',
          defaultValue: ECGE_DEFAULT_THEME.secondary,
        },
        {
          name: 'dark',
          type: 'text',
          label: 'Dark / authority color',
          defaultValue: ECGE_DEFAULT_THEME.dark,
        },
      ],
    },
    {
      name: 'font',
      type: 'select',
      label: 'Body font',
      defaultValue: ECGE_DEFAULT_THEME.font,
      options: MICROSITE_FONT_OPTIONS.map((font) => ({ label: font, value: font })),
    },
    {
      type: 'collapsible',
      label: 'Homepage background gradient',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'homeBgStart', type: 'text', label: 'Start', defaultValue: ECGE_DEFAULT_THEME.homeBgStart },
            { name: 'homeBgMid', type: 'text', label: 'Middle', defaultValue: ECGE_DEFAULT_THEME.homeBgMid },
            { name: 'homeBgEnd', type: 'text', label: 'End', defaultValue: ECGE_DEFAULT_THEME.homeBgEnd },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Header & calendar',
      fields: [
        {
          name: 'headerBg',
          type: 'text',
          label: 'Header / theme-color',
          defaultValue: ECGE_DEFAULT_THEME.headerBg,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'calendarBgStart',
              type: 'text',
              label: 'Calendar bg start',
              defaultValue: ECGE_DEFAULT_THEME.calendarBgStart,
            },
            {
              name: 'calendarBgMid',
              type: 'text',
              label: 'Calendar bg middle',
              defaultValue: ECGE_DEFAULT_THEME.calendarBgMid,
            },
            {
              name: 'calendarBgEnd',
              type: 'text',
              label: 'Calendar bg end',
              defaultValue: ECGE_DEFAULT_THEME.calendarBgEnd,
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'calendarGlowPrimaryColor',
              type: 'text',
              label: 'Calendar mint glow',
              defaultValue: ECGE_DEFAULT_THEME.calendarGlowPrimaryColor,
            },
            {
              name: 'calendarGlowSecondaryColor',
              type: 'text',
              label: 'Calendar coral glow',
              defaultValue: ECGE_DEFAULT_THEME.calendarGlowSecondaryColor,
            },
          ],
        },
      ],
    },
  ],
}
