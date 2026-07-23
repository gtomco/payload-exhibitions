import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    plural: 'Galleries',
    singular: 'Gallery',
  },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'slideshow',
      options: [
        { label: 'Slideshow', value: 'slideshow' },
        { label: 'Grid', value: 'grid' },
      ],
      required: true,
    },
    {
      name: 'autoplaySeconds',
      type: 'number',
      defaultValue: 5,
      admin: {
        condition: (_, siblingData) => siblingData?.style === 'slideshow',
        description: 'Seconds between slides. Set to 0 to disable autoplay.',
      },
    },
    {
      name: 'slides',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional URL when the slide is clicked.',
          },
        },
      ],
    },
  ],
}
