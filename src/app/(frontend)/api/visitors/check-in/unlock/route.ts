import { headers as nextHeaders } from 'next/headers'
import config from '@payload-config'
import { getPayload } from 'payload'

import { PUBLIC_MICROSITE_SLUG_HEADER } from '@/microsite/constants'
import { resolveMicrositeBySlug } from '@/utilities/resolveMicrositeBySlug'
import { createCheckInToken } from '@/visitors/checkInSession'
import { VISITOR_CHECKIN_COOKIE, VISITOR_CHECKIN_TTL_SECONDS } from '@/visitors/constants'

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = await getPayload({ config })
    const body = (await request.json()) as { pin?: string; micrositeSlug?: string }
    const pin = typeof body.pin === 'string' ? body.pin.trim() : ''

    const headerStore = await nextHeaders()
    const slug =
      (typeof body.micrositeSlug === 'string' && body.micrositeSlug.trim()) ||
      headerStore.get(PUBLIC_MICROSITE_SLUG_HEADER) ||
      ''

    if (!slug) {
      return Response.json({ error: 'Microsite required' }, { status: 400 })
    }
    if (!/^\d{4,8}$/.test(pin)) {
      return Response.json({ error: 'Invalid PIN format' }, { status: 400 })
    }

    const microsite = await resolveMicrositeBySlug(payload, slug)
    if (!microsite) {
      return Response.json({ error: 'Microsite not found' }, { status: 404 })
    }

    const settingsResult = await payload.find({
      collection: 'microsite-settings',
      where: { microsite: { equals: microsite.id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const settings = settingsResult.docs[0]
    const expected = settings?.checkInPin?.trim()

    if (!expected) {
      return Response.json(
        { error: 'Kiosk check-in is not configured for this microsite' },
        { status: 403 },
      )
    }

    if (expected !== pin) {
      return Response.json({ error: 'Incorrect PIN' }, { status: 401 })
    }

    const token = createCheckInToken(microsite.id)
    const secure = process.env.PUBLIC_PROTOCOL === 'https' || process.env.NODE_ENV === 'production'
    const cookie = [
      `${VISITOR_CHECKIN_COOKIE}=${encodeURIComponent(token)}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      `Max-Age=${VISITOR_CHECKIN_TTL_SECONDS}`,
      secure ? 'Secure' : '',
    ]
      .filter(Boolean)
      .join('; ')

    return Response.json(
      { ok: true, microsite: { id: microsite.id, slug: microsite.slug, title: microsite.title } },
      { status: 200, headers: { 'Set-Cookie': cookie } },
    )
  } catch (error) {
    console.error('Kiosk unlock error:', error)
    return Response.json({ error: 'Failed to unlock check-in' }, { status: 500 })
  }
}

export async function DELETE(): Promise<Response> {
  const cookie = `${VISITOR_CHECKIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  return Response.json({ ok: true }, { status: 200, headers: { 'Set-Cookie': cookie } })
}
