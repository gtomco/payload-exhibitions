import type { BaseFilter } from 'payload'

import { getActiveMicrositeId } from './getActiveMicrosite'
import { micrositeWhere } from './getActiveMicrosite'

/**
 * Restrict admin list views (and Lexical internal links) to the active microsite.
 * When no microsite is selected, returns null (show all).
 */
export const micrositeBaseFilter: BaseFilter = async ({ req }) => {
  const micrositeId = await getActiveMicrositeId(req)
  if (!micrositeId) return null
  return micrositeWhere(micrositeId)
}
