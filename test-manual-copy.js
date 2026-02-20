const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Testing manual hash copying...\n');

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

    // Wait for hash to be visible
    await page.waitForSelector('code', { timeout: 10000 });
    console.log('✓ Page loaded\n');

    console.log('Step 2: Checking initial state...');
    const initialHashCopied = await page.evaluate(() => {
      const state = localStorage.getItem('gameState');
      if (!state) return false;
      return JSON.parse(state).hashCopied;
    });
    console.log(`   hashCopied initially: ${initialHashCopied}\n`);

    console.log('Step 3: Manually selecting and copying hash...');
    // Find the hash code element
    const codeElement = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first();

    // Triple-click to select all text in the code element
    await codeElement.click({ clickCount: 3 });
    await page.waitForTimeout(500);

    // Copy using keyboard shortcut
    await page.keyboard.press('Meta+C'); // Mac (use 'Control+C' for Windows/Linux)
    await page.waitForTimeout(1000);

    console.log('   ✓ Hash text selected and copied\n');

    console.log('Step 4: Checking if hashCopied was marked...');
    await page.waitForTimeout(500);

    const hashCopiedAfterManual = await page.evaluate(() => {
      const state = localStorage.getItem('gameState');
      if (!state) return false;
      return JSON.parse(state).hashCopied;
    });

    console.log(`   hashCopied after manual copy: ${hashCopiedAfterManual}`);

    if (hashCopiedAfterManual) {
      console.log('\n✅ SUCCESS! Manual copying is detected!\n');
    } else {
      console.log('\n❌ FAILED - Manual copying not detected\n');
    }

    // Also test with button click for comparison
    console.log('Step 5: Testing button click for comparison...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const copyButton = await page.locator('button:has-text("Copy Hash")').first();
    await copyButton.click();
    await page.waitForTimeout(1000);

    const hashCopiedAfterButton = await page.evaluate(() => {
      const state = localStorage.getItem('gameState');
      if (!state) return false;
      return JSON.parse(state).hashCopied;
    });

    console.log(`   hashCopied after button click: ${hashCopiedAfterButton}`);

    if (hashCopiedAfterButton) {
      console.log('   ✓ Button click also works\n');
    }

    console.log('Browser will stay open for 10 seconds...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await browser.close();
  }
})();
