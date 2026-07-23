import { describe, expect, it } from 'vitest'

import {
  ACTIVE_MICROSITE_COOKIE,
  ACTIVE_MICROSITE_CONTEXT_KEY,
  ACTIVE_MICROSITE_HEADER,
} from '@/microsite/constants'
import {
  micrositeWhere,
  readActiveMicrositeIdFromRequest,
  resolveActiveMicrosite,
} from '@/microsite/getActiveMicrosite'

function mockReq({
  cookie,
  header,
  context,
}: {
  cookie?: string
  header?: string
  context?: Record<string, unknown>
} = {}) {
  const headers = new Headers()
  if (cookie) headers.set('cookie', cookie)
  if (header) headers.set(ACTIVE_MICROSITE_HEADER, header)

  return {
    context: context || {},
    headers,
    payload: {
      find: async () => ({ docs: [{ id: 99, slug: 'ecge' }] }),
    },
  } as any
}

describe('microsite context utilities', () => {
  it('reads active microsite from req.context first', () => {
    const req = mockReq({
      context: { [ACTIVE_MICROSITE_CONTEXT_KEY]: 7 },
      cookie: `${ACTIVE_MICROSITE_COOKIE}=3`,
      header: '5',
    })
    expect(readActiveMicrositeIdFromRequest(req)).toBe(7)
  })

  it('falls back to header then cookie', () => {
    const fromHeader = mockReq({ header: '12' })
    expect(readActiveMicrositeIdFromRequest(fromHeader)).toBe('12')

    const fromCookie = mockReq({ cookie: `${ACTIVE_MICROSITE_COOKIE}=4` })
    expect(readActiveMicrositeIdFromRequest(fromCookie)).toBe('4')
  })

  it('resolves dev default ECGE microsite when unset', async () => {
    const active = await resolveActiveMicrosite(mockReq())
    expect(active).toEqual({ id: 99, source: 'default' })
  })

  it('builds a microsite where clause', () => {
    expect(micrositeWhere(3)).toEqual({ microsite: { equals: 3 } })
  })
})
