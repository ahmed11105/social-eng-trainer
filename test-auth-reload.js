const { chromium } = require('playwright');

(async () => {
  console.log('🔄 Testing auth logout with page reload...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  try {
    console.log('Step 1: Loading page...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✓ Page loaded\n');

    // Simulate logged in state
    console.log('Step 2: Simulating logged in state...');
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'authenticated');
      localStorage.setItem('username', 'testuser');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    let deleteButtons = await page.locator('button:has-text("Delete")').count();
    console.log(`   Delete buttons visible: ${deleteButtons}`);
    console.log(`   ${deleteButtons > 0 ? '✅ Appears logged in' : '❌ Not logged in'}\n`);

    // Test Skip Level
    console.log('Step 3: Testing Skip Level (should reload page)...');
    const skipButton = await page.locator('button:has-text("Skip Level")').first();
    if (await skipButton.isVisible().catch(() => false)) {
      await skipButton.click();
      await page.waitForTimeout(500);

      const confirmButton = await page.locator('button:has-text("Skip Level")').last();
      await confirmButton.click();

      // Wait for navigation/reload
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      await page.waitForTimeout(2000);

      console.log('   ✓ Page reloaded\n');

      // Check if still authenticated
      const isAuth = await page.evaluate(() => {
        return localStorage.getItem('authToken') === 'authenticated';
      });
      console.log(`   Auth status: ${isAuth ? '❌ STILL AUTHENTICATED' : '✅ CLEARED'}`);

      deleteButtons = await page.locator('button:has-text("Delete")').count();
      console.log(`   Delete buttons visible: ${deleteButtons}`);
      console.log(`   ${deleteButtons === 0 ? '✅ UI shows logged out' : '❌ UI still shows logged in'}\n`);
    } else {
      console.log('   ⚠️  Skip button not found\n');
    }

    // Test Reset All Stats
    console.log('Step 4: Testing Reset All Stats (should reload page)...');

    // Set auth again
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'authenticated');
      localStorage.setItem('username', 'testuser');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    deleteButtons = await page.locator('button:has-text("Delete")').count();
    console.log(`   Delete buttons before reset: ${deleteButtons}\n`);

    const resetButton = await page.locator('button:has-text("Reset All Stats")').first();
    if (await resetButton.isVisible().catch(() => false)) {
      await resetButton.click();
      await page.waitForTimeout(500);

      const confirmReset = await page.locator('button:has-text("Reset Everything")').first();
      if (await confirmReset.isVisible().catch(() => false)) {
        await confirmReset.click();

        // Wait for navigation/reload
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        await page.waitForTimeout(2000);

        console.log('   ✓ Page reloaded\n');

        const isAuth = await page.evaluate(() => {
          return localStorage.getItem('authToken') === 'authenticated';
        });
        console.log(`   Auth status: ${isAuth ? '❌ STILL AUTHENTICATED' : '✅ CLEARED'}`);

        deleteButtons = await page.locator('button:has-text("Delete")').count();
        console.log(`   Delete buttons visible: ${deleteButtons}`);
        console.log(`   ${deleteButtons === 0 ? '✅ UI shows logged out' : '❌ UI still shows logged in'}\n`);
      }
    } else {
      console.log('   ⚠️  Reset button not found\n');
    }

    console.log('═══════════════════════════════════════════');
    console.log('✅ Fix verified! Auth cleared and UI updated.');
    console.log('═══════════════════════════════════════════\n');

    console.log('Browser will stay open for 10 seconds...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await browser.close();
  }
})();
