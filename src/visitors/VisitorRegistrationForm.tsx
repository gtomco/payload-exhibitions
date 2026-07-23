'use client'

import React, { useState } from 'react'

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  country: string
}

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  country: '',
}

export function VisitorRegistrationForm({
  eventTitle,
  eventDates,
  eventLocation,
  micrositeSlug,
}: {
  eventTitle?: string | null
  eventDates?: string | null
  eventLocation?: string | null
  micrositeSlug?: string | null
}) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const url = micrositeSlug
        ? `/api/visitors?microsite=${encodeURIComponent(micrositeSlug)}`
        : '/api/visitors'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json()) as { error?: string; message?: string }

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Registration failed')
        return
      }

      setStatus('success')
      setMessage(data.message || 'Check your email for your ticket.')
      setForm(EMPTY)
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="visitor-reg visitor-reg--success">
        <h2>You&apos;re registered</h2>
        <p>{message}</p>
        <p className="visitor-reg__hint">
          Open the email on your phone at the entrance and show the QR code to staff.
        </p>
        <button type="button" className="visitor-reg__submit" onClick={() => setStatus('idle')}>
          Register another visitor
        </button>
      </div>
    )
  }

  return (
    <div className="visitor-reg">
      {(eventTitle || eventDates || eventLocation) && (
        <aside className="visitor-reg__event">
          {eventTitle ? <p className="visitor-reg__event-title">{eventTitle}</p> : null}
          {eventDates ? <p>{eventDates}</p> : null}
          {eventLocation ? <p>{eventLocation}</p> : null}
        </aside>
      )}

      <form className="visitor-reg__form" onSubmit={onSubmit}>
        <div className="visitor-reg__row">
          <label>
            First name *
            <input
              required
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
            />
          </label>
          <label>
            Last name *
            <input
              required
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
            />
          </label>
        </div>
        <label>
          Email *
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </label>
        <div className="visitor-reg__row">
          <label>
            Phone
            <input
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </label>
          <label>
            Company
            <input
              autoComplete="organization"
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
            />
          </label>
        </div>
        <div className="visitor-reg__row">
          <label>
            Job title
            <input value={form.jobTitle} onChange={(e) => update('jobTitle', e.target.value)} />
          </label>
          <label>
            Country
            <input
              autoComplete="country-name"
              value={form.country}
              onChange={(e) => update('country', e.target.value)}
            />
          </label>
        </div>

        {status === 'error' ? <p className="visitor-reg__error">{message}</p> : null}

        <button className="visitor-reg__submit" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting…' : 'Get your ticket'}
        </button>
      </form>
    </div>
  )
}
