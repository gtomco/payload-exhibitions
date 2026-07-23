import { test, expect, request as playwrightRequest, type APIRequestContext } from '@playwright/test'
import { login } from '../helpers/login'
import { PayloadApiClient, unwrapDoc } from '../helpers/payloadApi'
import { minimalLexical, uniqueSlug } from '../helpers/fixtures'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'
import { ACTIVE_MICROSITE_COOKIE } from '../../src/microsite/constants'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'

test.describe.configure({ mode: 'serial' })

test.describe('Admin microsite context', () => {
  let api: PayloadApiClient
  let apiContext: APIRequestContext
  let ecgeId: number
  let otherMicrositeId: number
  const createdPostIds: number[] = []

  test.beforeAll(async () => {
    await seedTestUser()
    apiContext = await playwrightRequest.newContext()
    api = new PayloadApiClient(apiContext, PAYLOAD_URL)
    await api.login(testUser.email, testUser.password)

    const context = await api.micrositeContext('ecge')
    ecgeId = Number(context.microsite.id)

    const otherSlug = uniqueSlug('ctx-ms')
    const other = unwrapDoc(
      await api.create('microsites', {
        title: 'Context Test Fair',
        slug: otherSlug,
        isActive: true,
      }),
    )
    otherMicrositeId = Number(other.id)
  })

  test.afterAll(async () => {
    for (const id of createdPostIds) {
      try {
        await api.delete('posts', id)
      } catch {
        /* noop */
      }
    }
    try {
      await api.delete('microsites', otherMicrositeId)
    } catch {
      /* noop */
    }
    await apiContext.dispose()
    await cleanupTestUser()
  })

  test('create without microsite uses active context header', async () => {
    const slug = uniqueSlug('ctx-auto-post')
    const created = unwrapDoc(
      await api.createWithContext(
        'posts',
        {
          title: 'Auto-assigned contextual post',
          slug,
          content: minimalLexical('Auto'),
          _status: 'published',
        },
        false,
        ecgeId,
      ),
    )
    createdPostIds.push(Number(created.id))

    const doc = await api.get<{ microsite: number | { id: number } }>('posts', created.id)
    const micrositeId = typeof doc.microsite === 'object' ? doc.microsite?.id : doc.microsite
    expect(Number(micrositeId)).toBe(ecgeId)
  })

  test('admin switcher is visible after login', async ({ page }) => {
    await page.goto(`${PAYLOAD_URL}/admin/login`)
    await page.locator('input[name="email"]').fill(testUser.email)
    await page.locator('input[name="password"]').fill(testUser.password)
    await page.getByRole('button', { name: /^Login$/i }).click()
    await page.waitForURL(/\/admin($|\/)/, { timeout: 20000 })

    await expect(page.locator('#microsite-switcher-select')).toBeVisible()
    await expect(page.getByText(/Microsite context/i)).toBeVisible()
  })

  test('admin cookie scopes posts list to selected microsite', async ({ page }) => {
    const ecgeSlug = uniqueSlug('ui-ecge-post')
    const otherSlug = uniqueSlug('ui-other-post')
    const ecgeTitle = `UI ECGE ${ecgeSlug}`
    const otherTitle = `UI Other ${otherSlug}`

    const ecgePost = unwrapDoc(
      await api.create('posts', {
        title: ecgeTitle,
        slug: ecgeSlug,
        content: minimalLexical('UI ECGE'),
        microsite: ecgeId,
        _status: 'published',
      }),
    )
    createdPostIds.push(Number(ecgePost.id))

    const otherPost = unwrapDoc(
      await api.create('posts', {
        title: otherTitle,
        slug: otherSlug,
        content: minimalLexical('UI Other'),
        microsite: otherMicrositeId,
        _status: 'published',
      }),
    )
    createdPostIds.push(Number(otherPost.id))

    await login({ page, serverURL: PAYLOAD_URL, user: testUser })

    await page.context().addCookies([
      {
        name: ACTIVE_MICROSITE_COOKIE,
        value: String(ecgeId),
        url: PAYLOAD_URL,
      },
    ])

    await page.goto(`${PAYLOAD_URL}/admin/collections/posts`)
    await expect(page.getByText(ecgeTitle)).toBeVisible({ timeout: 20000 })
    await expect(page.getByText(otherTitle)).toHaveCount(0)
  })
})
