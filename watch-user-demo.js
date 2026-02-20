const { chromium } = require('playwright');

(async () => {
  console.log('👀 Opening browser for you to demonstrate the bug...\n');
  console.log('Instructions:');
  console.log('1. Complete Round 1');
  console.log('2. Start Round 2 and note its unique tweets');
  console.log('3. Click "1" to view Round 1');
  console.log('4. Click "2" to return to Round 2');
  console.log('5. When you\'re done, CLICK "How to Play" button to signal me\n');
  console.log('⏳ Browser opening - I\'ll wait until you click "How to Play"...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 0,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  try {
    await page.goto('https://social-eng-trainer.vercel.app');
    await page.waitForLoadState('networkidle');

    console.log('✅ Browser ready! Demonstrate the bug at your own pace.\n');
    console.log('👉 I\'m watching and waiting for you to click "How to Play"...\n');

    // Inject a script to detect the How to Play button click
    await page.addScriptTag({
      content: `
        window.__howToPlayClicked = false;
        document.addEventListener('click', (e) => {
          const target = e.target;
          const button = target.closest('button');
          if (button && button.textContent.includes('How to Play')) {
            window.__howToPlayClicked = true;
          }
        }, true);
      `
    });

    // Poll until the button is clicked
    let clicked = false;
    while (!clicked) {
      clicked = await page.evaluate(() => window.__howToPlayClicked);
      if (!clicked) {
        await page.waitForTimeout(500);
      }
    }

    console.log('\n✅ I detected you clicked "How to Play"!\n');
    console.log('📸 Capturing the state now...\n');

    // Wait a moment
    await page.waitForTimeout(2000);

    // Close modal if it opened
    const closeButton = page.locator('button[aria-label="Close"]').first();
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
      await page.waitForTimeout(1000);
    }

    // Capture final state
    const username = await page.locator('text=/^@\\w+$/').first().textContent().catch(() => 'N/A');
    const tweets = await page.locator('[data-testid="tweet-text"]').allTextContents().catch(() => []);
    const historyBadge = await page.locator('text=Viewing History').isVisible().catch(() => false);

    // Get the active round number
    const activeButton = await page.locator('button.bg-blue-500, button.scale-110').filter({ hasText: /^\d+$/ }).first();
    const activeRound = await activeButton.textContent().catch(() => 'Unknown');

    console.log('='.repeat(60));
    console.log('📊 STATE WHEN YOU CLICKED "HOW TO PLAY"');
    console.log('='.repeat(60));
    console.log(`Profile: ${username}`);
    console.log(`Viewing History: ${historyBadge ? 'YES' : 'NO'}`);
    console.log(`Active Round: ${activeRound}`);
    console.log(`\nFirst 3 tweets:`);
    tweets.slice(0, 3).forEach((tweet, i) => {
      console.log(`  ${i + 1}. "${tweet.substring(0, 80)}..."`);
    });
    console.log('='.repeat(60));

    await page.screenshot({ path: 'bug-demo-final.png', fullPage: true });
    console.log('\n📸 Screenshot saved: bug-demo-final.png');

    console.log('\n✅ Keeping browser open for 30 seconds so you can see...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ Done. Thank you for demonstrating the bug!');
  }
})();
