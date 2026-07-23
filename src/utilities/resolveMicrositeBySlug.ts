import type { Payload } from 'payload'

export async function resolveMicrositeBySlug(payload: Payload, slug: string) {
  const result = await payload.find({
    collection: 'microsites',
    where: {
      slug: { equals: slug },
      isActive: { equals: true },
    },
    limit: 1,
    depth: 0,
  })

  return result.docs[0] || null
}

export async function resolveCrmEventId(payload: Payload, slug: string): Promise<string | null> {
  const microsite = await resolveMicrositeBySlug(payload, slug)
  if (!microsite) return null

  const settingsResult = await payload.find({
    collection: 'microsite-settings',
    where: { microsite: { equals: microsite.id } },
    limit: 1,
    depth: 0,
  })

  const settingsEventId = settingsResult.docs[0]?.crmEventId?.trim()
  if (settingsEventId) return settingsEventId

  const micrositeEventId = microsite.crmEventId?.trim()
  return micrositeEventId || null
}
