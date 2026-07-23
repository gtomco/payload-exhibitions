'use client'

import { useConfig } from '@payloadcms/ui'
import React, { useCallback, useEffect, useState } from 'react'

import { ACTIVE_MICROSITE_COOKIE, DEFAULT_MICROSITE_SLUG } from '@/microsite/constants'

import './index.scss'

type MicrositeOption = {
  id: string | number
  slug: string
  title: string
}

function readCookie(): string {
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ACTIVE_MICROSITE_COOKIE}=`))
  if (!match) return ''
  const value = match.slice(ACTIVE_MICROSITE_COOKIE.length + 1)
  return value ? decodeURIComponent(value) : ''
}

function writeCookie(id: string | number | '') {
  if (!id) {
    document.cookie = `${ACTIVE_MICROSITE_COOKIE}=; path=/; max-age=0; samesite=lax`
    return
  }
  document.cookie = `${ACTIVE_MICROSITE_COOKIE}=${encodeURIComponent(String(id))}; path=/; max-age=31536000; samesite=lax`
}

const MicrositeSwitcher: React.FC = () => {
  const {
    config: {
      routes: { api },
    },
  } = useConfig()
  const [options, setOptions] = useState<MicrositeOption[]>([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const response = await fetch(
          `${api}/microsites?limit=100&depth=0&where[isActive][equals]=true&sort=title`,
        )
        const data = await response.json()
        if (cancelled) return

        const docs: MicrositeOption[] = (data.docs || []).map(
          (doc: { id: string | number; slug: string; title: string }) => ({
            id: doc.id,
            slug: doc.slug,
            title: doc.title,
          }),
        )
        setOptions(docs)

        const fromCookie = readCookie()
        if (fromCookie) {
          setSelected(fromCookie)
          return
        }

        const ecge = docs.find((doc) => doc.slug === DEFAULT_MICROSITE_SLUG)
        if (ecge) {
          const id = String(ecge.id)
          setSelected(id)
          writeCookie(ecge.id)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [api])

  const onChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSelected(value)
    writeCookie(value)
    window.location.reload()
  }, [])

  if (loading) return null

  const active = options.find((opt) => String(opt.id) === selected)

  return (
    <div className="microsite-switcher">
      <label className="microsite-switcher__label" htmlFor="microsite-switcher-select">
        Microsite context
      </label>
      <select
        className="microsite-switcher__select"
        id="microsite-switcher-select"
        onChange={onChange}
        value={selected}
      >
        <option value="">All microsites</option>
        {options.map((opt) => (
          <option key={String(opt.id)} value={String(opt.id)}>
            {opt.title}
          </option>
        ))}
      </select>
      {active ? (
        <p className="microsite-switcher__hint">
          Managing <strong>{active.title}</strong> — new posts, pages and events are assigned here.
        </p>
      ) : (
        <p className="microsite-switcher__hint">Showing content from every microsite.</p>
      )}
    </div>
  )
}

export default MicrositeSwitcher
