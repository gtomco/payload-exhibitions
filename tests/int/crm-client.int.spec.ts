import { describe, expect, it } from 'vitest'

import { fetchCrmAreas, fetchCrmFloorPlan } from '@/utilities/crmClient'

describe('crmClient', () => {
  it('exports fetch helpers', () => {
    expect(typeof fetchCrmFloorPlan).toBe('function')
    expect(typeof fetchCrmAreas).toBe('function')
  })
})
