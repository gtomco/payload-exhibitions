import type { CollectionBeforeOperationHook } from 'payload'

import { ACTIVE_MICROSITE_CONTEXT_KEY } from '../constants'
import { readActiveMicrositeIdFromRequest } from '../getActiveMicrosite'

/** Copies cookie/header microsite selection onto `req.context` for hooks and filters. */
export const setMicrositeContext: CollectionBeforeOperationHook = async ({ req }) => {
  const activeMicrositeId = readActiveMicrositeIdFromRequest(req)
  if (activeMicrositeId !== undefined) {
    req.context[ACTIVE_MICROSITE_CONTEXT_KEY] = activeMicrositeId
  }
}

// Payload collection hooks are collection-generic; cast at call sites when needed.
export const setMicrositeContextHook = setMicrositeContext as CollectionBeforeOperationHook

