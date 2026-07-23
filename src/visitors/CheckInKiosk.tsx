'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { CheckInScanner } from '@/visitors/CheckInScanner'

export function CheckInKiosk({ micrositeSlug }: { micrositeSlug: string }) {
  const searchParams = useSearchParams()
  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const preticket = searchParams.get('t')

  useEffect(() => {
    void fetch('/api/visitors/check-in/session', { credentials: 'include' })
      .then((res) => res.json())
      .then((data: { authenticated?: boolean }) => {
        setAuthenticated(Boolean(data.authenticated))
      })
      .catch(() => setAuthenticated(false))
  }, [])

  async function unlock(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/visitors/check-in/unlock', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, micrositeSlug }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error || 'Unlock failed')
        return
      }
      setAuthenticated(true)
    } catch {
      setError('Unlock failed')
    } finally {
      setBusy(false)
    }
  }

  async function lock() {
    await fetch('/api/visitors/check-in/unlock', { method: 'DELETE', credentials: 'include' })
    setAuthenticated(false)
  }

  if (authenticated === null) {
    return <p className="checkin-kiosk__loading">Loading…</p>
  }

  if (!authenticated) {
    return (
      <div className="checkin-kiosk">
        <h1>Entrance check-in</h1>
        <p>Enter the staff PIN for this fair to unlock the scanner.</p>
        <form className="checkin-kiosk__pin" onSubmit={(e) => void unlock(e)}>
          <input
            type="password"
            inputMode="numeric"
            pattern="\d{4,8}"
            maxLength={8}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            autoFocus
            required
          />
          <button type="submit" disabled={busy}>
            Unlock
          </button>
        </form>
        {error ? <p className="checkin-scanner__error">{error}</p> : null}
      </div>
    )
  }

  return (
    <div className="checkin-kiosk">
      <header className="checkin-kiosk__header">
        <h1>Entrance check-in</h1>
        <button type="button" onClick={() => void lock()}>
          Lock
        </button>
      </header>
      <CheckInScanner initialToken={preticket} />
    </div>
  )
}
