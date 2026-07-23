'use client'

import React from 'react'
import Link from 'next/link'
import { useConfig } from '@payloadcms/ui'

export default function VisitorCheckInLink() {
  const { config } = useConfig()
  const adminRoute = config.routes?.admin || '/admin'

  return (
    <div style={{ padding: '0.35rem 0 0.75rem', borderTop: '1px solid var(--theme-elevation-150)' }}>
      <p
        style={{
          margin: '0 0 0.25rem',
          fontSize: '0.7rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--theme-elevation-500)',
        }}
      >
        Tools
      </p>
      <Link
        href={`${adminRoute}/visitor-check-in`}
        style={{
          display: 'block',
          padding: '0.35rem 0',
          textDecoration: 'none',
          color: 'var(--theme-text)',
          fontWeight: 500,
        }}
      >
        Visitor check-in
      </Link>
    </div>
  )
}
