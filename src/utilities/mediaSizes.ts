import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type SizeName = 'thumbnail' | 'square' | 'small' | 'medium' | 'large' | 'xlarge' | 'og'

export function mediaSizeUrl(
  resource: Media | number | null | undefined,
  preferred: SizeName | SizeName[],
): string | null {
  if (!resource || typeof resource !== 'object') return null
  const prefs = Array.isArray(preferred) ? preferred : [preferred]
  for (const name of prefs) {
    const sized = resource.sizes?.[name]?.url
    if (sized) return getMediaUrl(sized)
  }
  return resource.url ? getMediaUrl(resource.url) : null
}

export function mediaAlt(resource: Media | number | null | undefined, fallback = ''): string {
  if (!resource || typeof resource !== 'object') return fallback
  return resource.alt || fallback
}
