const { chromium } = require('playwright');
const CryptoJS = require('crypto-js');

(async () => {
  console.log('🔐 Testing authentication reset on skip/reset...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 800,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  try {
    // Helper to check auth status
    const checkAuth = async () => {
      return await page.evaluate(() => {
        return localStorage.getItem('authToken') === 'authenticated';
      });
    };

    // Step 1: Load and login
    console.log('Step 1: Loading page and logging in...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Get credentials
    const usernameElement = await page.locator('text=/^@\\w+$/').first();
    const username = (await usernameElement.textContent()).replace('@', '').trim();

    const hashElement = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first();
    const hash = await hashElement.textContent();

    // Crack password
    const tweets = await page.locator('[data-testid="tweet-text"]').allTextContents();
    let petName = null;
    let year = null;

    for (const tweet of tweets) {
      const petWords = /(dog|cat|pet|puppy|kitten|adopted|got\s+|companion)/i;
      if (petWords.test(tweet)) {
        const nameMatch = tweet.match(/\b([A-Z][a-z]{2,})\b/);
        if (nameMatch && !petName) {
          petName = nameMatch[1];
        }
      }

      const yearMatch = tweet.match(/\b(19|20)\d{2}\b/);
      if (yearMatch && !year) {
        year = yearMatch[0];
      }
    }

    const wordlist = [
      `${petName.toLowerCase()}${year}`,
      `${year}${petName.toLowerCase()}`,
      `${petName.toLowerCase()}${year.slice(-2)}`,
    ];

    let crackedPassword = null;
    for (const word of wordlist) {
      const testHash = CryptoJS.MD5(word).toString();
      if (testHash === hash) {
        crackedPassword = word;
        break;
      }
    }

    if (!crackedPassword) {
      console.log('❌ Could not crack password, skipping test\n');
      await browser.close();
      return;
    }

    // Login
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.locator('input[type="text"]').fill(username);
    await page.locator('input[type="password"]').fill(crackedPassword);
    await page.locator('button:has-text("Login")').click();
    await page.waitForTimeout(2000);

    const isAuthAfterLogin = await checkAuth();
    console.log(`   Auth after login: ${isAuthAfterLogin ? '✅ AUTHENTICATED' : '❌ NOT AUTHENTICATED'}\n`);

    if (!isAuthAfterLogin) {
      console.log('❌ Login failed, cannot continue test\n');
      await browser.close();
      return;
    }

    // Step 2: Skip level and check auth
    console.log('Step 2: Skipping level...');
    const skipButton = await page.locator('button:has-text("Skip Level")').first();
    if (await skipButton.isVisible().catch(() => false)) {
      await skipButton.click();
      await page.waitForTimeout(500);

      // Confirm skip
      const confirmButton = await page.locator('button:has-text("Skip Level")').last();
      await confirmButton.click();
      await page.waitForTimeout(2000);

      const isAuthAfterSkip = await checkAuth();
      console.log(`   Auth after skip: ${isAuthAfterSkip ? '❌ STILL AUTHENTICATED (BUG!)' : '✅ CLEARED'}\n`);
    }

    // Step 3: Refresh page and check auth
    console.log('Step 3: Refreshing page...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const isAuthAfterRefresh = await checkAuth();
    console.log(`   Auth after refresh: ${isAuthAfterRefresh ? '❌ STILL AUTHENTICATED (BUG!)' : '✅ CLEARED'}\n`);

    // Step 4: Reset all stats
    console.log('Step 4: Testing reset stats...');

    // First login again to set auth
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const newUsername = (await page.locator('text=/^@\\w+$/').first().textContent()).replace('@', '').trim();
    const newHashElement = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first();
    const newHash = await newHashElement.textContent();

    // Try cracking new password
    const newTweets = await page.goto('http://localhost:3000').then(() =>
      page.locator('[data-testid="tweet-text"]').allTextContents()
    );

    let newPetName = null;
    let newYear = null;

    for (const tweet of newTweets) {
      const petWords = /(dog|cat|pet|puppy|kitten|adopted|got\s+|companion)/i;
      if (petWords.test(tweet)) {
        const nameMatch = tweet.match(/\b([A-Z][a-z]{2,})\b/);
        if (nameMatch && !newPetName) {
          newPetName = nameMatch[1];
        }
      }

      const yearMatch = tweet.match(/\b(19|20)\d{2}\b/);
      if (yearMatch && !newYear) {
        newYear = yearMatch[0];
      }
    }

    if (newPetName && newYear) {
      const newPassword = `${newPetName.toLowerCase()}${newYear}`;
      const testHash = CryptoJS.MD5(newPassword).toString();

      if (testHash === newHash) {
        await page.goto('http://localhost:3000/login');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await page.locator('input[type="text"]').fill(newUsername);
        await page.locator('input[type="password"]').fill(newPassword);
        await page.locator('button:has-text("Login")').click();
        await page.waitForTimeout(2000);

        const isAuthBeforeReset = await checkAuth();
        console.log(`   Auth before reset: ${isAuthBeforeReset ? '✅ AUTHENTICATED' : '❌ NOT AUTHENTICATED'}`);

        // Now reset
        const resetButton = await page.locator('button:has-text("Reset All Stats")').first();
        if (await resetButton.isVisible().catch(() => false)) {
          await resetButton.click();
          await page.waitForTimeout(500);

          const confirmReset = await page.locator('button:has-text("Reset Everything")').first();
          if (await confirmReset.isVisible().catch(() => false)) {
            await confirmReset.click();
            await page.waitForTimeout(2000);
          }

          const isAuthAfterReset = await checkAuth();
          console.log(`   Auth after reset: ${isAuthAfterReset ? '❌ STILL AUTHENTICATED (BUG!)' : '✅ CLEARED'}\n`);
        }
      }
    }

    console.log('═══════════════════════════════════════════');
    console.log('📊 FINAL RESULTS:');
    console.log('═══════════════════════════════════════════');
    console.log('All authentication should be cleared when:');
    console.log('  • Skipping a level');
    console.log('  • Starting a new round');
    console.log('  • Resetting all stats');
    console.log('═══════════════════════════════════════════\n');

    console.log('Browser will stay open for 15 seconds...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await browser.close();
  }
})();
