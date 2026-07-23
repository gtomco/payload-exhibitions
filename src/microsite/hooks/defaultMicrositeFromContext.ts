import type { CollectionBeforeValidateHook } from 'payload'

import { getActiveMicrositeId } from '../getActiveMicrosite'

function hasMicrositeValue(value: unknown): boolean {
  return value != null && value !== '' && value !== 0
}

function normalizeMicrositeId(value: unknown): string | number | undefined {
  if (!hasMicrositeValue(value)) return undefined
  const asNumber = Number(value)
  return Number.isFinite(asNumber) ? asNumber : (value as string | number)
}

/**
 * Assigns the active admin microsite when creating content.
 * Runs at validate time so relationship checks see the correct microsite.
 */
export const defaultMicrositeFromContext: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data) return data
  if (hasMicrositeValue(data.microsite)) return data

  const next = { ...data }
  delete next.microsite

  const fromContext = await getActiveMicrositeId(req)
  const normalizedContext = normalizeMicrositeId(fromContext)
  if (normalizedContext != null) {
    return { ...next, microsite: normalizedContext }
  }

  const ecge = await req.payload.find({
    collection: 'microsites',
    where: { slug: { equals: 'ecge' } },
    limit: 1,
    depth: 0,
    req,
  })

  const micrositeId = normalizeMicrositeId(ecge.docs[0]?.id)
  if (micrositeId == null) return next

  return { ...next, microsite: micrositeId }
}
