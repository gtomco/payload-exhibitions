import type { Payload } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'
import { resolveMicrositeTheme } from '@/utilities/resolveMicrositeTheme'

import { buildTicketEmailHtml, buildTicketEmailText } from './buildTicketEmail'
import { generateTicketPdf } from './generateTicketPdf'

export type VisitorTicketRecord = {
  id: string | number
  firstName: string
  lastName: string
  email: string
  company?: string | null
  ticketToken: string
  eventTitle?: string | null
  eventDates?: string | null
  eventLocation?: string | null
  microsite?: string | number | { id: string | number; title?: string | null } | null
}

function mediaLocalPath(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as { filename?: string | null; url?: string | null }
  if (m.filename) return `/media/${m.filename}`
  if (m.url?.startsWith('/')) return m.url
  return null
}

export async function sendVisitorTicketEmail({
  payload,
  visitor,
  origin,
}: {
  payload: Payload
  visitor: VisitorTicketRecord
  origin?: string
}): Promise<void> {
  const serverOrigin = (origin || getServerSideURL()).replace(/\/$/, '')
  const qrImageUrl = `${serverOrigin}/api/visitors/ticket/${visitor.ticketToken}/qr`
  const qrPayload = `${serverOrigin}/check-in?t=${visitor.ticketToken}`

  const micrositeId =
    typeof visitor.microsite === 'object' && visitor.microsite
      ? visitor.microsite.id
      : visitor.microsite

  let themeSource: Parameters<typeof resolveMicrositeTheme>[0] = null
  let logo: unknown = null
  let micrositeColors: Parameters<typeof resolveMicrositeTheme>[1] = null
  let brandName = visitor.eventTitle || 'Exhibition'

  if (micrositeId != null) {
    const settingsResult = await payload.find({
      collection: 'microsite-settings',
      where: { microsite: { equals: micrositeId } },
      limit: 1,
      depth: 1,
    })
    const settings = settingsResult.docs[0]
    if (settings) {
      themeSource = settings.theme
      logo = settings.logo
    }

    const micrositeDoc =
      typeof visitor.microsite === 'object' && visitor.microsite?.title
        ? visitor.microsite
        : await payload.findByID({
            collection: 'microsites',
            id: micrositeId,
            depth: 0,
          })

    if (micrositeDoc && typeof micrositeDoc === 'object') {
      brandName = ('title' in micrositeDoc && micrositeDoc.title) || brandName
      const doc = micrositeDoc as {
        primaryColor?: string | null
        secondaryColor?: string | null
        darkColor?: string | null
      }
      micrositeColors = {
        primaryColor: doc.primaryColor,
        secondaryColor: doc.secondaryColor,
        darkColor: doc.darkColor,
      }
    }
  }

  const theme = resolveMicrositeTheme(themeSource, micrositeColors)
  const logoPath = mediaLocalPath(logo) || '/ecge/logo.png'

  const pdf = await generateTicketPdf({
    firstName: visitor.firstName,
    lastName: visitor.lastName,
    company: visitor.company,
    eventTitle: visitor.eventTitle || brandName,
    eventDates: visitor.eventDates || '',
    eventLocation: visitor.eventLocation || '',
    ticketToken: visitor.ticketToken,
    qrPayload,
    theme: {
      primary: theme.primary,
      secondary: theme.secondary,
      dark: theme.dark,
    },
    logoPath,
  })

  const emailArgs = {
    firstName: visitor.firstName,
    eventTitle: visitor.eventTitle || brandName,
    eventDates: visitor.eventDates || '',
    eventLocation: visitor.eventLocation || '',
    qrImageUrl,
    brandName,
  }

  await payload.sendEmail({
    to: visitor.email,
    subject: `Your ticket for ${emailArgs.eventTitle}`,
    html: buildTicketEmailHtml(emailArgs),
    text: buildTicketEmailText(emailArgs),
    attachments: [
      {
        filename: `ticket-${visitor.ticketToken.slice(0, 8)}.pdf`,
        content: pdf,
        contentType: 'application/pdf',
      },
    ],
  })
}
