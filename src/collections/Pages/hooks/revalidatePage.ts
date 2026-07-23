import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'

function micrositeTag(doc: Page): string | null {
  const microsite = doc.microsite
  if (!microsite) return null
  const id = typeof microsite === 'object' ? microsite.id : microsite
  return id ? `microsite:${id}:pages` : null
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/')
      revalidateTag('pages-sitemap', 'max')
      const tag = micrositeTag(doc)
      if (tag) revalidateTag(tag, 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('pages-sitemap', 'max')
      const tag = micrositeTag(previousDoc)
      if (tag) revalidateTag(tag, 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    revalidatePath(path)
    revalidateTag('pages-sitemap', 'max')
    if (doc) {
      const tag = micrositeTag(doc)
      if (tag) revalidateTag(tag, 'max')
    }
  }

  return doc
}
