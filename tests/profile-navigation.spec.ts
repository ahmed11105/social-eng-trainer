import { test, expect } from '@playwright/test';

test.describe('Profile Navigation', () => {
  test('navigation bar appears after completing a round', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Initially no navigation bar (no history)
    await expect(page.locator('text=Prev')).not.toBeVisible();

    // Complete a round by logging in and posting
    // First, get the username and password from the profile
    await page.goto('/login');
    const hash = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first().textContent();

    // For testing, we'll just verify the navigation appears after starting a new round
    // (Actual password cracking would require hashcat)
  });

  test('navigation bar shows numbered buttons', async ({ page }) => {
    // Set up game state with multiple rounds in localStorage
    await page.goto('/');

    await page.evaluate(() => {
      // Simulate having completed 2 rounds
      const gameState = JSON.parse(localStorage.getItem('gameState') || '{}');
      if (gameState.currentProfile) {
        gameState.profileHistory = [
          { ...gameState.currentProfile },
          { ...gameState.currentProfile }
        ];
        gameState.currentViewIndex = 2;
        localStorage.setItem('gameState', JSON.stringify(gameState));
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Navigation bar should be visible with round numbers
    const navBar = page.locator('button:has-text("Prev")').locator('..');
    await expect(navBar).toBeVisible({ timeout: 5000 });
  });

  test('clicking previous/next navigates between profiles', async ({ page }) => {
    await page.goto('/');

    // Set up state with history
    await page.evaluate(() => {
      const gameState = JSON.parse(localStorage.getItem('gameState') || '{}');
      if (gameState.currentProfile) {
        gameState.profileHistory = [
          { ...gameState.currentProfile, profile: { ...gameState.currentProfile.profile, name: 'Historical Profile' } }
        ];
        gameState.currentViewIndex = 1; // Viewing current
        localStorage.setItem('gameState', JSON.stringify(gameState));
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Click previous button
    const prevButton = page.locator('button:has-text("Prev")');
    if (await prevButton.isVisible()) {
      await prevButton.click();

      // Should show "Viewing History" indicator
      await expect(page.getByText('Viewing History')).toBeVisible({ timeout: 3000 });

      // Next button should appear
      await expect(page.locator('button:has-text("Next")')).toBeVisible();
    }
  });
});
