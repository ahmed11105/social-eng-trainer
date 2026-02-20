const { chromium } = require('playwright');

(async () => {
  console.log('👀 Opening browser for you to demonstrate the bug...\n');
  console.log('Instructions:');
  console.log('1. Complete Round 1');
  console.log('2. Start Round 2 and note its unique tweets');
  console.log('3. Click "1" to view Round 1');
  console.log('4. Click "2" to return to Round 2');
  console.log('5. Click "How to Play" button when you want me to stop watching\n');
  console.log('Browser opening...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 0,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const events = [];

  // Track page navigations
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      events.push({ type: 'navigation', url: frame.url(), time: new Date().toISOString() });
    }
  });

  // Track button clicks
  page.on('console', msg => {
    if (msg.type() === 'log') {
      events.push({ type: 'console', text: msg.text(), time: new Date().toISOString() });
    }
  });

  try {
    await page.goto('https://social-eng-trainer.vercel.app');
    await page.waitForLoadState('networkidle');

    console.log('✅ Browser ready! Watching for your demonstration...\n');
    console.log('💡 Remember: Click "How to Play" when you\'re done showing the bug\n');

    // Wait for "How to Play" button to be clicked
    await page.waitForSelector('button:has-text("How to Play")', { timeout: 600000 }); // 10 min timeout

    // Wait a bit to see if the modal opens
    await page.waitForTimeout(2000);

    // Check if the How to Play modal opened
    const modalVisible = await page.locator('text=How to Play').last().isVisible().catch(() => false);

    if (modalVisible) {
      console.log('\n✅ Detected "How to Play" clicked - stopping observation...\n');

      // Close the modal so we can see the page state
      const closeButton = await page.locator('button[aria-label="Close"]').first();
      if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click();
        await page.waitForTimeout(1000);
      }

      // Capture current state
      console.log('📸 Capturing final state...\n');

      // Get current profile info
      const username = await page.locator('text=/^@\\w+$/').first().textContent().catch(() => 'N/A');
      const tweets = await page.locator('[data-testid="tweet-text"]').allTextContents().catch(() => []);

      // Get navigation state
      const historyBadge = await page.locator('text=Viewing History').isVisible().catch(() => false);
      const navButtons = await page.locator('button').filter({ hasText: /^\d+$/ }).allTextContents().catch(() => []);

      // Get highlighted button (current view)
      const activeButtons = await page.locator('button.bg-blue-500').allTextContents().catch(() => []);

      console.log('='.repeat(60));
      console.log('📊 CURRENT STATE');
      console.log('='.repeat(60));
      console.log(`Username: ${username}`);
      console.log(`Viewing History: ${historyBadge ? 'YES' : 'NO'}`);
      console.log(`Active Round: ${activeButtons.join(', ') || 'Unknown'}`);
      console.log(`Navigation Buttons: ${navButtons.join(', ')}`);
      console.log(`\nTweets (first 3):`);
      tweets.slice(0, 3).forEach((tweet, i) => {
        console.log(`  ${i + 1}. "${tweet.substring(0, 70)}..."`);
      });

      console.log('\n='.repeat(60));
      console.log('🔍 ANALYSIS');
      console.log('='.repeat(60));

      // Take screenshot
      await page.screenshot({ path: 'bug-demonstration.png', fullPage: true });
      console.log('📸 Screenshot saved: bug-demonstration.png');

      console.log('\nKeeping browser open for 30 seconds for you to review...');
      await page.waitForTimeout(30000);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ Browser closed. Review the captured state above.');
  }
})();
