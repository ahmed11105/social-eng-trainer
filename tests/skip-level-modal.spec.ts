import { test, expect } from '@playwright/test';

test('Skip Level shows custom modal instead of browser confirm', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for page to load
  await page.waitForSelector('h2:has-text("OSINT Challenge")', { timeout: 10000 });

  // Click the Skip Level button
  await page.locator('button:has-text("Skip Level")').click();

  // Check that custom modal appears (not browser confirm)
  await expect(page.locator('h2:has-text("Skip This Profile?")')).toBeVisible();
  await expect(page.locator('text=Generate a new profile to practice on')).toBeVisible();

  // Check modal buttons are present (use more specific selectors)
  await expect(page.getByRole('button', { name: 'Skip Level', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Keep Playing' })).toBeVisible();

  // Test cancel
  await page.locator('button:has-text("Keep Playing")').click();
  await expect(page.locator('h2:has-text("Skip This Profile?")')).not.toBeVisible();

  console.log('✅ Skip Level modal displays correctly!');
});

test('Reset Stats shows custom modal', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for page to load
  await page.waitForSelector('h2:has-text("OSINT Challenge")', { timeout: 10000 });

  // Click the Reset All Stats button
  await page.locator('button:has-text("Reset All Stats")').click();

  // Check that custom modal appears
  await expect(page.locator('h2:has-text("Reset All Stats?")')).toBeVisible();
  await expect(page.locator('text=This will erase all your progress')).toBeVisible();

  // Check buttons
  await expect(page.locator('button:has-text("Reset Everything")')).toBeVisible();
  await expect(page.locator('button:has-text("Cancel")').last()).toBeVisible();

  // Test cancel by clicking X button
  await page.locator('button[aria-label="Close"]').click();
  await expect(page.locator('h2:has-text("Reset All Stats?")')).not.toBeVisible();

  console.log('✅ Reset Stats modal displays correctly!');
});

test('Skip Level modal actually skips the profile', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.waitForSelector('[data-testid="profile-display-name"]', { timeout: 10000 });

  // Get the current profile name
  const firstProfileName = await page.locator('[data-testid="profile-display-name"]').textContent();

  // Click skip level
  await page.locator('button:has-text("Skip Level")').click();
  await page.locator('button:has-text("Skip Level")').last().click(); // Click the confirm button in modal

  // Wait for new profile to load
  await page.waitForTimeout(1000);

  // Get the new profile name
  const secondProfileName = await page.locator('[data-testid="profile-display-name"]').textContent();

  // Should be different
  expect(firstProfileName).not.toBe(secondProfileName);

  console.log(`✅ Profile changed from "${firstProfileName}" to "${secondProfileName}"`);
});
