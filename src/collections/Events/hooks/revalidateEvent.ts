import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Event } from '../../../payload-types'

function micrositeTag(doc: Event): string | null {
  const microsite = doc.microsite
  if (!microsite) return null
  const id = typeof microsite === 'object' ? microsite.id : microsite
  return id ? `microsite:${id}:events` : null
}

export const revalidateEvent: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating event at /events/${doc.slug}`)

      revalidatePath(`/events/${doc.slug}`)
      revalidatePath('/program')
      revalidatePath('/events')
      revalidateTag('events-sitemap', 'max')
      const tag = micrositeTag(doc)
      if (tag) revalidateTag(tag, 'max')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      revalidatePath(`/events/${previousDoc.slug}`)
      revalidatePath('/program')
      revalidateTag('events-sitemap', 'max')
      const tag = micrositeTag(previousDoc)
      if (tag) revalidateTag(tag, 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Event> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/events/${doc?.slug}`)
    revalidatePath('/program')
    revalidateTag('events-sitemap', 'max')
    if (doc) {
      const tag = micrositeTag(doc)
      if (tag) revalidateTag(tag, 'max')
    }
  }

  return doc
}
