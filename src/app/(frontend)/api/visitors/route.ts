import type { Where } from 'payload'
import { headers as nextHeaders } from 'next/headers'
import config from '@payload-config'
import { getPayload } from 'payload'
import { randomUUID } from 'crypto'

import { PUBLIC_MICROSITE_SLUG_HEADER } from '@/microsite/constants'
import { getServerSideURL } from '@/utilities/getURL'
import { micrositeCorsHeaders } from '@/utilities/micrositeCors'
import { loadMicrositeRegistrationContext } from '@/visitors/registrationContext'

export async function OPTIONS(request: Request): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: micrositeCorsHeaders(request.headers.get('origin')),
  })
}

type Body = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
  country?: string
}

function trim(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get('origin')
  const cors = micrositeCorsHeaders(origin)

  try {
    const payload = await getPayload({ config })
    const headerStore = await nextHeaders()
    const body = (await request.json().catch(() => ({}))) as Body & { micrositeSlug?: string }
    const slug =
      headerStore.get(PUBLIC_MICROSITE_SLUG_HEADER) ||
      new URL(request.url).searchParams.get('microsite') ||
      (typeof body.micrositeSlug === 'string' ? body.micrositeSlug.trim() : '') ||
      ''

    if (!slug) {
      return Response.json(
        { error: 'Microsite context required. Register from a microsite host.' },
        { status: 400, headers: cors },
      )
    }

    const ctx = await loadMicrositeRegistrationContext(payload, slug)
    if (!ctx) {
      return Response.json({ error: 'Microsite not found' }, { status: 404, headers: cors })
    }

    const firstName = trim(body.firstName)
    const lastName = trim(body.lastName)
    const email = trim(body.email).toLowerCase()
    const phone = trim(body.phone)
    const company = trim(body.company)
    const jobTitle = trim(body.jobTitle)
    const country = trim(body.country)

    if (!firstName || !lastName || !email) {
      return Response.json(
        { error: 'firstName, lastName, and email are required' },
        { status: 400, headers: cors },
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email' }, { status: 400, headers: cors })
    }

    const duplicateClauses: Where[] = [
      { email: { equals: email } },
      { microsite: { equals: ctx.microsite.id } },
      { status: { not_equals: 'cancelled' } },
    ]
    if (ctx.crmEventId) {
      duplicateClauses.push({ crmEventId: { equals: ctx.crmEventId } })
    }

    const existing = await payload.find({
      collection: 'visitors',
      where: { and: duplicateClauses },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.docs[0]) {
      return Response.json(
        {
          error: 'You are already registered for this event with this email.',
          code: 'duplicate',
        },
        { status: 409, headers: cors },
      )
    }

    const publicOrigin =
      request.headers.get('x-microsite-origin') ||
      origin ||
      getServerSideURL()

    const visitor = await payload.create({
      collection: 'visitors',
      overrideAccess: true,
      context: {
        skipVisitorEmail: false,
        publicOrigin: publicOrigin.replace(/\/$/, ''),
      },
      data: {
        microsite: ctx.microsite.id,
        crmEventId: ctx.crmEventId || undefined,
        crmEventName: ctx.crmEventName || undefined,
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        company: company || undefined,
        jobTitle: jobTitle || undefined,
        country: country || undefined,
        ticketToken: randomUUID(),
        status: 'registered',
        eventTitle: ctx.eventTitle,
        eventDates: ctx.eventDates || undefined,
        eventLocation: ctx.eventLocation || undefined,
      },
    })

    return Response.json(
      {
        ok: true,
        id: visitor.id,
        email: visitor.email,
        eventTitle: visitor.eventTitle,
        message: 'Registration successful. Check your email for your ticket and QR code.',
      },
      { status: 201, headers: cors },
    )
  } catch (error) {
    console.error('Visitor registration error:', error)
    return Response.json(
      { error: 'Failed to register visitor' },
      { status: 500, headers: cors },
    )
  }
}
