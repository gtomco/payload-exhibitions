import type { Field } from 'payload'

export const micrositeField = (): Field => ({
  name: 'microsite',
  type: 'relationship',
  relationTo: 'microsites',
  required: false,
  admin: {
    position: 'sidebar',
    hidden: true,
    description:
      'Assigned automatically from the microsite switcher in the admin sidebar.',
  },
  index: true,
})
