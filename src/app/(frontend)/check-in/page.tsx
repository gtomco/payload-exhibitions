import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { CheckInKiosk } from '@/visitors/CheckInKiosk'
import { getRequestMicrosite } from '@/utilities/getRequestMicrosite'
import { generateMicrositeMeta } from '@/utilities/generateMicrositeMeta'

export const dynamic = 'force-dynamic'

export default async function CheckInPage() {
  const microsite = await getRequestMicrosite()
  if (!microsite) notFound()

  return (
    <main className="checkin-page">
      <Suspense fallback={<p>Loading…</p>}>
        <CheckInKiosk micrositeSlug={microsite.microsite.slug} />
      </Suspense>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMicrositeMeta({
    title: 'Entrance check-in',
    description: 'Staff check-in scanner for visitor tickets.',
  })
}
