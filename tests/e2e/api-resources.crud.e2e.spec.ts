import { test, expect, request as playwrightRequest, type APIRequestContext } from '@playwright/test'
import { PayloadApiClient, unwrapDoc } from '../helpers/payloadApi'
import {
  minimalLexical,
  minimalPageLayout,
  uniqueSlug,
  TINY_PNG,
} from '../helpers/fixtures'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const MICROSITE_SLUG = 'ecge'

test.describe.configure({ mode: 'serial' })

test.describe('Payload REST API — full resource CRUD', () => {
  let api: PayloadApiClient
  let apiContext: APIRequestContext
  let ecgeMicrositeId: number
  const created: Array<{ collection: string; id: string | number }> = []

  test.beforeAll(async () => {
    await seedTestUser()
    apiContext = await playwrightRequest.newContext()
    api = new PayloadApiClient(apiContext, PAYLOAD_URL)
    await api.login(testUser.email, testUser.password)
    await api.me()

    const context = await api.micrositeContext(MICROSITE_SLUG)
    ecgeMicrositeId = Number(context.microsite.id)
    expect(ecgeMicrositeId).toBeGreaterThan(0)
  })

  test.afterAll(async () => {
    for (const item of [...created].reverse()) {
      try {
        await api.delete(item.collection, item.id)
      } catch {
        // already removed in-test
      }
    }
    await apiContext.dispose()
    await cleanupTestUser()
  })

  test('auth — login, me, reject unauthenticated create', async () => {
    const anonContext = await playwrightRequest.newContext()
    const response = await anonContext.post(`${PAYLOAD_URL}/api/posts`, {
      data: { title: 'Should fail' },
    })
    expect(response.status()).toBeGreaterThanOrEqual(400)
    await anonContext.dispose()
    await api.me()
  })

  test('microsites — create, read, update, delete', async () => {
    const slug = uniqueSlug('test-ms')
    const createdMs = unwrapDoc(
      await api.create('microsites', {
        title: 'Test Microsite',
        slug,
        description: 'Automated test microsite',
        isActive: true,
        devUrl: 'http://localhost:8082',
        primaryColor: '#1B8C66',
      }),
    )
    const id = createdMs.id
    created.push({ collection: 'microsites', id })

    const fetched = await api.get<typeof createdMs>('microsites', id)
    expect(fetched.slug).toBe(slug)

    const updated = unwrapDoc(
      await api.update('microsites', id, { description: 'Updated by test' }),
    )
    expect(updated.description).toBe('Updated by test')

    await api.delete('microsites', id)
    created.pop()
  })

  test('categories — create, read, update, delete', async () => {
    const slug = uniqueSlug('test-cat')
    const doc = unwrapDoc(
      await api.create('categories', {
        title: 'Test Category',
        slug,
      }),
    )
    created.push({ collection: 'categories', id: doc.id })

    const fetched = await api.get('categories', doc.id)
    expect(fetched.title).toBe('Test Category')

    const updated = unwrapDoc(
      await api.update('categories', doc.id, { title: 'Updated Category' }),
    )
    expect(updated.title).toBe('Updated Category')

    await api.delete('categories', doc.id)
    created.pop()
  })

  test('posts — create, read, update, publish, delete (scoped to ECGE microsite)', async () => {
    const slug = uniqueSlug('test-post')
    const doc = unwrapDoc(
      await api.create('posts', {
        title: 'Automated Test Post',
        slug,
        content: minimalLexical('Initial post body from API test.'),
        microsite: ecgeMicrositeId,
        _status: 'published',
      }),
    )
    created.push({ collection: 'posts', id: doc.id })

    const fetched = await api.get('posts', doc.id)
    expect(fetched.title).toBe('Automated Test Post')
    expect(fetched.slug).toBe(slug)

    const updated = unwrapDoc(
      await api.update('posts', doc.id, {
        title: 'Updated Test Post',
        content: minimalLexical('Updated post body from API test.'),
      }),
    )
    expect(updated.title).toBe('Updated Test Post')

    const context = await api.micrositeContext(MICROSITE_SLUG)
    const postIds = context.posts.map((p: { id: number }) => p.id)
    expect(postIds).toContain(doc.id)

    await api.delete('posts', doc.id)
    created.pop()
  })

  test('pages — create, read, update, delete (scoped to ECGE microsite)', async () => {
    const slug = uniqueSlug('test-page')
    const doc = unwrapDoc(
      await api.create('pages', {
        title: 'Automated Test Page',
        slug,
        hero: { type: 'lowImpact' },
        layout: minimalPageLayout('Page content from API test.'),
        microsite: ecgeMicrositeId,
        _status: 'published',
      }),
    )
    created.push({ collection: 'pages', id: doc.id })

    const fetched = await api.get('pages', doc.id)
    expect(fetched.title).toBe('Automated Test Page')

    const updated = unwrapDoc(
      await api.update('pages', doc.id, {
        title: 'Updated Test Page',
        layout: minimalPageLayout('Updated page content.'),
      }),
    )
    expect(updated.title).toBe('Updated Test Page')

    const context = await api.micrositeContext(MICROSITE_SLUG)
    const pageIds = context.pages.map((p: { id: number }) => p.id)
    expect(pageIds).toContain(doc.id)

    await api.delete('pages', doc.id)
    created.pop()
  })

  test('events — create, read, update, delete (scoped to ECGE microsite)', async () => {
    const slug = uniqueSlug('test-event')
    const doc = unwrapDoc(
      await api.create('events', {
        title: 'Automated Test Event',
        slug,
        eventDate: new Date('2026-10-29T10:00:00.000Z').toISOString(),
        location: 'Tirana',
        content: minimalLexical('Event description from API test.'),
        microsite: ecgeMicrositeId,
        _status: 'published',
      }),
    )
    created.push({ collection: 'events', id: doc.id })

    const fetched = await api.get('events', doc.id)
    expect(fetched.title).toBe('Automated Test Event')

    const updated = unwrapDoc(
      await api.update('events', doc.id, {
        title: 'Updated Test Event',
        location: 'Palace of Congresses',
      }),
    )
    expect(updated.location).toBe('Palace of Congresses')

    const context = await api.micrositeContext(MICROSITE_SLUG)
    const eventIds = context.events.map((e: { id: number }) => e.id)
    expect(eventIds).toContain(doc.id)

    await api.delete('events', doc.id)
    created.pop()
  })

  test('media — upload, read, update alt, delete', async () => {
    const fileName = `${uniqueSlug('test')}.png`
    const uploaded = await api.uploadMedia(fileName, TINY_PNG, 'API test image')
    const id = uploaded.doc.id
    created.push({ collection: 'media', id })

    const fetched = await api.get('media', id)
    expect(fetched.filename).toContain('test')

    const updated = unwrapDoc(await api.update('media', id, { alt: 'Updated alt text' }))
    expect(updated.alt).toBe('Updated alt text')

    await api.delete('media', id)
    created.pop()
  })

  test('redirects — create, read, update, delete (scoped to ECGE microsite)', async () => {
    const from = `/${uniqueSlug('from')}`
    const doc = unwrapDoc(
      await api.create('redirects', {
        from,
        to: { type: 'custom', url: '/contact' },
        microsite: ecgeMicrositeId,
      }),
    )
    created.push({ collection: 'redirects', id: doc.id })

    const fetched = await api.get('redirects', doc.id)
    expect(fetched.from).toBe(from)

    const updated = unwrapDoc(
      await api.update('redirects', doc.id, {
        to: { type: 'custom', url: '/posts' },
      }),
    )
    expect(updated.to.url).toBe('/posts')

    await api.delete('redirects', doc.id)
    created.pop()
  })

  test('microsite-settings — create, read, update, delete (one per microsite)', async () => {
    const doc = unwrapDoc(
      await api.create('microsite-settings', {
        label: `ECGE settings ${uniqueSlug('ms')}`,
        microsite: ecgeMicrositeId,
        contactEmail: 'hello@ecge.test',
        heroTitle: 'ECGE 2026',
      }),
    )
    created.push({ collection: 'microsite-settings', id: doc.id })

    const fetched = await api.get('microsite-settings', doc.id)
    expect(fetched.contactEmail).toBe('hello@ecge.test')

    const updated = unwrapDoc(
      await api.update('microsite-settings', doc.id, {
        heroTitle: 'ECGE updated',
      }),
    )
    expect(updated.heroTitle).toBe('ECGE updated')

    await api.delete('microsite-settings', doc.id)
    created.pop()
  })

  test('forms — list and read (form-builder plugin)', async () => {
    const list = await api.find('forms', { limit: '5' })
    expect(list.docs).toBeDefined()
    if (list.docs.length > 0) {
      const first = list.docs[0] as { id: number }
      const fetched = await api.get('forms', first.id)
      expect(fetched.id).toBe(first.id)
    }
  })

  test('search — list indexed documents', async () => {
    const list = await api.find('search', { limit: '5' })
    expect(list.docs).toBeDefined()
  })

  test('globals — read and update header, footer, theme', async () => {
    const header = await api.getGlobal<{ navItems?: unknown[] }>('header')
    expect(header).toBeDefined()

    const originalItems = header.navItems || []
    const updatedHeader = await api.updateGlobal('header', {
      navItems: [...originalItems],
    })
    expect(updatedHeader).toBeDefined()

    const footer = await api.getGlobal('footer')
    expect(footer).toBeDefined()

    const theme = await api.getGlobal('theme')
    expect(theme).toBeDefined()
  })

  test('graphql — query posts and pages', async () => {
    const result = await api.graphql(`
      query {
        Posts(limit: 1) { docs { id title slug } }
        Pages(limit: 1) { docs { id title slug } }
        Events(limit: 1) { docs { id title slug } }
        Microsites(limit: 1) { docs { id title slug } }
      }
    `)
    expect(result.errors).toBeFalsy()
    expect(result.data).toBeDefined()
  })

  test('public reads — published posts accessible without auth', async () => {
    const slug = uniqueSlug('public-post')
    const doc = unwrapDoc(
      await api.create('posts', {
        title: 'Public Read Test Post',
        slug,
        content: minimalLexical('Public visibility test.'),
        microsite: ecgeMicrositeId,
        _status: 'published',
      }),
    )
    created.push({ collection: 'posts', id: doc.id })

    const publicList = await api.findPublic('posts', {
      'where[slug][equals]': slug,
      limit: '1',
    })
    expect(publicList.totalDocs).toBeGreaterThanOrEqual(1)

    await api.delete('posts', doc.id)
    created.pop()
  })
})
