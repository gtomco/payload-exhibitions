'use client'

import React, { useEffect, useState } from 'react'

type Area = {
  id?: string
  name?: string
  code?: string
}

type Booth = {
  id?: string
  name?: string
  companyName?: string
  areaId?: string
}

type ExhibitionPayload = {
  areas?: Area[]
  booths?: Booth[]
  error?: string
}

export function FloorMapIsland({ micrositeSlug }: { micrositeSlug: string }) {
  const [data, setData] = useState<ExhibitionPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedArea, setSelectedArea] = useState<string | 'all'>('all')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const response = await fetch(`/api/microsites/${micrositeSlug}/crm/exhibition`, {
          cache: 'no-store',
        })
        const json = (await response.json()) as ExhibitionPayload
        if (!cancelled) setData(json)
      } catch {
        if (!cancelled) setData({ error: 'Failed to load floor data' })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [micrositeSlug])

  const areas = data?.areas || []
  const booths = (data?.booths || []).filter((booth) =>
    selectedArea === 'all' ? true : booth.areaId === selectedArea,
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-xl border border-border p-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Areas</p>
        <div className="mt-3 flex flex-col gap-1">
          <button
            type="button"
            className={`rounded px-2 py-1 text-left text-sm ${selectedArea === 'all' ? 'bg-muted font-semibold' : ''}`}
            onClick={() => setSelectedArea('all')}
          >
            All
          </button>
          {areas.map((area) => (
            <button
              key={area.id || area.code}
              type="button"
              className={`rounded px-2 py-1 text-left text-sm ${
                selectedArea === area.id ? 'bg-muted font-semibold' : ''
              }`}
              onClick={() => setSelectedArea(area.id || 'all')}
            >
              {area.name || area.code || area.id}
            </button>
          ))}
        </div>
      </aside>
      <div className="rounded-xl border border-border p-4">
        {loading ? <p className="text-muted-foreground">Loading floor plan…</p> : null}
        {data?.error ? <p className="text-destructive">{data.error}</p> : null}
        {!loading && !data?.error ? (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {booths.map((booth) => (
              <li key={booth.id} className="rounded-lg border border-border px-3 py-2 text-sm">
                <p className="font-semibold">{booth.companyName || booth.name || booth.id}</p>
                {booth.name && booth.companyName ? (
                  <p className="text-muted-foreground">{booth.name}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
        {!loading && !booths.length && !data?.error ? (
          <p className="text-muted-foreground">No booths available for this filter.</p>
        ) : null}
      </div>
    </div>
  )
}
