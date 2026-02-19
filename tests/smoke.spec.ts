import { test, expect } from '@playwright/test';

/**
 * Smoke test for production deployment
 * Verifies core functionality works on the live site
 */
test.describe('Production Smoke Test', () => {
  test('homepage loads and displays core elements', async ({ page }) => {
    await page.goto('/');

    // Check page loads without errors
    await expect(page).toHaveTitle(/Social Engineering Training/);

    // Check hash banner is visible
    await expect(page.getByText('Target MD5 Hash')).toBeVisible();

    // Check hash is displayed (32 character MD5)
    const hashElement = page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ });
    await expect(hashElement.first()).toBeVisible({ timeout: 10000 });

    // Check profile loads
    const coverImage = page.locator('img[alt="Cover"]');
    await expect(coverImage).toBeVisible({ timeout: 10000 });

    // Check stats panel
    await expect(page.getByText('Your Stats')).toBeVisible();

    // Check skip button exists
    await expect(page.getByText('Skip Level')).toBeVisible();
  });

  test('login page loads correctly', async ({ page }) => {
    await page.goto('/login');

    // Check form elements
    await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();

    // Check hash is displayed
    const hashElement = page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ });
    await expect(hashElement.first()).toBeVisible({ timeout: 10000 });
  });

  test('no critical console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known safe errors
    const criticalErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('404')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
