const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();

  console.log('🎮 Starting comprehensive game test...\n');

  await page.goto('https://social-eng-trainer.vercel.app');
  await page.waitForLoadState('networkidle');

  // Complete 4 rounds with different times
  const roundTimes = [15, 25, 40, 55]; // seconds for each round

  for (let round = 1; round <= 4; round++) {
    console.log(`\n📍 ROUND ${round} - Target time: ${roundTimes[round - 1]}s`);

    // Copy hash
    const hashButton = await page.locator('button:has-text("Copy Hash")').first();
    await hashButton.click();
    console.log('  ✓ Hash copied');

    // Get profile info to find password
    const profileText = await page.locator('div[class*="profile"]').first().textContent();

    // Wait for specific time
    await page.waitForTimeout(roundTimes[round - 1] * 1000);

    // Go to login
    await page.goto('https://social-eng-trainer.vercel.app/login');
    await page.waitForLoadState('networkidle');

    // For testing, let's just skip the level instead of actually solving
    // (since we'd need to crack the actual hash)
    console.log('  ⏭️  Skipping level for test...');

    await page.goto('https://social-eng-trainer.vercel.app');
    await page.waitForLoadState('networkidle');

    // Click skip level button
    const skipButton = await page.locator('button:has-text("Skip Level")').first();
    if (await skipButton.isVisible()) {
      await skipButton.click();
      await page.waitForTimeout(500);
      // Confirm skip
      const confirmButton = await page.locator('button:has-text("Skip Level")').last();
      await confirmButton.click();
      await page.waitForTimeout(2000);
    }

    console.log(`  ✓ Round ${round} completed at ~${roundTimes[round - 1]}s`);
  }

  console.log('\n\n📜 Now checking history pages...\n');

  // Navigate through history
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(1000);

    // Click view completion
    const roundCompleteButton = await page.locator('button:has-text("Round Complete")').first();
    if (await roundCompleteButton.isVisible()) {
      await roundCompleteButton.click();
      await page.waitForTimeout(2000);

      // Take screenshot of completion modal
      await page.screenshot({ path: `completion-round-${i + 1}.png` });
      console.log(`  📸 Screenshot saved: completion-round-${i + 1}.png`);

      // Read the time displayed
      const modal = await page.locator('div:has-text("Mission Complete")').first();
      const timeText = await modal.locator('span:has-text(":")').first().textContent();
      console.log(`  ⏱️  Round ${i + 1} shows time: ${timeText}`);

      // Close modal
      const closeButton = await page.locator('button[aria-label="Close"]').first();
      await closeButton.click();
      await page.waitForTimeout(1000);
    }

    // Go to previous profile
    if (i < 3) {
      const prevButton = await page.locator('button:has-text("←")').first();
      if (await prevButton.isVisible()) {
        await prevButton.click();
        await page.waitForTimeout(1000);
      }
    }
  }

  console.log('\n✅ Test complete! Check the screenshots to see if times are different.');
  console.log('Screenshots saved: completion-round-1.png through completion-round-4.png\n');

  await page.waitForTimeout(5000);
  await browser.close();
})();
