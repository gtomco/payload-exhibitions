import React from 'react'

import type { GalleryBlock as GalleryBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

export const GalleryBlock: React.FC<GalleryBlockProps> = ({ style, slides }) => {
  if (!slides?.length) return null

  if (style === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {slides.map((slide, index) => {
          const image = slide.image
          if (!image || typeof image !== 'object') return null
          return (
            <figure key={index} className="overflow-hidden rounded-lg">
              <Media resource={image} />
              {slide.caption ? <figcaption className="mt-2 text-sm">{slide.caption}</figcaption> : null}
            </figure>
          )
        })}
      </div>
    )
  }

  return (
    <div className="gallery-slideshow">
      {slides.map((slide, index) => {
        const image = slide.image
        if (!image || typeof image !== 'object') return null
        return (
          <figure key={index} className="gallery-slide">
            <Media resource={image} />
            {slide.caption ? <figcaption>{slide.caption}</figcaption> : null}
          </figure>
        )
      })}
    </div>
  )
}
