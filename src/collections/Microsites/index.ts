import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from 'payload'

export const Microsites: CollectionConfig<'microsites'> = {
  slug: 'microsites',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'isActive', 'updatedAt'],
    useAsTitle: 'title',
    description:
      'Each fair brand (e.g. ECGE 2026). Posts, pages and events are assigned to a microsite and appear on that fair’s public site.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Display name',
    },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      label: 'Short description',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: { position: 'sidebar' },
    },
    {
      name: 'devUrl',
      type: 'text',
      label: 'Dev frontend URL',
      admin: {
        description:
          'Public Next.js origin in development. Leave blank to use http://{slug}.{ROOT_DOMAIN} or /m/{slug} locally.',
      },
    },
    {
      name: 'productionUrl',
      type: 'text',
      label: 'Production URL',
      admin: {
        description:
          'Optional override. Leave blank to use https://{slug}.{ROOT_DOMAIN} from env ROOT_DOMAIN.',
      },
    },
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
        description: 'Prefer setting this on Microsite Settings. Fallback if settings doc is missing.',
        components: {
          Field: '@/admin/CrmEventSelect#CrmEventSelectField',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'primaryColor',
          type: 'text',
          label: 'Primary color (fallback)',
          defaultValue: '#1B8C66',
          admin: {
            description: 'Prefer Theme on Microsite Settings. Used only if settings theme is empty.',
          },
        },
        {
          name: 'secondaryColor',
          type: 'text',
          label: 'Secondary color',
          defaultValue: '#F15A27',
        },
        {
          name: 'darkColor',
          type: 'text',
          label: 'Dark color',
          defaultValue: '#161F5E',
        },
      ],
    },
  ],
}
