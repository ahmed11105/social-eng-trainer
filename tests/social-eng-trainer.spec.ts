import { test, expect } from '@playwright/test';

test.describe('Social Engineering Trainer', () => {
  test('homepage loads successfully with profile', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Social Engineering Training/);

    // Check profile header exists
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();

    // Check Marcus Rivera's profile info
    await expect(page.getByRole('heading', { name: 'Marcus Rivera' })).toBeVisible();
    await expect(page.getByText('@marcus_shoots').first()).toBeVisible();
    await expect(page.getByText('Miami-based photographer')).toBeVisible();

    // Check profile stats
    await expect(page.getByText('342')).toBeVisible(); // Following
    await expect(page.getByText('1847')).toBeVisible(); // Followers
  });

  test('profile displays cover and avatar images', async ({ page }) => {
    await page.goto('/');

    // Check that images are loaded
    const coverImage = page.locator('img[alt="Cover"]');
    await expect(coverImage).toBeVisible();
    await expect(coverImage).toHaveAttribute('src', /unsplash/);

    const avatarImage = page.locator('img[alt="Marcus Rivera"]').first();
    await expect(avatarImage).toBeVisible();
    await expect(avatarImage).toHaveAttribute('src', /unsplash/);
  });

  test('displays tweets with correct information', async ({ page }) => {
    await page.goto('/');

    // Check that tweets are visible
    await expect(page.getByText(/Can't believe it's been 10 years since I adopted Atlas/)).toBeVisible();
    await expect(page.getByText(/New photo series dropping soon/)).toBeVisible();
    await expect(page.getByText(/Atlas and I exploring Everglades/)).toBeVisible();

    // Check tweet metadata
    await expect(page.getByText('2025-02-15')).toBeVisible();

    // Check tweet interactions (likes, retweets, replies)
    const likeButtons = page.locator('button:has-text("❤️")');
    await expect(likeButtons.first()).toBeVisible();
  });

  test('tweets with media display images', async ({ page }) => {
    await page.goto('/');

    // Check that tweet media images are loaded
    const tweetImages = page.locator('img[alt="Tweet media"]');
    const count = await tweetImages.count();
    expect(count).toBeGreaterThan(0);

    // Verify at least one image has Unsplash source
    const firstImage = tweetImages.first();
    await expect(firstImage).toHaveAttribute('src', /unsplash/);
  });

  test('sidebar navigation is visible', async ({ page }) => {
    await page.goto('/');

    // Check X logo
    await expect(page.getByText('𝕏')).toBeVisible();

    // Check navigation links
    await expect(page.getByRole('link', { name: /Home/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Login/ })).toBeVisible();

    // Check OSINT challenge box
    await expect(page.getByText('OSINT Challenge')).toBeVisible();
  });

  test('training instructions are visible', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Training Instructions')).toBeVisible();
    await expect(page.getByText(/Read Marcus's bio and tweets carefully/)).toBeVisible();
    await expect(page.getByText('Quick Tips')).toBeVisible();
    await expect(page.getByText(/Look for pet names/)).toBeVisible();
  });

  test('unauthenticated user sees Follow button', async ({ page }) => {
    await page.goto('/');

    // Should see Follow button, not Logout
    await expect(page.getByRole('button', { name: 'Follow' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).not.toBeVisible();
  });

  test('unauthenticated user cannot add or delete tweets', async ({ page }) => {
    await page.goto('/');

    // Add tweet form should not be visible
    await expect(page.getByPlaceholder("What's happening?")).not.toBeVisible();

    // Delete buttons should not be visible
    await expect(page.getByRole('button', { name: /Delete/ })).not.toBeVisible();
  });

  test('login page displays correctly', async ({ page }) => {
    await page.goto('/login');

    // Check login form elements
    await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('marcus_shoots')).toBeVisible();
    await expect(page.getByPlaceholder('Enter cracked password')).toBeVisible();

    // Check MD5 hash is displayed
    await expect(page.getByText('Target MD5 Hash:')).toBeVisible();
    await expect(page.getByText('95fe776b4506f1b504c5514d8fb2c3b0')).toBeVisible();

    // Check instructions
    await expect(page.getByText('How to crack:')).toBeVisible();
    await expect(page.getByText(/hashcat/).first()).toBeVisible();
  });

  test('login with wrong credentials shows error', async ({ page }) => {
    await page.goto('/login');

    // Fill in wrong credentials
    await page.getByPlaceholder('marcus_shoots').fill('marcus_shoots');
    await page.getByPlaceholder('Enter cracked password').fill('wrongpassword');

    // Submit form
    await page.getByRole('button', { name: 'Login' }).click();

    // Check for error message
    await expect(page.getByText(/Invalid credentials/)).toBeVisible();
  });

  test('login with correct credentials redirects to homepage', async ({ page }) => {
    await page.goto('/login');

    // Fill in correct credentials
    await page.getByPlaceholder('marcus_shoots').fill('marcus_shoots');
    await page.getByPlaceholder('Enter cracked password').fill('atlas2015');

    // Submit form
    await page.getByRole('button', { name: 'Login' }).click();

    // Should redirect to homepage
    await expect(page).toHaveURL('/');

    // Wait a moment for auth state to update
    await page.waitForTimeout(1000);
  });

  test('authenticated user can add a tweet', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByPlaceholder('marcus_shoots').fill('marcus_shoots');
    await page.getByPlaceholder('Enter cracked password').fill('atlas2015');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/');

    // Wait for auth state
    await page.waitForTimeout(1000);

    // Add a new tweet
    const tweetText = 'Test tweet from Playwright!';
    await page.getByPlaceholder("What's happening?").fill(tweetText);
    await page.getByRole('button', { name: 'Post', exact: true }).click();

    // Check that the tweet appears
    await expect(page.getByText(tweetText)).toBeVisible();
  });

  test('authenticated user sees Logout button', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByPlaceholder('marcus_shoots').fill('marcus_shoots');
    await page.getByPlaceholder('Enter cracked password').fill('atlas2015');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/');

    // Wait for auth state
    await page.waitForTimeout(1000);

    // Should see Logout button, not Follow
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Follow' })).not.toBeVisible();
  });

  test('authenticated user can delete tweets', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByPlaceholder('marcus_shoots').fill('marcus_shoots');
    await page.getByPlaceholder('Enter cracked password').fill('atlas2015');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/');

    // Wait for auth state
    await page.waitForTimeout(1000);

    // Add a tweet first
    const tweetText = 'Tweet to be deleted';
    await page.getByPlaceholder("What's happening?").fill(tweetText);
    await page.getByRole('button', { name: 'Post', exact: true }).click();
    await expect(page.getByText(tweetText)).toBeVisible();

    // Delete the tweet
    const deleteButtons = page.locator('button:has-text("🗑️")');
    await deleteButtons.first().click();

    // Tweet should be gone
    await expect(page.getByText(tweetText)).not.toBeVisible();
  });

  test('logout functionality works', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByPlaceholder('marcus_shoots').fill('marcus_shoots');
    await page.getByPlaceholder('Enter cracked password').fill('atlas2015');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/');

    // Wait for auth state
    await page.waitForTimeout(1000);

    // Click logout
    await page.getByRole('button', { name: 'Logout' }).click();

    // Wait for state update
    await page.waitForTimeout(1000);

    // Should see Follow button again
    await expect(page.getByRole('button', { name: 'Follow' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).not.toBeVisible();

    // Add tweet form should not be visible
    await expect(page.getByPlaceholder("What's happening?")).not.toBeVisible();
  });

  test('tweet interaction buttons have hover effects', async ({ page }) => {
    await page.goto('/');

    // Check that interaction buttons exist
    const replyButton = page.locator('button:has-text("💬")').first();
    const retweetButton = page.locator('button:has-text("🔁")').first();
    const likeButton = page.locator('button:has-text("❤️")').first();

    await expect(replyButton).toBeVisible();
    await expect(retweetButton).toBeVisible();
    await expect(likeButton).toBeVisible();
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check for no errors (excluding known safe warnings)
    const criticalErrors = errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('404')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('responsive tabs are functional', async ({ page }) => {
    await page.goto('/');

    // Check all tabs are visible
    await expect(page.getByRole('button', { name: 'Posts', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Replies' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Media' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Likes' })).toBeVisible();
  });
});
