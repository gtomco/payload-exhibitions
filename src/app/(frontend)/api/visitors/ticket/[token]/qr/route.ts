import config from '@payload-config'
import { getPayload } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'
import { generateQrPngBuffer } from '@/visitors/generateQrPng'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
): Promise<Response> {
  const { token } = await params
  if (!token) {
    return new Response('Not found', { status: 404 })
  }

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
      return new Response('Not found', { status: 404 })
    }

    const origin = getServerSideURL().replace(/\/$/, '')
    const qrPayload = `${origin}/check-in?t=${visitor.ticketToken}`
    const png = await generateQrPngBuffer(qrPayload)

    return new Response(new Uint8Array(png), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (error) {
    console.error('QR generation error:', error)
    return new Response('Failed to generate QR', { status: 500 })
  }
}
