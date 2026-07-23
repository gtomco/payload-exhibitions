import React from 'react'

import type { GalleryBlock as GalleryBlockProps, Media } from '@/payload-types'
import { PhotoGallery, type PhotoGalleryItem } from '@/components/PhotoGallery'
import { mediaAlt, mediaSizeUrl } from '@/utilities/mediaSizes'

export const GalleryBlock: React.FC<
  GalleryBlockProps & {
    disableInnerContainer?: boolean
  }
> = ({ style, slides, heading }) => {
  if (!slides?.length) return null

  const items: PhotoGalleryItem[] = []
  const linked: Array<{ item: PhotoGalleryItem; href: string }> = []

  slides.forEach((slide, index) => {
    const image = slide.image
    if (!image || typeof image !== 'object') return
    const media = image as Media
    const thumbUrl = mediaSizeUrl(media, ['medium', 'small', 'large'])
    const fullUrl = mediaSizeUrl(media, ['xlarge', 'large', 'medium'])
    if (!thumbUrl || !fullUrl) return

    const item: PhotoGalleryItem = {
      id: slide.id || String(index),
      thumbUrl,
      fullUrl,
      alt: mediaAlt(media, slide.caption || `Gallery image ${index + 1}`),
      caption: slide.caption,
      width: media.sizes?.medium?.width || media.width,
      height: media.sizes?.medium?.height || media.height,
    }

    if (slide.link) {
      linked.push({ item, href: slide.link })
    } else {
      items.push(item)
    }
  })

  if (!items.length && !linked.length) return null

  return (
    <section className="container">
      {heading ? <h2 className="mb-6 text-2xl font-semibold">{heading}</h2> : null}
      {linked.length ? (
        <ul className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 list-none p-0 m-0">
          {linked.map(({ item, href }) => (
            <li key={item.id}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.thumbUrl} alt={item.alt} className="w-full h-auto" />
                {item.caption ? <span className="mt-2 block text-sm opacity-75">{item.caption}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {items.length ? <PhotoGallery items={items} style={style === 'slideshow' ? 'slideshow' : 'grid'} /> : null}
    </section>
  )
}
