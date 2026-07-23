import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

function micrositeTag(doc: Post): string | null {
  const microsite = doc.microsite
  if (!microsite) return null
  const id = typeof microsite === 'object' ? microsite.id : microsite
  return id ? `microsite:${id}:posts` : null
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating post at /posts/${doc.slug} and /news/${doc.slug}`)

      revalidatePath(`/posts/${doc.slug}`)
      revalidatePath(`/news/${doc.slug}`)
      revalidatePath('/news')
      revalidatePath('/')
      revalidatePath('/sitemap.xml')
      const tag = micrositeTag(doc)
      if (tag) revalidateTag(tag, 'max')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      revalidatePath(`/posts/${previousDoc.slug}`)
      revalidatePath(`/news/${previousDoc.slug}`)
      revalidatePath('/news')
      revalidatePath('/sitemap.xml')
      const tag = micrositeTag(previousDoc)
      if (tag) revalidateTag(tag, 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/posts/${doc?.slug}`)
    revalidatePath(`/news/${doc?.slug}`)
    revalidatePath('/news')
    revalidatePath('/sitemap.xml')
    if (doc) {
      const tag = micrositeTag(doc)
      if (tag) revalidateTag(tag, 'max')
    }
  }

  return doc
}
