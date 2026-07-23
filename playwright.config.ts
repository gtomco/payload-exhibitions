import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const MICROSITE_URL = process.env.MICROSITE_URL || 'http://localhost:8082'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.e2e.spec.ts',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'payload-api',
      testMatch: [
        '**/api-resources.crud.e2e.spec.ts',
        '**/microsite-context.e2e.spec.ts',
        '**/microsite-crm.e2e.spec.ts',
        '**/admin-microsite-context.e2e.spec.ts',
      ],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: PAYLOAD_URL,
      },
    },
    {
      name: 'payload-admin',
      testMatch: ['**/admin-resources.crud.e2e.spec.ts', '**/admin-microsite-context.e2e.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: PAYLOAD_URL,
      },
    },
    {
      name: 'microsite-frontend',
      testMatch: '**/microsite-frontend.e2e.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: MICROSITE_URL,
      },
    },
  ],
  webServer: [
    {
      command: 'npm run dev:3001',
      url: `${PAYLOAD_URL}/admin`,
      reuseExistingServer: true,
      timeout: 120000,
      env: {
        NEXT_PUBLIC_SERVER_URL: PAYLOAD_URL,
      },
    },
    {
      command: 'npm run dev --prefix ../ecge-fair/web',
      url: MICROSITE_URL,
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
})
