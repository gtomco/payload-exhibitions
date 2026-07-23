'use client'

import type { TextFieldClientProps } from 'payload'

import { FieldLabel, useField } from '@payloadcms/ui'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import './index.scss'

type CrmEventOption = {
  id: string
  name: string
  location?: string | null
  startDate?: string | null
  endDate?: string | null
}

function formatEventMeta(event: CrmEventOption) {
  const parts = [event.location, event.startDate?.slice(0, 10)].filter(Boolean)
  return parts.join(' · ')
}

export const CrmEventSelectField: React.FC<TextFieldClientProps> = ({ field, path }) => {
  const namePath = path?.includes('crmEventId')
    ? path.replace('crmEventId', 'crmEventName')
    : 'crmEventName'

  const { value: eventId, setValue: setEventId } = useField<string>({ path })
  const { value: eventName, setValue: setEventName } = useField<string>({
    path: namePath,
  })

  const label = typeof field?.label === 'string' ? field.label : 'CRM exhibition event'
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState<CrmEventOption[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  const selected = useMemo(() => {
    if (!eventId) return null
    const match = options.find((option) => option.id === eventId)
    if (match) return match
    if (eventName) {
      return { id: eventId, name: eventName, location: null, startDate: null, endDate: null }
    }
    return { id: eventId, name: eventId, location: null, startDate: null, endDate: null }
  }, [eventId, eventName, options])

  const loadEvents = useCallback(async (term: string) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ limit: '50', includeClosed: 'true' })
      if (term.trim()) params.set('search', term.trim())
      const response = await fetch(`/api/crm/events?${params.toString()}`, {
        credentials: 'include',
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || `Request failed (${response.status})`)
      }
      const body = await response.json()
      setOptions(body.events || [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load CRM events')
      setOptions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadEvents('')
  }, [loadEvents])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => {
      void loadEvents(search)
    }, 250)
    return () => window.clearTimeout(timer)
  }, [loadEvents, open, search])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const pick = (option: CrmEventOption) => {
    setEventId(option.id)
    setEventName(option.name)
    setSearch('')
    setOpen(false)
  }

  const clear = () => {
    setEventId('')
    setEventName('')
    setSearch('')
  }

  return (
    <div className="field-type crm-event-select" ref={rootRef}>
      <FieldLabel label={label} path={path} />
      <p className="crm-event-select__help">
        Link this microsite to an exhibition event in sales CRM (floor plan, booths, booking).
      </p>

      {selected ? (
        <div className="crm-event-select__selected">
          <div>
            <strong>{selected.name}</strong>
            {formatEventMeta(selected) ? <span>{formatEventMeta(selected)}</span> : null}
            <em>{selected.id}</em>
          </div>
          <button type="button" onClick={clear}>
            Clear
          </button>
        </div>
      ) : null}

      <div className="crm-event-select__control">
        <input
          type="search"
          placeholder='Search events, e.g. "Energy 2026"'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onFocus={() => setOpen(true)}
          aria-expanded={open}
          aria-controls={`${path}-crm-event-list`}
        />
        {loading ? <span className="crm-event-select__status">Loading…</span> : null}
      </div>

      {error ? <p className="crm-event-select__error">{error}</p> : null}

      {open ? (
        <ul className="crm-event-select__list" id={`${path}-crm-event-list`} role="listbox">
          {options.map((option) => (
            <li key={option.id}>
              <button type="button" onClick={() => pick(option)} role="option">
                <strong>{option.name}</strong>
                {formatEventMeta(option) ? <span>{formatEventMeta(option)}</span> : null}
              </button>
            </li>
          ))}
          {!loading && !options.length ? (
            <li className="crm-event-select__empty">No events found. Try another search.</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  )
}
