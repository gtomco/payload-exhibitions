import { getPayload } from 'payload'
import config from '@payload-config'
import { getMicrositeContext } from '@/utilities/getMicrositeContext'
import { micrositeCorsHeaders } from '@/utilities/micrositeCors'

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
    let context = await getMicrositeContext(payload, slug)

    if (!context && process.env.NODE_ENV !== 'production') {
      await payload.create({
        collection: 'microsites',
        data: {
          title: slug.toUpperCase() === 'ECGE' ? 'ECGE 2026' : slug,
          slug,
          description: 'Exhibition microsite context',
          isActive: true,
          devUrl: 'http://localhost:8082',
          primaryColor: '#1B8C66',
          secondaryColor: '#F15A27',
          darkColor: '#161F5E',
        },
      })
      context = await getMicrositeContext(payload, slug)
    }

    if (!context) {
      return Response.json(
        { error: `Microsite "${slug}" not found or inactive` },
        { status: 404, headers: micrositeCorsHeaders(origin) },
      )
    }

    return Response.json(context, { headers: micrositeCorsHeaders(origin) })
  } catch (error) {
    console.error('Microsite context error:', error)
    return Response.json(
      { error: 'Failed to load microsite context' },
      { status: 500, headers: micrositeCorsHeaders(origin) },
    )
  }
}
