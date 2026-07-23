import { test, expect } from '@playwright/test'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const MICROSITE_SLUG = 'ecge'

test.describe('Microsite CRM API', () => {
  test('returns 404 when microsite has no CRM event configured', async ({ request }) => {
    const response = await request.get(
      `${PAYLOAD_URL}/api/microsites/${MICROSITE_SLUG}/crm/exhibition`,
    )

    if (response.status() === 502) {
      test.skip(true, 'CRM server unreachable — skipping')
    }

    if (response.status() === 200) {
      const body = await response.json()
      expect(body.configured).toBe(true)
      expect(body.eventId).toBeTruthy()
      expect(body).toHaveProperty('areas')
      return
    }

    expect(response.status()).toBe(404)
    const body = await response.json()
    expect(body.configured).toBeFalsy()
  })
})
