import config from '@payload-config'
import { getPayload } from 'payload'

import { parseCheckInCookie, verifyCheckInToken } from '@/visitors/checkInSession'
import { serializeVisitorPublic } from '@/visitors/registrationContext'

export async function authorizeScanner(
  request: Request,
  visitorMicrositeId: string | number | null | undefined,
): Promise<{ ok: true; actor: string } | { ok: false; status: number; error: string }> {
  const payload = await getPayload({ config })
  const auth = await payload.auth({ headers: request.headers })
  if (auth.user) {
    return { ok: true, actor: String(auth.user.id) }
  }

  const cookieToken = parseCheckInCookie(request.headers.get('cookie'))
  const session = verifyCheckInToken(cookieToken)
  if (!session) {
    return { ok: false, status: 401, error: 'Authentication required' }
  }

  if (
    visitorMicrositeId != null &&
    String(session.micrositeId) !== String(visitorMicrositeId)
  ) {
    return { ok: false, status: 403, error: 'Ticket belongs to another microsite' }
  }

  return { ok: true, actor: 'kiosk' }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
): Promise<Response> {
  const { token } = await params

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'visitors',
      where: { ticketToken: { equals: token } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const visitor = result.docs[0]
    if (!visitor || visitor.status === 'cancelled') {
      return Response.json({ error: 'Ticket not found' }, { status: 404 })
    }

    const micrositeId =
      typeof visitor.microsite === 'object' && visitor.microsite
        ? visitor.microsite.id
        : visitor.microsite

    const auth = await authorizeScanner(request, micrositeId)
    if (!auth.ok) {
      return Response.json({ error: auth.error }, { status: auth.status })
    }

    return Response.json({ visitor: serializeVisitorPublic(visitor) })
  } catch (error) {
    console.error('Ticket lookup error:', error)
    return Response.json({ error: 'Failed to load ticket' }, { status: 500 })
  }
}
