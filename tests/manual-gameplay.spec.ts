import { test, expect } from '@playwright/test';

test('Manual gameplay test - Skip through levels and compare tweets', async ({ page }) => {
  // Capture console logs
  page.on('console', msg => {
    if (msg.text().includes('[ProfileGen]') || msg.text().includes('[SkipLevel]')) {
      console.log('BROWSER:', msg.text());
    }
  });

  await page.goto('https://social-eng-trainer.vercel.app');
  await page.waitForLoadState('networkidle');

  // Clear localStorage to ensure fresh state
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForLoadState('networkidle');

  console.log('\n🎮 Starting manual gameplay test...\n');

  // Play through 5 profiles
  for (let round = 1; round <= 5; round++) {
    console.log(`\n========== ROUND ${round} ==========`);

    // Wait for profile to load
    await page.waitForTimeout(2000);

    // Get profile name
    const profileName = await page.locator('h1').first().textContent();
    console.log(`👤 Profile: ${profileName}`);

    // Get bio
    const bio = await page.locator('p').first().textContent();
    console.log(`📝 Bio: ${bio}`);

    // Get all tweets - wait for at least one to be visible
    await page.waitForSelector('p.mt-2.text-white', { timeout: 10000 });

    // Get all tweet paragraphs
    const tweetTexts = await page.locator('p.mt-2.text-white').allTextContents();

    console.log(`\n📱 Tweets (${tweetTexts.length} total):`);

    for (let i = 0; i < Math.min(tweetTexts.length, 7); i++) {
      console.log(`  ${i + 1}. ${tweetTexts[i]?.slice(0, 80)}...`);
    }

    // Take screenshot
    await page.screenshot({ path: `test-results/round-${round}-profile.png`, fullPage: true });
    console.log(`📸 Screenshot saved: round-${round}-profile.png`);

    if (round < 5) {
      console.log('\n⏭️ Clicking Skip Level...');

      // Set up dialog handler BEFORE clicking
      page.once('dialog', async dialog => {
        await dialog.accept();
      });

      await page.getByText('Skip Level').click();
      await page.waitForTimeout(2000); // Wait for new profile to load
    }
  }

  console.log('\n✅ Test complete! Check the screenshots and console output.\n');
});

test('Try to complete a level', async ({ page }) => {
  await page.goto('https://social-eng-trainer.vercel.app');
  await page.waitForLoadState('networkidle');

  console.log('\n🎯 Attempting to complete a level...\n');

  // Get the hash
  const hash = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first().textContent();
  console.log(`🔐 Hash: ${hash}`);

  // Get profile info for clues
  const profileName = await page.locator('h1').first().textContent();
  const bio = await page.locator('p').first().textContent();

  console.log(`👤 Profile: ${profileName}`);
  console.log(`📝 Bio: ${bio}`);

  // Look for pet tweet
  const tweets = await page.locator('[class*="border-b"][class*="border-gray-800"]').allTextContents();
  const petTweet = tweets.find(t => t.includes('years since'));
  console.log(`🐕 Pet clue: ${petTweet?.slice(0, 100)}`);

  console.log('\n💡 To complete this level manually:');
  console.log('1. Build wordlist based on clues above');
  console.log('2. Run: hashcat -m 0 -a 0 hash.txt wordlist.txt');
  console.log('3. Login with cracked password');
  console.log('4. Make a post');

  await page.screenshot({ path: 'test-results/level-to-solve.png', fullPage: true });
});
