'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useId, useState } from 'react'

import './photo-gallery.scss'

export type PhotoGalleryItem = {
  id?: string
  thumbUrl: string
  fullUrl: string
  alt: string
  caption?: string | null
  width?: number | null
  height?: number | null
}

type Props = {
  items: PhotoGalleryItem[]
  /** grid (default) | slideshow */
  style?: 'grid' | 'slideshow'
  className?: string
}

export function PhotoGallery({ items, style = 'grid', className }: Props) {
  const labelId = useId()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const open = openIndex !== null
  const current = openIndex !== null ? items[openIndex] : null

  const close = useCallback(() => setOpenIndex(null), [])
  const showPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length))
  }, [items.length])
  const showNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i + 1) % items.length))
  }, [items.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close, showPrev, showNext])

  if (!items.length) return null

  return (
    <div className={['photo-gallery', className].filter(Boolean).join(' ')}>
      {style === 'slideshow' ? (
        <div className="photo-gallery__slideshow" role="region" aria-labelledby={labelId}>
          <span id={labelId} className="sr-only">
            Gallery slideshow
          </span>
          {items.map((item, index) => (
            <button
              key={item.id || item.fullUrl + index}
              type="button"
              className="photo-gallery__slide"
              onClick={() => setOpenIndex(index)}
              aria-label={item.caption || item.alt || `Open image ${index + 1}`}
            >
              <Image
                src={item.thumbUrl}
                alt={item.alt}
                width={item.width || 1200}
                height={item.height || 800}
                sizes="100vw"
                className="photo-gallery__img"
              />
              {item.caption ? <span className="photo-gallery__caption">{item.caption}</span> : null}
            </button>
          ))}
        </div>
      ) : (
        <ul className="photo-gallery__grid">
          {items.map((item, index) => (
            <li key={item.id || item.fullUrl + index}>
              <button
                type="button"
                className="photo-gallery__tile"
                onClick={() => setOpenIndex(index)}
                aria-label={item.caption || item.alt || `Open image ${index + 1}`}
              >
                <Image
                  src={item.thumbUrl}
                  alt={item.alt}
                  width={item.width || 900}
                  height={item.height || 675}
                  sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw"
                  className="photo-gallery__img"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && current ? (
        <div
          className="photo-gallery__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || current.alt || 'Image preview'}
          onClick={close}
        >
          <button type="button" className="photo-gallery__close" onClick={close} aria-label="Close">
            ×
          </button>
          {items.length > 1 ? (
            <>
              <button
                type="button"
                className="photo-gallery__nav photo-gallery__nav--prev"
                onClick={(e) => {
                  e.stopPropagation()
                  showPrev()
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                className="photo-gallery__nav photo-gallery__nav--next"
                onClick={(e) => {
                  e.stopPropagation()
                  showNext()
                }}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          ) : null}
          <figure
            className="photo-gallery__figure"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.fullUrl} alt={current.alt} className="photo-gallery__full" />
            {current.caption ? <figcaption>{current.caption}</figcaption> : null}
          </figure>
        </div>
      ) : null}
    </div>
  )
}
