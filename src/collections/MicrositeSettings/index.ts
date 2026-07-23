import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { micrositeField } from '../../fields/microsite'
import { micrositeBaseFilter } from '../../microsite/baseFilter'
import { defaultMicrositeFromContext } from '../../microsite/hooks/defaultMicrositeFromContext'
import { ensureUniqueMicrositeSettings } from '../../microsite/hooks/ensureUniqueMicrositeSettings'
import { revalidateMicrositeSettings } from '../../microsite/hooks/revalidateMicrositeSettings'
import { setMicrositeContext } from '../../microsite/hooks/setMicrositeContext'
import { micrositeRelationshipFilter } from '../../microsite/relationshipFilter'
import { micrositeThemeGroup } from '../../fields/micrositeTheme'

/**
 * Per-microsite site settings (1 doc per fair).
 * Replaces singleton globals for fair-specific contact copy and hero text.
 */
export const MicrositeSettings: CollectionConfig<'microsite-settings'> = {
  slug: 'microsite-settings',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    baseFilter: micrositeBaseFilter,
    defaultColumns: ['label', 'crmEventName', 'microsite', 'contactEmail', 'updatedAt'],
    description:
      'One settings document per microsite — contact details and hero/footer copy for the public fair site.',
    group: 'Microsite',
    useAsTitle: 'label',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Admin label, e.g. "ECGE 2026 site settings".',
      },
    },
    micrositeField(),
    {
      name: 'crmEventName',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'crmEventId',
      type: 'text',
      label: 'CRM exhibition event',
      admin: {
        description: 'Search and select the sales-CRM event that supplies booths and floor plans.',
        components: {
          Field: '@/admin/CrmEventSelect#CrmEventSelectField',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'contactEmail',
          type: 'email',
          label: 'Contact email',
        },
        {
          name: 'contactPhone',
          type: 'text',
          label: 'Contact phone',
        },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Address',
    },
    {
      name: 'heroEyebrow',
      type: 'text',
      label: 'Hero eyebrow',
      admin: {
        description: 'Small line above the hero headline.',
      },
    },
    {
      name: 'heroTitle',
      type: 'text',
      label: 'Hero title override',
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      label: 'Hero subtitle override',
    },
    {
      name: 'footerNote',
      type: 'textarea',
      label: 'Footer note',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Microsite logo',
      admin: {
        description: 'Used on visitor PDF tickets and email branding. Prefer a transparent PNG.',
      },
    },
    {
      name: 'checkInPin',
      type: 'text',
      label: 'Entrance check-in PIN',
      admin: {
        description:
          '4–8 digit PIN for the public /check-in kiosk. Leave empty to disable kiosk check-in.',
      },
      validate: (value: unknown) => {
        if (value == null || value === '') return true
        const pin = String(value).trim()
        if (!/^\d{4,8}$/.test(pin)) return 'PIN must be 4–8 digits'
        return true
      },
    },
    micrositeThemeGroup,
    {
      name: 'navigation',
      type: 'array',
      label: 'Main navigation',
      admin: {
        description:
          'Mega-menu groups for the public microsite. Lead and item links must pick existing pages in this microsite.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          admin: {
            description: 'Stable id, e.g. about, visit, exhibit.',
          },
        },
        {
          type: 'row',
          fields: [
            { name: 'titleSq', type: 'text', label: 'Group title (SQ)', required: true },
            { name: 'titleEn', type: 'text', label: 'Group title (EN)', required: true },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'leadSq', type: 'text', label: 'Lead link label (SQ)', required: true },
            { name: 'leadEn', type: 'text', label: 'Lead link label (EN)', required: true },
          ],
        },
        {
          name: 'leadPage',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
          filterOptions: micrositeRelationshipFilter,
          admin: {
            description: 'Page opened when the group lead is clicked.',
          },
        },
        {
          name: 'items',
          type: 'array',
          label: 'Menu items',
          fields: [
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              required: true,
              filterOptions: micrositeRelationshipFilter,
              admin: {
                description: 'Select an existing page in this microsite.',
              },
            },
            {
              type: 'row',
              fields: [
                { name: 'labelSq', type: 'text', label: 'Label (SQ)', required: true },
                { name: 'labelEn', type: 'text', label: 'Label (EN)', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeOperation: [setMicrositeContext],
    beforeValidate: [defaultMicrositeFromContext, ensureUniqueMicrositeSettings],
    afterChange: [revalidateMicrositeSettings],
  },
}
