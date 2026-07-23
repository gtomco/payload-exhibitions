'use client'

import React, { useMemo, useState } from 'react'

type Props = {
  title: string
  subtitle?: string
  startIso?: string | null
  endIso?: string | null
  location?: string | null
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function toIcsDate(date: Date) {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T` +
    `${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  )
}

export function CalendarIsland({ title, subtitle, startIso, endIso, location }: Props) {
  const [open, setOpen] = useState(false)

  const googleUrl = useMemo(() => {
    if (!startIso) return null
    const start = new Date(startIso)
    const end = endIso ? new Date(endIso) : new Date(start.getTime() + 2 * 60 * 60 * 1000)
    const dates = `${toIcsDate(start)}/${toIcsDate(end)}`
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      details: subtitle || '',
      location: location || '',
      dates,
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }, [title, subtitle, startIso, endIso, location])

  const downloadIcs = () => {
    if (!startIso) return
    const start = new Date(startIso)
    const end = endIso ? new Date(endIso) : new Date(start.getTime() + 2 * 60 * 60 * 1000)
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Exhibition Payload//EN',
      'BEGIN:VEVENT',
      `UID:${title.replace(/\s+/g, '-').toLowerCase()}@exhibition`,
      `DTSTAMP:${toIcsDate(new Date())}`,
      `DTSTART:${toIcsDate(start)}`,
      `DTEND:${toIcsDate(end)}`,
      `SUMMARY:${title}`,
      subtitle ? `DESCRIPTION:${subtitle.replace(/\n/g, '\\n')}` : '',
      location ? `LOCATION:${location}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ]
      .filter(Boolean)
      .join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${title.replace(/\s+/g, '-')}.ics`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <button
        type="button"
        className="rounded border border-border px-3 py-2 text-sm font-semibold"
        onClick={() => setOpen((value) => !value)}
      >
        Add to calendar
      </button>
      {open ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {googleUrl ? (
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-[var(--microsite-primary)] px-3 py-2 text-sm font-semibold text-white"
            >
              Google Calendar
            </a>
          ) : null}
          <button
            type="button"
            className="rounded border border-border px-3 py-2 text-sm font-semibold"
            onClick={downloadIcs}
          >
            Download .ics
          </button>
        </div>
      ) : null}
    </div>
  )
}
