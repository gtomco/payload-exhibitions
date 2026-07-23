import { getPayload } from 'payload'
import config from '@payload-config'

import { fetchCrmAreas, crmAssetsBaseUrl } from '@/utilities/crmClient'
import { micrositeCorsHeaders } from '@/utilities/micrositeCors'
import { resolveCrmEventId } from '@/utilities/resolveMicrositeBySlug'

export async function OPTIONS(request: Request): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: micrositeCorsHeaders(request.headers.get('origin')),
  })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params
  const origin = request.headers.get('origin')

  try {
    const payload = await getPayload({ config })
    const eventId = await resolveCrmEventId(payload, slug)

    if (!eventId) {
      return Response.json(
        {
          error: `Microsite "${slug}" has no CRM event configured.`,
          configured: false,
        },
        { status: 404, headers: micrositeCorsHeaders(origin) },
      )
    }

    const url = new URL(request.url)
    const status = url.searchParams.get('status') || undefined
    const type = url.searchParams.get('type') || undefined
    const availableOnly = url.searchParams.get('available_only') === 'true'
    const drawnOnly = url.searchParams.get('drawn_only') === 'true'

    const areas = await fetchCrmAreas(eventId, {
      status,
      type,
      availableOnly,
      drawnOnly,
    })

    return Response.json(
      {
        configured: true,
        micrositeSlug: slug,
        eventId,
        assetsBaseUrl: crmAssetsBaseUrl(),
        areas,
      },
      { headers: micrositeCorsHeaders(origin, 'public, s-maxage=15, stale-while-revalidate=60') },
    )
  } catch (error) {
    console.error('Microsite CRM areas error:', error)
    return Response.json(
      { error: 'Failed to load CRM areas' },
      { status: 502, headers: micrositeCorsHeaders(origin) },
    )
  }
}
