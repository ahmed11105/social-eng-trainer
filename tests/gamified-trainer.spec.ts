import { test, expect } from '@playwright/test';

test.describe('Gamified OSINT Trainer', () => {
  test('homepage loads with generated profile and hash banner', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Social Engineering Training/);

    // Check hash banner is visible
    await expect(page.getByText('Target MD5 Hash')).toBeVisible();

    // Check difficulty badge is visible (EASY, MEDIUM, or HARD)
    const difficultyBadge = page.locator('span', { hasText: /^(EASY|MEDIUM|HARD)$/ }).first();
    await expect(difficultyBadge).toBeVisible();

    // Check hash is displayed (32 character MD5)
    const hashElement = page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ });
    await expect(hashElement.first()).toBeVisible();

    // Check copy button exists
    await expect(page.getByRole('button', { name: /Copy Hash/i })).toBeVisible();
  });

  test('generated profile displays correctly', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check profile has cover image
    const coverImage = page.locator('img[alt="Cover"]');
    await expect(coverImage).toBeVisible();

    // Check profile has avatar
    const avatarImage = page.locator('img').filter({ hasText: '' }).first();
    await expect(avatarImage).toBeVisible();

    // Check profile has bio
    const bioText = page.locator('p').filter({ hasText: /-based/i });
    await expect(bioText.first()).toBeVisible();

    // Check profile has location
    await expect(page.getByText(/📍/)).toBeVisible();

    // Check profile has website
    await expect(page.getByText(/🔗/)).toBeVisible();

    // Check profile has join date
    await expect(page.getByText(/📅 Joined/)).toBeVisible();
  });

  test('timer is visible and running', async ({ page }) => {
    await page.goto('/');

    // Check timer exists
    const timer = page.getByText(/⏱️/);
    await expect(timer).toBeVisible();

    // Check timer format (MM:SS)
    const timerText = await page.locator('span.font-mono').textContent();
    expect(timerText).toMatch(/\d+:\d{2}/);
  });

  test('stats panel displays game stats', async ({ page }) => {
    await page.goto('/');

    // Check stats panel exists
    await expect(page.getByText('Your Stats')).toBeVisible();

    // Check individual stats
    await expect(page.getByText('Rounds Completed')).toBeVisible();
    await expect(page.getByText('Current Streak')).toBeVisible();
    await expect(page.getByText('Best Streak')).toBeVisible();
    await expect(page.getByText('Fastest Time')).toBeVisible();
  });

  test('difficulty selector is present', async ({ page }) => {
    await page.goto('/');

    // Check difficulty section
    await expect(page.getByText('Difficulty')).toBeVisible();

    // Check difficulty buttons
    await expect(page.getByRole('button', { name: /Easy/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Medium/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Hard/i })).toBeVisible();
  });

  test('tweets are generated with clues', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    // Check that multiple tweets exist (look for tweet interaction buttons as indicator)
    await expect(page.locator('button:has-text("❤️")').first()).toBeVisible({ timeout: 10000 });
    const likeButtons = page.locator('button:has-text("❤️")');
    const tweetCount = await likeButtons.count();
    expect(tweetCount).toBeGreaterThan(3);

    // Check tweet interactions exist
    await expect(page.locator('button:has-text("💬")').first()).toBeVisible();
    await expect(page.locator('button:has-text("🔁")').first()).toBeVisible();
    await expect(page.locator('button:has-text("❤️")').first()).toBeVisible();
  });

  test('unauthenticated user cannot post tweets', async ({ page }) => {
    await page.goto('/');

    // Tweet composition form should not be visible
    await expect(page.getByPlaceholder("What's happening?")).not.toBeVisible();
  });

  test('hash banner copy button works', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Find the copy button (contains both emoji and text)
    const copyButton = page.locator('button:has-text("Copy Hash")');
    await expect(copyButton).toBeVisible();
    await copyButton.click();

    // Check button text changes to "Copied!"
    await expect(page.getByText('Copied!')).toBeVisible();

    // Wait for button to reset (should happen after 2 seconds)
    await page.waitForTimeout(2500);
    await expect(copyButton).toBeVisible();
  });

  test('login page shows dynamic hash from current profile', async ({ page }) => {
    // Get hash from main page
    await page.goto('/');
    const mainPageHash = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first().textContent();

    // Navigate to login
    await page.goto('/login');

    // Check same hash appears on login page
    const loginPageHash = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first().textContent();
    expect(loginPageHash).toBe(mainPageHash);
  });

  test('training instructions are visible', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Training Instructions')).toBeVisible();
    await expect(page.getByText(/Study the profile and tweets for clues/)).toBeVisible();
  });

  test('profile has follow button when not authenticated', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Follow', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).not.toBeVisible();
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known safe errors (favicon, etc.)
    const criticalErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('404')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('sidebar navigation works', async ({ page }) => {
    await page.goto('/');

    // Check X logo
    await expect(page.getByText('𝕏')).toBeVisible();

    // Check navigation links
    await expect(page.getByRole('link', { name: /Home/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Login/ })).toBeVisible();
  });

  test('reset stats button is present', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: /Reset All Stats/i })).toBeVisible();
  });
});

test.describe('Authentication Flow (Gamified)', () => {
  test('login page displays correctly', async ({ page }) => {
    await page.goto('/login');

    // Check form elements
    await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
    await expect(page.locator('label', { hasText: 'Username' })).toBeVisible();
    await expect(page.locator('label', { hasText: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // Check instructions
    await expect(page.getByText('How to crack:')).toBeVisible();
  });

  test('login with wrong credentials shows error', async ({ page }) => {
    await page.goto('/login');

    // Fill in wrong credentials
    const usernameInput = page.locator('input[type="text"]');
    const passwordInput = page.locator('input[type="password"]');

    await usernameInput.fill('wronguser');
    await passwordInput.fill('wrongpassword');

    // Submit form
    await page.getByRole('button', { name: 'Login' }).click();

    // Check for error message
    await expect(page.getByText(/Invalid credentials/)).toBeVisible();
  });
});
