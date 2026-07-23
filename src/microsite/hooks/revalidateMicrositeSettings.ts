import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { MicrositeSetting } from '../../payload-types'

export const revalidateMicrositeSettings: CollectionAfterChangeHook<MicrositeSetting> = ({
  doc,
  req: { context },
}) => {
  if (context.disableRevalidate) return doc

  revalidatePath('/')
  revalidatePath('/news')
  revalidatePath('/program')
  revalidatePath('/floor')
  revalidatePath('/search')
  revalidateTag('microsite-settings', 'max')

  const microsite = doc.microsite
  const id = microsite && (typeof microsite === 'object' ? microsite.id : microsite)
  if (id) revalidateTag(`microsite:${id}:settings`, 'max')

  return doc
}
