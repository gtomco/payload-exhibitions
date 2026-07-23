export type CrmFloorPlanRecord = {
  id: string
  event_id?: string
  file_path: string
  file_type?: string
  width?: number | null
  height?: number | null
  file_name?: string
}

export type CrmAreaRecord = {
  id: string
  event_id?: string
  area_number: string
  status: string
  price?: number | string | null
  area_sqm?: number | string | null
  currency?: string | null
  floor_plan_x?: number | null
  floor_plan_y?: number | null
  floor_plan_width?: number | null
  floor_plan_height?: number | null
  floor_plan_polygon?: Array<{ x: number; y: number }> | null
  type_name?: string | null
  type?: string | null
  opportunity_company?: string | null
  opportunity_client_name?: string | null
}

export type CrmFloorPlan = {
  id: string
  filePath: string
  fileType?: string
  width?: number | null
  height?: number | null
  fileName?: string
}

export type CrmArea = {
  id: string
  areaNumber: string
  status: string
  price?: number | null
  areaSqm?: number | null
  currency?: string | null
  floorPlanX?: number | null
  floorPlanY?: number | null
  floorPlanWidth?: number | null
  floorPlanHeight?: number | null
  floorPlanPolygon?: Array<{ x: number; y: number }> | null
  typeName?: string | null
  type?: string | null
  opportunityCompany?: string | null
  opportunityClientName?: string | null
}

export type CrmExhibitionPayload = {
  eventId: string
  assetsBaseUrl: string
  floorPlan: CrmFloorPlan | null
  areas: CrmArea[]
}

function snakeToCamel(key: string) {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

function toCamelCaseRecord<T extends Record<string, unknown>>(obj: Record<string, unknown>): T {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    out[snakeToCamel(key)] = value
  }
  return out as T
}

function normalizeArea(record: CrmAreaRecord): CrmArea {
  const camel = toCamelCaseRecord<CrmArea>(record as unknown as Record<string, unknown>)
  return {
    ...camel,
    areaNumber: record.area_number,
    price: record.price != null ? Number(record.price) : null,
    areaSqm: record.area_sqm != null ? Number(record.area_sqm) : null,
    floorPlanX: record.floor_plan_x,
    floorPlanY: record.floor_plan_y,
    floorPlanWidth: record.floor_plan_width,
    floorPlanHeight: record.floor_plan_height,
    floorPlanPolygon: record.floor_plan_polygon,
    typeName: record.type_name,
    opportunityCompany: record.opportunity_company,
    opportunityClientName: record.opportunity_client_name,
  }
}

function normalizeFloorPlan(record: CrmFloorPlanRecord): CrmFloorPlan {
  return {
    id: String(record.id),
    filePath: record.file_path,
    fileType: record.file_type,
    width: record.width,
    height: record.height,
    fileName: record.file_name,
  }
}

function crmApiBase() {
  const base = process.env.CRM_API_URL || 'http://localhost:8081/api'
  return base.replace(/\/$/, '')
}

export function crmAssetsBaseUrl() {
  return (process.env.CRM_ASSETS_URL || crmApiBase().replace(/\/api$/, '')).replace(/\/$/, '')
}

async function crmFetch<T>(path: string): Promise<T> {
  const url = `${crmApiBase()}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`CRM ${response.status} ${path}${text ? `: ${text.slice(0, 200)}` : ''}`)
  }

  return response.json() as Promise<T>
}

export async function fetchCrmFloorPlan(eventId: string): Promise<CrmFloorPlan | null> {
  try {
    const record = await crmFetch<CrmFloorPlanRecord>(`/events/${eventId}/floor-plan`)
    return normalizeFloorPlan(record)
  } catch (error) {
    if (error instanceof Error && error.message.includes('CRM 404')) return null
    throw error
  }
}

export type ListCrmAreasOptions = {
  status?: string
  type?: string
  availableOnly?: boolean
  drawnOnly?: boolean
}

export async function fetchCrmAreas(
  eventId: string,
  options: ListCrmAreasOptions = {},
): Promise<CrmArea[]> {
  const params = new URLSearchParams()
  if (options.status) params.set('status', options.status)
  if (options.type) params.set('type', options.type)
  if (options.availableOnly) params.set('available_only', 'true')
  if (options.drawnOnly) params.set('drawn_only', 'true')

  const query = params.toString()
  const records = await crmFetch<CrmAreaRecord[]>(
    `/events/${eventId}/areas${query ? `?${query}` : ''}`,
  )

  return records.map(normalizeArea)
}

export async function fetchCrmExhibition(
  eventId: string,
  options: ListCrmAreasOptions = { drawnOnly: true },
): Promise<CrmExhibitionPayload> {
  const [floorPlan, areas] = await Promise.all([
    fetchCrmFloorPlan(eventId),
    fetchCrmAreas(eventId, options),
  ])

  return {
    eventId,
    assetsBaseUrl: crmAssetsBaseUrl(),
    floorPlan,
    areas,
  }
}

export type CrmEventSummary = {
  id: string
  name: string
  location?: string | null
  startDate?: string | null
  endDate?: string | null
  status?: string | null
  isClosed?: boolean | null
}

export type CrmEventsListResult = {
  events: CrmEventSummary[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

function normalizeEvent(record: Record<string, unknown>): CrmEventSummary {
  const camel = toCamelCaseRecord<Record<string, unknown>>(record)
  return {
    id: String(record.id ?? camel.id),
    name: String(record.name ?? camel.name ?? 'Untitled event'),
    location: (record.location as string) ?? (camel.location as string) ?? null,
    startDate: (record.start_date as string) ?? (camel.startDate as string) ?? null,
    endDate: (record.end_date as string) ?? (camel.endDate as string) ?? null,
    status: (record.status as string) ?? (camel.status as string) ?? null,
    isClosed: Boolean(record.is_closed ?? camel.isClosed),
  }
}

export async function fetchCrmEvents(options: {
  search?: string
  includeClosed?: boolean
  limit?: number
  page?: number
} = {}): Promise<CrmEventsListResult> {
  const params = new URLSearchParams()
  params.set('limit', String(options.limit ?? 50))
  params.set('page', String(options.page ?? 1))
  if (options.search?.trim()) params.set('search', options.search.trim())
  if (options.includeClosed) params.set('includeClosed', 'true')

  const body = await crmFetch<{ data: Record<string, unknown>[]; pagination?: CrmEventsListResult['pagination'] }>(
    `/events?${params.toString()}`,
  )

  return {
    events: (body.data || []).map(normalizeEvent),
    pagination: body.pagination,
  }
}

export async function fetchCrmEventById(eventId: string): Promise<CrmEventSummary | null> {
  try {
    const record = await crmFetch<Record<string, unknown>>(`/events/${eventId}`)
    return normalizeEvent(record)
  } catch (error) {
    if (error instanceof Error && error.message.includes('CRM 404')) return null
    throw error
  }
}
