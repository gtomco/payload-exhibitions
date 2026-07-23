import { describe, expect, it } from 'vitest'

import {
  hostMatchesUrl,
  hostnameFrom,
  publicOriginForMicrosite,
  slugHintFromHostname,
} from '@/utilities/resolveMicrositeByHost'

describe('resolveMicrositeByHost helpers', () => {
  it('extracts hostname from host header and urls', () => {
    expect(hostnameFrom('ecge.example.com:443')).toBe('ecge.example.com')
    expect(hostnameFrom('https://ecge.example.com/path')).toBe('ecge.example.com')
  })

  it('matches host against configured microsite urls', () => {
    expect(hostMatchesUrl('ecge.example.com', 'https://ecge.example.com')).toBe(true)
    expect(hostMatchesUrl('other.example.com', 'https://ecge.example.com')).toBe(false)
  })

  it('derives slug hints from subdomains', () => {
    expect(slugHintFromHostname('ecge.example.com')).toBe('ecge')
    expect(slugHintFromHostname('www.example.com')).toBeNull()
    expect(slugHintFromHostname('example.com')).toBeNull()
    expect(slugHintFromHostname('i-exhibitions.com')).toBeNull()
    expect(slugHintFromHostname('localhost')).toBeNull()
  })

  it('builds a public origin from microsite urls', () => {
    expect(
      publicOriginForMicrosite(
        {
          slug: 'ecge',
          productionUrl: 'https://ecge.example.com/',
          devUrl: 'http://localhost:3000',
        },
        'ignored.example.com',
      ),
    ).toMatch(/^https?:\/\/(ecge\.example\.com|localhost:3000)/)
  })
})
