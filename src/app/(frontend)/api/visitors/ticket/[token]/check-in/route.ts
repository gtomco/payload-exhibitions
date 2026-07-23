import config from '@payload-config'
import { getPayload } from 'payload'

import { authorizeScanner } from '../route'
import { serializeVisitorPublic } from '@/visitors/registrationContext'

export async function POST(
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

    if (visitor.status === 'checked_in') {
      return Response.json({
        ok: true,
        alreadyCheckedIn: true,
        visitor: serializeVisitorPublic(visitor),
      })
    }

    const updated = await payload.update({
      collection: 'visitors',
      id: visitor.id,
      overrideAccess: true,
      context: { skipVisitorEmail: true },
      data: {
        status: 'checked_in',
        checkedInAt: new Date().toISOString(),
        checkedInBy: auth.actor,
      },
    })

    return Response.json({
      ok: true,
      alreadyCheckedIn: false,
      visitor: serializeVisitorPublic(updated),
    })
  } catch (error) {
    console.error('Check-in error:', error)
    return Response.json({ error: 'Failed to check in visitor' }, { status: 500 })
  }
}
