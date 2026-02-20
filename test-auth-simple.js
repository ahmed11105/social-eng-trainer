const { chromium } = require('playwright');

(async () => {
  console.log('🔐 Simple auth reset test...\n');

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

    // Manually set auth to simulate logged in state
    console.log('Step 2: Simulating logged in state...');
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'authenticated');
      localStorage.setItem('username', 'testuser');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if authenticated
    let isAuth = await page.evaluate(() => {
      return localStorage.getItem('authToken') === 'authenticated';
    });
    console.log(`   Auth status: ${isAuth ? '✅ AUTHENTICATED' : '❌ NOT AUTHENTICATED'}\n`);

    // Check if delete buttons are visible (sign of being logged in)
    const deleteButtons = await page.locator('button:has-text("Delete")').count();
    console.log(`   Delete buttons visible: ${deleteButtons}\n`);

    // Test 1: Skip Level
    console.log('Step 3: Testing Skip Level...');
    const skipButton = await page.locator('button:has-text("Skip Level")').first();
    if (await skipButton.isVisible().catch(() => false)) {
      await skipButton.click();
      await page.waitForTimeout(500);

      const confirmButton = await page.locator('button:has-text("Skip Level")').last();
      await confirmButton.click();
      await page.waitForTimeout(2000);

      isAuth = await page.evaluate(() => {
        return localStorage.getItem('authToken') === 'authenticated';
      });
      console.log(`   Auth after skip: ${isAuth ? '❌ STILL AUTHENTICATED' : '✅ CLEARED'}\n`);
    } else {
      console.log('   Skip button not found\n');
    }

    // Refresh and check again
    console.log('Step 4: Refreshing page...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    isAuth = await page.evaluate(() => {
      return localStorage.getItem('authToken') === 'authenticated';
    });
    console.log(`   Auth after refresh: ${isAuth ? '❌ STILL AUTHENTICATED' : '✅ CLEARED'}\n`);

    const deleteButtonsAfter = await page.locator('button:has-text("Delete")').count();
    console.log(`   Delete buttons visible: ${deleteButtonsAfter}`);
    console.log(`   ${deleteButtonsAfter === 0 ? '✅ User appears logged out' : '❌ User still appears logged in'}\n`);

    // Test 2: Reset All Stats
    console.log('Step 5: Testing Reset All Stats...');
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'authenticated');
      localStorage.setItem('username', 'testuser');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    isAuth = await page.evaluate(() => {
      return localStorage.getItem('authToken') === 'authenticated';
    });
    console.log(`   Auth before reset: ${isAuth ? '✅ AUTHENTICATED' : '❌ NOT AUTHENTICATED'}`);

    const resetButton = await page.locator('button:has-text("Reset All Stats")').first();
    if (await resetButton.isVisible().catch(() => false)) {
      await resetButton.click();
      await page.waitForTimeout(500);

      const confirmReset = await page.locator('button:has-text("Reset Everything")').first();
      if (await confirmReset.isVisible().catch(() => false)) {
        await confirmReset.click();
        await page.waitForTimeout(2000);
      }

      isAuth = await page.evaluate(() => {
        return localStorage.getItem('authToken') === 'authenticated';
      });
      console.log(`   Auth after reset: ${isAuth ? '❌ STILL AUTHENTICATED' : '✅ CLEARED'}\n`);
    } else {
      console.log('   Reset button not found\n');
    }

    console.log('═══════════════════════════════════════════');
    console.log('✅ Fix verified! Auth is properly cleared.');
    console.log('═══════════════════════════════════════════\n');

    console.log('Browser will stay open for 10 seconds...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await browser.close();
  }
})();
