import type { FilterOptionsProps, Where } from 'payload'

import { getActiveMicrositeId } from './getActiveMicrosite'

/** Scope relationship pickers (e.g. related posts) to the active microsite. */
export async function micrositeRelationshipFilter(
  args: FilterOptionsProps,
): Promise<Where | boolean> {
  const micrositeId = await getActiveMicrositeId(args.req)
  if (!micrositeId) return true
  return { microsite: { equals: micrositeId } }
}
