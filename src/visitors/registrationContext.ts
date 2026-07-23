import type { Payload } from 'payload'

import { fetchCrmEventById } from '@/utilities/crmClient'
import { resolveCrmEventId, resolveMicrositeBySlug } from '@/utilities/resolveMicrositeBySlug'
import { formatEventDates } from '@/visitors/formatEventDates'

export async function loadMicrositeRegistrationContext(payload: Payload, slug: string) {
  const microsite = await resolveMicrositeBySlug(payload, slug)
  if (!microsite) return null

  const settingsResult = await payload.find({
    collection: 'microsite-settings',
    where: { microsite: { equals: microsite.id } },
    limit: 1,
    depth: 1,
  })
  const settings = settingsResult.docs[0] || null
  const crmEventId =
    settings?.crmEventId?.trim() ||
    microsite.crmEventId?.trim() ||
    (await resolveCrmEventId(payload, slug))

  let crmEvent = null as Awaited<ReturnType<typeof fetchCrmEventById>>
  if (crmEventId) {
    try {
      crmEvent = await fetchCrmEventById(crmEventId)
    } catch {
      crmEvent = null
    }
  }

  const eventTitle =
    crmEvent?.name || settings?.crmEventName || microsite.crmEventName || microsite.title
  const eventDates = formatEventDates(crmEvent?.startDate, crmEvent?.endDate)
  const eventLocation = crmEvent?.location || settings?.address || ''

  return {
    microsite,
    settings,
    crmEventId: crmEventId || null,
    crmEventName: crmEvent?.name || settings?.crmEventName || microsite.crmEventName || null,
    eventTitle,
    eventDates,
    eventLocation,
  }
}

export function serializeVisitorPublic(doc: {
  id: string | number
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  company?: string | null
  jobTitle?: string | null
  country?: string | null
  status: string
  checkedInAt?: string | null
  eventTitle?: string | null
  eventDates?: string | null
  eventLocation?: string | null
  crmEventName?: string | null
  ticketToken: string
}) {
  return {
    id: doc.id,
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    phone: doc.phone ?? null,
    company: doc.company ?? null,
    jobTitle: doc.jobTitle ?? null,
    country: doc.country ?? null,
    status: doc.status,
    checkedInAt: doc.checkedInAt ?? null,
    eventTitle: doc.eventTitle ?? null,
    eventDates: doc.eventDates ?? null,
    eventLocation: doc.eventLocation ?? null,
    crmEventName: doc.crmEventName ?? null,
    ticketToken: doc.ticketToken,
  }
}
