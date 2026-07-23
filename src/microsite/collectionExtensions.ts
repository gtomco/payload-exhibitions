import { micrositeBaseFilter } from './baseFilter'
import { defaultMicrositeFromContext } from './hooks/defaultMicrositeFromContext'
import { setMicrositeContext } from './hooks/setMicrositeContext'

export const micrositeAdminFilter = {
  baseFilter: micrositeBaseFilter,
}

export const micrositeScopedHooks = {
  beforeOperation: [setMicrositeContext],
  beforeValidate: [defaultMicrositeFromContext],
}
