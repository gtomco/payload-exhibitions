import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
  name: 'E2E Test User',
}

/**
 * Idempotent test user seed for e2e/admin/API tests.
 */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: {
        name: testUser.name,
        password: testUser.password,
      },
    })
    return
  }

  await payload.create({
    collection: 'users',
    data: testUser,
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })
}
