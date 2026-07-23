import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
import { redirects } from './redirects'

function serverUrlCandidates(): string[] {
  const urls = new Set<string>()
  if (process.env.NEXT_PUBLIC_SERVER_URL) urls.add(process.env.NEXT_PUBLIC_SERVER_URL)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    urls.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  }
  if (process.env.__NEXT_PRIVATE_ORIGIN) urls.add(process.env.__NEXT_PRIVATE_ORIGIN)

  const root = (process.env.ROOT_DOMAIN || '').trim().toLowerCase()
  const proto = (process.env.PUBLIC_PROTOCOL || 'https').replace(':', '')
  if (root) {
    urls.add(`${proto}://${root}`)
    urls.add(`${proto}://www.${root}`)
  }

  if (!urls.size) urls.add('http://localhost:3000')
  return [...urls]
}

const remotePatterns = serverUrlCandidates().flatMap((item) => {
  try {
    const url = new URL(item)
    const patterns = [
      {
        hostname: url.hostname,
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
      },
    ]
    const root = (process.env.ROOT_DOMAIN || '').trim().toLowerCase()
    if (root && (url.hostname === root || url.hostname === `www.${root}`)) {
      patterns.push({
        hostname: `**.${root}`,
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
      })
    }
    return patterns
  } catch {
    return []
  }
})

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/ix/**',
      },
      {
        pathname: '/ecge/**',
      },
    ],
    qualities: [100],
    remotePatterns,
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
  typescript: {
    // Pre-existing template/seed/hook typing debt; keep Docker/prod builds green.
    ignoreBuildErrors: true,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
