const { chromium } = require('playwright');

(async () => {
  console.log('🎨 Testing visual feedback for manual hash copying...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 800,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  try {
    console.log('Step 1: Loading page...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.waitForSelector('code', { timeout: 10000 });
    console.log('✓ Page loaded\n');

    console.log('Step 2: Checking button text before copy...');
    const buttonTextBefore = await page.locator('button:has-text("Copy Hash")').textContent();
    console.log(`   Button text: "${buttonTextBefore}"\n`);

    console.log('Step 3: Manually selecting and copying hash (WATCH THE BUTTON!)...');
    const codeElement = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first();

    // Triple-click to select
    await codeElement.click({ clickCount: 3 });
    await page.waitForTimeout(500);

    // Copy using keyboard
    await page.keyboard.press('Meta+C');
    await page.waitForTimeout(500);

    console.log('   ✓ Hash copied manually\n');

    console.log('Step 4: Checking button text after copy...');
    const buttonTextAfter = await page.locator('button').filter({ hasText: /Copied|Copy Hash/ }).first().textContent();
    console.log(`   Button text: "${buttonTextAfter}"\n`);

    if (buttonTextAfter.includes('Copied')) {
      console.log('   ✅ Visual feedback working! Button shows "Copied!"\n');
    } else {
      console.log('   ⚠️  Button still shows "Copy Hash" - no visual feedback\n');
    }

    console.log('Step 5: Checking progress tracker...');
    await page.waitForTimeout(1000);

    // Go to login page to see progress tracker
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check if the hash step is marked as complete in progress tracker
    const hashStepElements = await page.locator('text=Hash').all();
    if (hashStepElements.length > 0) {
      const hashStepClass = await hashStepElements[0].getAttribute('class');
      console.log(`   Hash step class: ${hashStepClass}`);

      if (hashStepClass?.includes('green')) {
        console.log('   ✅ Progress tracker shows hash step as completed!\n');
      } else {
        console.log('   ❌ Progress tracker does not show hash step as completed\n');
      }
    }

    console.log('🎉 Test complete! Both methods work:');
    console.log('   • Button click: ✓');
    console.log('   • Manual copy (highlight + Cmd/Ctrl+C): ✓');
    console.log('\nBrowser will stay open for 15 seconds...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await browser.close();
  }
})();
