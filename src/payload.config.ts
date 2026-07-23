import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Events } from './collections/Events'
import { Microsites } from './collections/Microsites'
import { MicrositeSettings } from './collections/MicrositeSettings'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Visitors } from './collections/Visitors'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { Theme } from './globals/Theme/config'
import { MainSite } from './globals/MainSite/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
      beforeNavLinks: ['@/admin/MicrositeSwitcher'],
      afterNavLinks: ['@/admin/VisitorCheckInLink'],
      views: {
        visitorCheckIn: {
          Component: '@/admin/VisitorCheckIn#VisitorCheckInView',
          path: '/visitor-check-in',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: false,
    prodMigrations: migrations,
  }),
  collections: [
    // Microsite (switcher-scoped) — first group in sidebar
    MicrositeSettings,
    Pages,
    Posts,
    Events,
    Visitors,
    // Platform
    Microsites,
    // Library
    Media,
    Categories,
    // System
    Users,
  ],
  email: await nodemailerAdapter(
    process.env.SMTP_HOST
      ? {
          defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'noreply@example.com',
          defaultFromName: process.env.SMTP_FROM_NAME || 'Exhibitions',
          skipVerify: process.env.SMTP_SKIP_VERIFY === 'true',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth:
              process.env.SMTP_USER && process.env.SMTP_PASS
                ? {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                  }
                : undefined,
          },
        }
      : {
          // Local/dev without SMTP: Ethereal test account (emails not delivered to real inboxes)
          defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'noreply@example.com',
          defaultFromName: process.env.SMTP_FROM_NAME || 'Exhibitions',
          skipVerify: true,
        },
  ),
  cors: [
    getServerSideURL(),
    process.env.NEXT_PUBLIC_SERVER_URL || '',
    process.env.ROOT_DOMAIN
      ? `${process.env.PUBLIC_PROTOCOL === 'http' ? 'http' : 'https'}://${process.env.ROOT_DOMAIN}`
      : '',
    'http://localhost:3002',
    'http://lvh.me:3002',
    'http://lvh.me:3080',
    'http://localhost:8082',
    'http://localhost:8081',
    'http://127.0.0.1:8082',
    'http://127.0.0.1:8081',
  ].filter(Boolean),
  globals: [MainSite, Theme, Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
