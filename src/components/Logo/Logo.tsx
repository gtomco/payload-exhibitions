import clsx from 'clsx'
import React from 'react'

interface Props {
  alt?: string
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  /** Custom logo URL from the Theme global */
  src?: string
  /** Optional dark-mode logo URL from the Theme global */
  srcDark?: string
}

const DEFAULT_LOGO =
  'https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-logo-light.svg'

export const Logo = (props: Props) => {
  const {
    alt = 'Logo',
    className,
    loading: loadingFromProps,
    priority: priorityFromProps,
    src,
    srcDark,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  // No custom logo configured: render the default Payload SVG (inverted for dark mode).
  if (!src) {
    return (
      /* eslint-disable @next/next/no-img-element */
      <img
        alt="Payload Logo"
        className={clsx('max-w-[9.375rem] w-full h-[34px] invert dark:invert-0', className)}
        decoding="async"
        fetchPriority={priority}
        height={34}
        loading={loading}
        src={DEFAULT_LOGO}
        width={193}
      />
    )
  }

  // Custom logo(s) configured. If a dark variant exists, swap by color mode.
  return (
    <>
      <img
        alt={alt}
        className={clsx(
          'max-w-[9.375rem] w-full h-[34px] object-contain',
          srcDark && 'dark:hidden',
          className,
        )}
        decoding="async"
        fetchPriority={priority}
        loading={loading}
        src={src}
      />
      {srcDark ? (
        <img
          alt={alt}
          className={clsx(
            'max-w-[9.375rem] w-full h-[34px] object-contain hidden dark:block',
            className,
          )}
          decoding="async"
          fetchPriority={priority}
          loading={loading}
          src={srcDark}
        />
      ) : null}
    </>
  )
}
