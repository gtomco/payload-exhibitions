'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

type PublicVisitor = {
  id: string | number
  firstName: string
  lastName: string
  email: string
  company?: string | null
  jobTitle?: string | null
  status: string
  checkedInAt?: string | null
  eventTitle?: string | null
  eventDates?: string | null
  eventLocation?: string | null
  ticketToken: string
}

function extractToken(raw: string): string {
  const trimmed = raw.trim()
  try {
    const url = new URL(trimmed)
    const t = url.searchParams.get('t')
    if (t) return t
  } catch {
    // not a URL
  }
  const match = trimmed.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
  return match?.[0] || trimmed
}

export function CheckInScanner({
  credentials = 'include',
  initialToken,
}: {
  credentials?: RequestCredentials
  initialToken?: string | null
}) {
  const [manual, setManual] = useState(initialToken || '')
  const [visitor, setVisitor] = useState<PublicVisitor | null>(null)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const [scanning, setScanning] = useState(false)
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null)
  const regionId = 'visitor-qr-reader'
  const didAutoLookup = useRef(false)

  const lookup = useCallback(
    async (raw: string) => {
      const token = extractToken(raw)
      if (!token) return
      setBusy(true)
      setError('')
      setInfo('')
      setVisitor(null)
      try {
        const res = await fetch(`/api/visitors/ticket/${encodeURIComponent(token)}`, {
          credentials,
        })
        const data = (await res.json()) as { visitor?: PublicVisitor; error?: string }
        if (!res.ok) {
          setError(data.error || 'Ticket not found')
          return
        }
        setVisitor(data.visitor || null)
      } catch {
        setError('Lookup failed')
      } finally {
        setBusy(false)
      }
    },
    [credentials],
  )

  const checkIn = useCallback(async () => {
    if (!visitor) return
    setBusy(true)
    setError('')
    setInfo('')
    try {
      const res = await fetch(
        `/api/visitors/ticket/${encodeURIComponent(visitor.ticketToken)}/check-in`,
        { method: 'POST', credentials },
      )
      const data = (await res.json()) as {
        visitor?: PublicVisitor
        error?: string
        alreadyCheckedIn?: boolean
      }
      if (!res.ok) {
        setError(data.error || 'Check-in failed')
        return
      }
      setVisitor(data.visitor || visitor)
      setInfo(data.alreadyCheckedIn ? 'Already checked in' : 'Checked in successfully')
    } catch {
      setError('Check-in failed')
    } finally {
      setBusy(false)
    }
  }, [credentials, visitor])

  useEffect(() => {
    return () => {
      void scannerRef.current?.stop().catch(() => undefined)
    }
  }, [])

  useEffect(() => {
    if (!initialToken || didAutoLookup.current) return
    didAutoLookup.current = true
    void lookup(initialToken)
  }, [initialToken, lookup])

  async function startScan() {
    setError('')
    setScanning(true)
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode(regionId)
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 8, qrbox: { width: 240, height: 240 } },
        (decoded) => {
          void lookup(decoded)
          void scanner.stop().then(() => {
            scannerRef.current = null
            setScanning(false)
          })
        },
        () => undefined,
      )
    } catch {
      setScanning(false)
      setError('Camera unavailable. Paste the ticket code instead.')
    }
  }

  async function stopScan() {
    try {
      await scannerRef.current?.stop()
    } catch {
      // ignore
    }
    scannerRef.current = null
    setScanning(false)
  }

  return (
    <div className="checkin-scanner">
      <div className="checkin-scanner__controls">
        {!scanning ? (
          <button type="button" onClick={() => void startScan()} disabled={busy}>
            Scan QR with camera
          </button>
        ) : (
          <button type="button" onClick={() => void stopScan()}>
            Stop camera
          </button>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void lookup(manual)
          }}
        >
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="Paste ticket token or URL"
            aria-label="Ticket token"
          />
          <button type="submit" disabled={busy || !manual.trim()}>
            Look up
          </button>
        </form>
      </div>

      <div id={regionId} className="checkin-scanner__camera" hidden={!scanning} />

      {error ? <p className="checkin-scanner__error">{error}</p> : null}
      {info ? <p className="checkin-scanner__info">{info}</p> : null}

      {visitor ? (
        <div
          className={`checkin-scanner__card checkin-scanner__card--${visitor.status}`}
        >
          <h2>
            {visitor.firstName} {visitor.lastName}
          </h2>
          {visitor.company ? <p>{visitor.company}</p> : null}
          {visitor.jobTitle ? <p>{visitor.jobTitle}</p> : null}
          <p>{visitor.email}</p>
          <dl>
            <div>
              <dt>Event</dt>
              <dd>{visitor.eventTitle || '—'}</dd>
            </div>
            <div>
              <dt>Dates</dt>
              <dd>{visitor.eventDates || '—'}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{visitor.status.replace('_', ' ')}</dd>
            </div>
          </dl>
          {visitor.status !== 'checked_in' ? (
            <button type="button" onClick={() => void checkIn()} disabled={busy}>
              Check in
            </button>
          ) : (
            <p className="checkin-scanner__done">
              Checked in
              {visitor.checkedInAt
                ? ` · ${new Date(visitor.checkedInAt).toLocaleString()}`
                : ''}
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
