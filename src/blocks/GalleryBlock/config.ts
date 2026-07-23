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
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional section title above the gallery.',
      },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid (thumbnails → lightbox)', value: 'grid' },
        { label: 'Slideshow (stacked, click to enlarge)', value: 'slideshow' },
      ],
      required: true,
    },
    {
      name: 'autoplaySeconds',
      type: 'number',
      defaultValue: 0,
      admin: {
        condition: (_, siblingData) => siblingData?.style === 'slideshow',
        description: 'Reserved for future autoplay. Leave 0.',
      },
    },
    {
      name: 'slides',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Photo', plural: 'Photos' },
      admin: {
        description:
          'Drag to reorder. Upload via Media — Payload generates thumbnails; the site shows medium thumbs and opens a larger size on click.',
      },
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
            description: 'Optional external URL (opens instead of lightbox when set).',
          },
        },
      ],
    },
  ],
}
