'use client'

import React from 'react'
import Link from 'next/link'
import { useConfig } from '@payloadcms/ui'

export default function VisitorCheckInLink() {
  const { config } = useConfig()
  const adminRoute = config.routes?.admin || '/admin'

  return (
    <Link
      href={`${adminRoute}/visitor-check-in`}
      style={{
        display: 'block',
        padding: '0.5rem 0',
        textDecoration: 'none',
        color: 'var(--theme-text)',
        fontWeight: 500,
      }}
    >
      Visitor check-in
    </Link>
  )
}
