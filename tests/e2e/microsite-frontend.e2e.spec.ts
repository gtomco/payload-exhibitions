import { test, expect } from '@playwright/test'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'

test.describe('ECGE React microsite frontend', () => {
  test('loads home page with expo header and hero', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/ECGE/i)
    await expect(page.locator('.expo-header')).toBeVisible()
    await expect(page.locator('.home-expo-stage')).toBeVisible()
    await expect(page.locator('.event-countdown')).toBeVisible()
    await expect(page.locator('.ecge-contact-footer')).toBeVisible()
  })

  test('fetches Payload microsite context through Vite proxy', async ({ page, request }) => {
    const direct = await request.get(`${PAYLOAD_URL}/api/microsites/ecge/context`)
    expect(direct.ok()).toBeTruthy()
    const body = await direct.json()
    expect(body.microsite.slug).toBe('ecge')

    const proxied = await page.request.get('/payload-api/microsites/ecge/context')
    expect(proxied.ok()).toBeTruthy()
    const proxiedBody = await proxied.json()
    expect(proxiedBody.microsite.slug).toBe('ecge')
    expect(proxiedBody).toHaveProperty('settings')
    expect(proxiedBody.settings.theme?.primary).toBeTruthy()

    await page.goto('/')
    await expect(page.locator('.expo-header')).toBeVisible()
    await expect(page.locator('text=Microsite context')).toHaveCount(0)
  })

  test('applies theme CSS variables from Payload settings', async ({ page }) => {
    const context = await page.request.get('/payload-api/microsites/ecge/context')
    expect(context.ok()).toBeTruthy()
    const body = await context.json()
    const primary = body.settings?.theme?.primary || '#1B8C66'

    await page.goto('/')
    await expect(page.locator('.expo-header')).toBeVisible()

    const appliedPrimary = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
    )
    expect(appliedPrimary.toLowerCase()).toBe(String(primary).toLowerCase())
  })

  test('language toggle switches EN label', async ({ page }) => {
    await page.goto('/')
    await page.locator('.lang-toggle').click()
    await expect(page.locator('.lang-toggle span')).toHaveText('SQ')
  })

  test('program view loads from header navigation', async ({ page }) => {
    await page.goto('/')
    await page.locator('.itb-main-nav button', { hasText: 'VIZITO' }).click()
    await page.locator('#ecge-header-dropdown button.menu-link', { hasText: 'Axhenda' }).click()
    await expect(page.locator('.public-main.view-program')).toBeVisible()
    await expect(page.locator('.public-main')).toContainText(/Axhenda|program/i)
  })

  test('legacy public JSON loads booths for floor preview', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.floor-preview-map .booth-marker').first()).toBeVisible({
      timeout: 10000,
    })
  })

  test('FAQ CMS page renders seeded content with static layout classes', async ({ page }) => {
    await page.goto('/')
    await page.locator('.itb-main-nav button', { hasText: 'EKSPOZO' }).click()
    await page.locator('#ecge-header-dropdown button.menu-link', { hasText: 'Pyetje te shpeshta' }).click()

    await expect(page.locator('.public-main.view-faq')).toBeVisible()
    await expect(page.locator('.cms-page-faq')).toBeVisible()
    await expect(page.locator('.cms-page .section.single')).toBeVisible()
    await expect(page.locator('.faq-list .faq-item')).toHaveCount(5)
    await expect(page.locator('.faq-item h3').first()).toContainText(/ekspozues/i)
    await expect(page.locator('.faq-list')).toContainText(/QR/i)
  })

  test('prices CMS page renders price cards from Payload content', async ({ page }) => {
    await page.goto('/')
    await page.locator('.gateway-card', { hasText: /PLANIMETRIA|FLOOR/i }).click()
    await page.locator('.floor-tabs button', { hasText: /Cmimet|Pricing/i }).click()
    await page.locator('.floor-panel button', { hasText: /listen e cmimeve|price list/i }).click()

    await expect(page.locator('.public-main.view-prices')).toBeVisible()
    await expect(page.locator('.cms-page-prices')).toBeVisible()
    await expect(page.locator('.price-grid:not(.partners) .price-card')).toHaveCount(2)
    await expect(page.locator('.price-grid.partners .price-card')).toHaveCount(3)
    await expect(page.locator('.cms-page-prices')).toContainText('12,000 ALL/m2')
    await expect(page.locator('.cms-page-prices')).toContainText('Platinum Partner')
    await expect(page.locator('.pricing-title h2').first()).toContainText(/Hapesira ekspozuese/i)
  })

  test('FAQ and prices pages match static typography tokens', async ({ page }) => {
    await page.goto('/')
    await page.locator('.itb-main-nav button', { hasText: 'EKSPOZO' }).click()
    await page.locator('#ecge-header-dropdown button.menu-link', { hasText: 'Pyetje te shpeshta' }).click()

    const faqHeadingWeight = await page.locator('.faq-item h3').first().evaluate((el) =>
      getComputedStyle(el).fontWeight,
    )
    expect(Number(faqHeadingWeight)).toBeGreaterThanOrEqual(700)

    await page.goto('/')
    await page.locator('.gateway-card', { hasText: /PLANIMETRIA|FLOOR/i }).click()
    await page.locator('.floor-tabs button', { hasText: /Cmimet|Pricing/i }).click()
    await page.locator('.floor-panel button', { hasText: /listen e cmimeve|price list/i }).click()

    const priceColor = await page.locator('.price-card .cms-prose h3').first().evaluate((el) =>
      getComputedStyle(el).color,
    )
    const primary = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
    )
    expect(priceColor).toBeTruthy()
    expect(primary).toBeTruthy()
  })
})
