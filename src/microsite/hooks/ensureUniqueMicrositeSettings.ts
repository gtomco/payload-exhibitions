import type { CollectionBeforeValidateHook } from 'payload'

function resolveMicrositeId(value: unknown): string | number | undefined {
  if (value == null || value === '' || value === 0) return undefined
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: string | number }).id
  }
  return value as string | number
}

/** Enforce at most one settings document per microsite (on create). */
export const ensureUniqueMicrositeSettings: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data) return data

  const micrositeId = resolveMicrositeId(data.microsite)
  if (!micrositeId) return data

  const existing = await req.payload.find({
    collection: 'microsite-settings',
    where: {
      microsite: { equals: micrositeId },
    },
    limit: 1,
    depth: 0,
    req,
  })

  if (existing.docs.length > 0) {
    throw new Error('A settings document already exists for this microsite.')
  }

  return data
}
