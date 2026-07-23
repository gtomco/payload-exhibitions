'use client'

import { useRouter } from 'next/navigation'
import React, { useState, useTransition } from 'react'

export function SearchIsland({
  placeholder,
  initialQuery = '',
}: {
  placeholder: string
  initialQuery?: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [pending, startTransition] = useTransition()

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        const next = query.trim()
        startTransition(() => {
          router.push(next ? `/search?q=${encodeURIComponent(next)}` : '/search')
        })
      }}
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
        name="q"
        type="search"
      />
      <button
        type="submit"
        className="rounded-lg bg-[var(--microsite-primary)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        disabled={pending}
      >
        Search
      </button>
    </form>
  )
}
