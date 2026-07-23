import { test, expect, request as playwrightRequest, type APIRequestContext } from '@playwright/test'
import { PayloadApiClient, unwrapDoc } from '../helpers/payloadApi'
import { minimalLexical, uniqueSlug } from '../helpers/fixtures'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const MICROSITE_SLUG = 'ecge'

test.describe.configure({ mode: 'serial' })

test.describe('Microsite context API', () => {
  let api: PayloadApiClient
  let apiContext: APIRequestContext
  let ecgeId: number
  let testPostId: number | null = null

  test.beforeAll(async () => {
    await seedTestUser()
    apiContext = await playwrightRequest.newContext()
    api = new PayloadApiClient(apiContext, PAYLOAD_URL)
    await api.login(testUser.email, testUser.password)

    const context = await api.micrositeContext(MICROSITE_SLUG)
    ecgeId = Number(context.microsite.id)
  })

  test.afterAll(async () => {
    if (testPostId) {
      try {
        await api.delete('posts', testPostId)
      } catch {
        /* noop */
      }
    }
    await apiContext.dispose()
    await cleanupTestUser()
  })

  test('returns ECGE microsite metadata and settings slot', async () => {
    const context = await api.micrositeContext(MICROSITE_SLUG)
    expect(context.microsite.slug).toBe(MICROSITE_SLUG)
    expect(context.microsite.title).toContain('ECGE')
    expect(context.microsite.theme?.primaryColor).toBeTruthy()
    expect(context).toHaveProperty('settings')
  })

  test('includes microsite settings when configured', async () => {
    let settingsId: number | null = null
    try {
      const created = unwrapDoc(
        await api.create('microsite-settings', {
          label: 'ECGE test settings',
          microsite: ecgeId,
          contactEmail: 'info@ecge.test',
          heroTitle: 'Welcome to ECGE',
        }),
      )
      settingsId = Number(created.id)

      const context = await api.micrositeContext(MICROSITE_SLUG)
      expect(context.settings?.contactEmail).toBe('info@ecge.test')
      expect(context.settings?.heroTitle).toBe('Welcome to ECGE')
    } finally {
      if (settingsId) {
        await api.delete('microsite-settings', settingsId)
      }
    }
  })

  test('isolates posts by microsite context', async () => {
    const otherSlug = uniqueSlug('other-ms')
    const otherMs = unwrapDoc(
      await api.create('microsites', {
        title: 'Other Fair',
        slug: otherSlug,
        isActive: true,
      }),
    )

    const ecgeSlug = uniqueSlug('ecge-post')
    const otherPostSlug = uniqueSlug('other-post')

    const ecgePost = unwrapDoc(
      await api.create('posts', {
        title: 'ECGE scoped post',
        slug: ecgeSlug,
        content: minimalLexical('ECGE only'),
        microsite: ecgeId,
        _status: 'published',
      }),
    )
    testPostId = ecgePost.id

    const otherPost = unwrapDoc(
      await api.create('posts', {
        title: 'Other microsite post',
        slug: otherPostSlug,
        content: minimalLexical('Other only'),
        microsite: otherMs.id,
        _status: 'published',
      }),
    )

    const ecgeContext = await api.micrositeContext(MICROSITE_SLUG)
    const ecgePostIds = ecgeContext.posts.map((p: { id: number }) => p.id)
    expect(ecgePostIds).toContain(ecgePost.id)
    expect(ecgePostIds).not.toContain(otherPost.id)

    const otherContext = await api.micrositeContext(otherSlug)
    const otherPostIds = otherContext.posts.map((p: { id: number }) => p.id)
    expect(otherPostIds).toContain(otherPost.id)
    expect(otherPostIds).not.toContain(ecgePost.id)

    await api.delete('posts', otherPost.id)
    await api.delete('microsites', otherMs.id)
  })

  test('CORS preflight for microsite frontend origin', async () => {
    const corsContext = await playwrightRequest.newContext()
    const response = await corsContext.fetch(`${PAYLOAD_URL}/api/microsites/${MICROSITE_SLUG}/context`, {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:8082' },
    })
    expect(response.status()).toBe(204)
    expect(response.headers()['access-control-allow-origin']).toBe('http://localhost:8082')
    await corsContext.dispose()
  })
})
