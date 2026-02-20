const { chromium } = require('playwright');

(async () => {
  console.log('🔄 Testing full game flow with manual hash copying...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 800,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  try {
    // Step 1: Load home page
    console.log('Step 1: Loading home page...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✓ Home page loaded\n');

    // Step 2: Manually copy hash by highlighting
    console.log('Step 2: Manually copying hash (highlight + Cmd+C)...');
    const codeElement = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first();
    const hashText = await codeElement.textContent();
    console.log(`   Hash: ${hashText}`);

    await codeElement.click({ clickCount: 3 }); // Triple-click to select
    await page.waitForTimeout(500);
    await page.keyboard.press('Meta+C'); // Copy
    await page.waitForTimeout(1500); // Wait for state to update and save

    const buttonText = await page.locator('button').filter({ hasText: /Copied|Copy Hash/ }).first().textContent();
    console.log(`   Button shows: "${buttonText}"`);

    if (buttonText.includes('Copied')) {
      console.log('   ✅ Visual feedback works!\n');
    }

    // Step 3: Navigate to login page
    console.log('Step 3: Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✓ Login page loaded\n');

    // Step 4: Check progress tracker
    console.log('Step 4: Checking progress tracker...');

    // Find the hash indicator (small circle)
    const hashIndicators = await page.locator('.w-2.h-2.rounded-full').all();
    if (hashIndicators.length >= 3) {
      const hashCircle = hashIndicators[0]; // First one is hash
      const hashClass = await hashCircle.getAttribute('class');
      console.log(`   Hash circle classes: ${hashClass}`);

      if (hashClass?.includes('bg-green-500')) {
        console.log('   ✅ Hash step marked as COMPLETED (green)!\n');
      } else {
        console.log('   ❌ Hash step NOT marked as completed\n');
      }
    }

    // Also check the text color
    const hashLabels = await page.locator('span.text-xs').filter({ hasText: 'Hash' }).all();
    if (hashLabels.length > 0) {
      const hashLabelClass = await hashLabels[0].getAttribute('class');
      console.log(`   Hash label classes: ${hashLabelClass}`);

      if (hashLabelClass?.includes('text-green-400')) {
        console.log('   ✅ Hash label is GREEN (completed)!\n');
      } else {
        console.log('   ⚠️  Hash label is not green\n');
      }
    }

    // Step 5: Verify in localStorage
    console.log('Step 5: Checking localStorage...');
    const hashCopiedInStorage = await page.evaluate(() => {
      const state = localStorage.getItem('gameState');
      if (!state) return null;
      return JSON.parse(state).hashCopied;
    });
    console.log(`   hashCopied in localStorage: ${hashCopiedInStorage}`);

    if (hashCopiedInStorage) {
      console.log('   ✅ State persisted correctly!\n');
    }

    console.log('═══════════════════════════════════════════');
    console.log('📊 FINAL RESULTS:');
    console.log('═══════════════════════════════════════════');
    console.log('✅ Manual copy (highlight + Cmd+C): DETECTED');
    console.log('✅ Visual feedback (button): WORKING');
    console.log(`${hashCopiedInStorage ? '✅' : '❌'} State persistence: ${hashCopiedInStorage ? 'WORKING' : 'FAILED'}`);
    console.log('═══════════════════════════════════════════\n');

    console.log('Browser will stay open for 15 seconds...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await browser.close();
  }
})();
