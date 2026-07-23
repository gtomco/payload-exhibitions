import type { ReactNode } from 'react'
import Link from 'next/link'

export function QuickIcon({ name }: { name: 'globe' | 'pin' | 'calendar' | 'user' | 'search' }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
    width: 18,
    height: 18,
  }

  if (name === 'globe') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15 15 0 0 1 0 20" />
        <path d="M12 2a15 15 0 0 0 0 20" />
      </svg>
    )
  }
  if (name === 'pin') {
    return (
      <svg {...common}>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    )
  }
  if (name === 'calendar') {
    return (
      <svg {...common}>
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M3 10h18" />
      </svg>
    )
  }
  if (name === 'user') {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 22c1.8-4 5-6 8-6s6.2 2 8 6" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function Btn({
  children,
  className = '',
  href,
}: {
  children: ReactNode
  className?: string
  href?: string
}) {
  const classes = `btn ${className}`.trim()
  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={classes}>
      {children}
    </button>
  )
}
