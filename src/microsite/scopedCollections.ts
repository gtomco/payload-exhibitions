/** Collections whose documents belong to a single microsite. */
export const MICROSITE_SCOPED_COLLECTIONS = [
  'posts',
  'pages',
  'events',
  'visitors',
  'redirects',
  'search',
  'microsite-settings',
] as const

export type MicrositeScopedCollection = (typeof MICROSITE_SCOPED_COLLECTIONS)[number]

export function isMicrositeScopedCollection(slug: string): slug is MicrositeScopedCollection {
  return (MICROSITE_SCOPED_COLLECTIONS as readonly string[]).includes(slug)
}
