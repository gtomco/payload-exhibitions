import { headers as nextHeaders } from 'next/headers'
import config from '@payload-config'
import { getPayload } from 'payload'

import { PUBLIC_MICROSITE_SLUG_HEADER } from '@/microsite/constants'
import { resolveMicrositeBySlug } from '@/utilities/resolveMicrositeBySlug'
import { parseCheckInCookie, verifyCheckInToken } from '@/visitors/checkInSession'

export async function GET(): Promise<Response> {
  try {
    const payload = await getPayload({ config })
    const headerStore = await nextHeaders()
    const cookieHeader = headerStore.get('cookie')
    const session = verifyCheckInToken(parseCheckInCookie(cookieHeader))

    if (!session) {
      return Response.json({ authenticated: false })
    }

    const slug = headerStore.get(PUBLIC_MICROSITE_SLUG_HEADER)
    if (slug) {
      const microsite = await resolveMicrositeBySlug(payload, slug)
      if (microsite && String(microsite.id) !== String(session.micrositeId)) {
        return Response.json({ authenticated: false })
      }
    }

    return Response.json({
      authenticated: true,
      micrositeId: session.micrositeId,
      exp: session.exp,
    })
  } catch {
    return Response.json({ authenticated: false })
  }
}
