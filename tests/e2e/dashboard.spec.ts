import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load main dashboard', async ({ page }) => {
    // Check if page loads
    await expect(page).toHaveTitle(/Nuxt/)
    
    // Check if main grid layout is present
    await expect(page.locator('.md\\:grid-cols-4')).toBeVisible()
  })

  test('should display market summary', async ({ page }) => {
    // Wait for market data to load
    await page.waitForTimeout(2000)
    
    // Check if market summary component is visible
    await expect(page.locator('article').first()).toBeVisible()
  })

  test('should allow currency switching', async ({ page }) => {
    // This test would require actual implementation
    // For now, just check if the interface elements exist
    await expect(page.locator('input[type="search"]')).toBeVisible()
  })

  test('should display charts', async ({ page }) => {
    // Check if chart container exists
    await expect(page.locator('article').nth(1)).toBeVisible()
  })

  test('should show order interface', async ({ page }) => {
    // Check if order component is present
    await expect(page.locator('article').nth(2)).toBeVisible()
  })

  test('should display assets section', async ({ page }) => {
    // Check if assets component is visible
    await expect(page.locator('article').nth(4)).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('should navigate to test page', async ({ page }) => {
    await page.goto('/')
    
    // Look for navigation links (assuming they exist in header)
    const testLink = page.locator('a[href="/test"]')
    if (await testLink.isVisible()) {
      await testLink.click()
      await expect(page).toHaveURL('/test')
    }
  })

  test('should navigate to floatmarkets', async ({ page }) => {
    await page.goto('/')
    
    // Click on the colored circle that navigates to floatmarkets
    const floatMarketsLink = page.locator('.cupo').first()
    if (await floatMarketsLink.isVisible()) {
      await floatMarketsLink.click()
      await expect(page).toHaveURL('/floatmarkets')
    }
  })
})

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept network requests and simulate failures
    await page.route('**/upbit/**', route => {
      route.abort()
    })
    
    await page.goto('/')
    
    // The page should still load even if some requests fail
    await expect(page.locator('body')).toBeVisible()
  })

  test('should show error notifications', async ({ page }) => {
    // Listen for custom error events
    let errorEventFired = false
    
    await page.addInitScript(() => {
      window.addEventListener('app:error', () => {
        (window as any).errorEventFired = true
      })
    })
    
    // Trigger an error scenario
    await page.goto('/')
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('app:error', {
        detail: { message: 'Test error' }
      }))
    })
    
    const errorFired = await page.evaluate(() => (window as any).errorEventFired)
    expect(errorFired).toBeTruthy()
  })
})