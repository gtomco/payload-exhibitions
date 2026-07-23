import { test, expect, type Page, request as playwrightRequest } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'
import { uniqueSlug } from '../helpers/fixtures'
import { PayloadApiClient } from '../helpers/payloadApi'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'

async function saveDocument(page: Page) {
  const publish = page.getByRole('button', { name: /^Publish changes$/i })
  const saveDraft = page.getByRole('button', { name: /^Save draft$/i })
  if (await publish.isVisible().catch(() => false)) {
    await publish.click()
  } else if (await saveDraft.isVisible().catch(() => false)) {
    await saveDraft.click()
  } else {
    await page.getByRole('button', { name: /^Save$/i }).first().click()
  }
  await page.waitForURL(/\/admin\/collections\/[^/]+\/\d+/, { timeout: 20000 })
}

async function cleanupViaApi(collection: string, id: string) {
  const ctx = await playwrightRequest.newContext()
  const api = new PayloadApiClient(ctx, PAYLOAD_URL)
  await api.login(testUser.email, testUser.password)
  try {
    await api.delete(collection, id)
  } finally {
    await ctx.dispose()
  }
}

test.describe.configure({ mode: 'serial' })

test.describe('Payload Admin UI — resource CRUD', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test.beforeEach(async ({ page }) => {
    await login({ page, serverURL: PAYLOAD_URL, user: testUser })
  })

  test('categories — create and edit via admin UI', async ({ page }) => {
    const title = `UI Category ${uniqueSlug('cat')}`
    const updatedTitle = `${title} Updated`

    await page.goto(`${PAYLOAD_URL}/admin/collections/categories/create`)
    await page.locator('input[name="title"]').fill(title)
    await saveDocument(page)

    const id = page.url().match(/categories\/(\d+)/)?.[1]
    expect(id).toBeTruthy()

    await page.locator('input[name="title"]').fill(updatedTitle)
    await saveDocument(page)
    await expect(page.locator('input[name="title"]')).toHaveValue(updatedTitle)

    await cleanupViaApi('categories', id!)
  })

  test('microsites — create and edit via admin UI', async ({ page }) => {
    const title = `UI Microsite ${uniqueSlug('ms')}`

    await page.goto(`${PAYLOAD_URL}/admin/collections/microsites/create`)
    await page.locator('input[name="title"]').fill(title)
    await page.locator('textarea[name="description"]').fill('Created from admin UI test')
    await saveDocument(page)

    const id = page.url().match(/microsites\/(\d+)/)?.[1]
    expect(id).toBeTruthy()

    await page.locator('textarea[name="description"]').fill('Updated from admin UI test')
    await saveDocument(page)

    await cleanupViaApi('microsites', id!)
  })

  test('posts — create and edit via admin UI', async ({ page }) => {
    const title = `UI Post ${uniqueSlug('post')}`
    const updated = `${title} Edited`

    await page.goto(`${PAYLOAD_URL}/admin/collections/posts/create`)
    await page.locator('input[name="title"]').fill(title)
    await saveDocument(page)

    const id = page.url().match(/posts\/(\d+)/)?.[1]
    expect(id).toBeTruthy()

    await page.locator('input[name="title"]').fill(updated)
    await saveDocument(page)
    await expect(page.locator('input[name="title"]')).toHaveValue(updated)

    await cleanupViaApi('posts', id!)
  })

  test('pages — create and edit via admin UI', async ({ page }) => {
    const title = `UI Page ${uniqueSlug('page')}`

    await page.goto(`${PAYLOAD_URL}/admin/collections/pages/create`)
    await page.locator('input[name="title"]').fill(title)
    await saveDocument(page)

    const id = page.url().match(/pages\/(\d+)/)?.[1]
    expect(id).toBeTruthy()

    await page.locator('input[name="title"]').fill(`${title} Edited`)
    await saveDocument(page)

    await cleanupViaApi('pages', id!)
  })

  test('ECGE FAQ page is editable in admin after seed', async ({ page, request }) => {
    const ctx = await playwrightRequest.newContext()
    const api = new PayloadApiClient(ctx, PAYLOAD_URL)
    await api.login(testUser.email, testUser.password)

    const pages = await api.find<{ id: number; title?: string; slug?: string }>('pages', {
      where: JSON.stringify({ slug: { equals: 'faq' } }),
      limit: '1',
    })
    await ctx.dispose()

    const faqPage = pages.docs?.[0]
    test.skip(!faqPage, 'ECGE FAQ page not seeded — run npm run seed:ecge first')

    await page.goto(`${PAYLOAD_URL}/admin/collections/pages/${faqPage.id}`)
    await expect(page.locator('input[name="title"]')).toHaveValue(/FAQ/i)

    const updatedTitle = `FAQ ${uniqueSlug('edit')}`
    await page.locator('input[name="title"]').fill(updatedTitle)
    await saveDocument(page)
    await expect(page.locator('input[name="title"]')).toHaveValue(updatedTitle)

    await page.locator('input[name="title"]').fill(String(faqPage.title || 'FAQ'))
    await saveDocument(page)
  })

  test('events — create and edit via admin UI', async ({ page }) => {
    const title = `UI Event ${uniqueSlug('event')}`

    await page.goto(`${PAYLOAD_URL}/admin/collections/events/create`)
    await page.locator('input[name="title"]').fill(title)
    await saveDocument(page)

    const id = page.url().match(/events\/(\d+)/)?.[1]
    expect(id).toBeTruthy()

    await page.locator('input[name="title"]').fill(`${title} Edited`)
    await saveDocument(page)

    await cleanupViaApi('events', id!)
  })

  test('media — upload via admin UI', async ({ page }) => {
    await page.goto(`${PAYLOAD_URL}/admin/collections/media/create`)
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: `${uniqueSlug('ui')}.png`,
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        'base64',
      ),
    })
    await page.locator('input[name="alt"]').fill('UI upload test')
    await saveDocument(page)

    const id = page.url().match(/media\/(\d+)/)?.[1]
    expect(id).toBeTruthy()

    await cleanupViaApi('media', id!)
  })

  test('collection list views are reachable', async ({ page }) => {
    for (const collection of ['posts', 'pages', 'events', 'microsites', 'categories', 'media', 'redirects', 'forms']) {
      await page.goto(`${PAYLOAD_URL}/admin/collections/${collection}`)
      await expect(page).toHaveURL(new RegExp(`/admin/collections/${collection}`))
      await expect(page.locator('h1').first()).toBeVisible()
    }
  })

  test('globals — header and theme are editable', async ({ page }) => {
    await page.goto(`${PAYLOAD_URL}/admin/globals/header`)
    await expect(page.locator('h1')).toContainText(/header/i)

    await page.goto(`${PAYLOAD_URL}/admin/globals/theme`)
    await expect(page.locator('h1')).toContainText(/theme/i)
  })
})
