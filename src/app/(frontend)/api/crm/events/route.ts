import type { PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import config from '@payload-config'
import { fetchCrmEvents } from '@/utilities/crmClient'

async function requireAdminUser(request: Request) {
  const payload = await getPayload({ config })

  const authResult = await payload.auth({
    req: request as unknown as PayloadRequest,
    headers: request.headers,
  })

  if (!authResult.user) {
    return null
  }

  return authResult.user
}

export async function GET(request: Request): Promise<Response> {
  const user = await requireAdminUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const search = url.searchParams.get('search') || undefined
  const includeClosed = url.searchParams.get('includeClosed') === 'true'
  const limit = Number(url.searchParams.get('limit') || 50)
  const page = Number(url.searchParams.get('page') || 1)

  try {
    const result = await fetchCrmEvents({
      search,
      includeClosed,
      limit: Number.isFinite(limit) ? limit : 50,
      page: Number.isFinite(page) ? page : 1,
    })

    return Response.json(result)
  } catch (error) {
    console.error('CRM events list error:', error)
    return Response.json(
      { error: 'Failed to load events from sales CRM. Check CRM_API_URL is configured.' },
      { status: 502 },
    )
  }
}
