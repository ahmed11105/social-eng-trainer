const { chromium } = require('playwright');
const CryptoJS = require('crypto-js');

(async () => {
  console.log('🔍 Testing tweet isolation between rounds...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 800,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const roundData = [];

  try {
    // Helper to complete a round quickly
    const completeRound = async (roundNum) => {
      console.log(`\n📋 Round ${roundNum}: Completing...`);

      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);

      // Get profile info
      const username = (await page.locator('text=/^@\\w+$/').first().textContent()).replace('@', '').trim();
      const hash = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first().textContent();

      // Get first 3 tweets for uniqueness check
      const allTweets = await page.locator('[data-testid="tweet-text"]').allTextContents();
      const firstThreeTweets = allTweets.slice(0, 3);

      console.log(`   Username: @${username}`);
      console.log(`   First tweet: "${firstThreeTweets[0]?.substring(0, 60)}..."`);

      // Quick crack attempt
      const tweets = await page.locator('[data-testid="tweet-text"]').allTextContents();
      let petName = null;
      let year = null;

      for (const tweet of tweets) {
        if (/(dog|cat|pet|companion)/i.test(tweet)) {
          const nameMatch = tweet.match(/\b([A-Z][a-z]{2,})\b/);
          if (nameMatch && !petName) petName = nameMatch[1];
        }
        const yearMatch = tweet.match(/\b(19|20)\d{2}\b/);
        if (yearMatch && !year) year = yearMatch[0];
      }

      if (!petName || !year) {
        console.log('   ⏭️  Skipping (could not extract clues)');
        const skipBtn = await page.locator('button:has-text("Skip Level")').first();
        if (await skipBtn.isVisible().catch(() => false)) {
          await skipBtn.click();
          await page.waitForTimeout(500);
          await page.locator('button:has-text("Skip Level")').last().click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);
        }
        return null;
      }

      const password = `${petName.toLowerCase()}${year}`;
      const testHash = CryptoJS.MD5(password).toString();

      if (testHash !== hash) {
        console.log('   ⏭️  Skipping (password crack failed)');
        const skipBtn = await page.locator('button:has-text("Skip Level")').first();
        if (await skipBtn.isVisible().catch(() => false)) {
          await skipBtn.click();
          await page.waitForTimeout(500);
          await page.locator('button:has-text("Skip Level")').last().click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);
        }
        return null;
      }

      // Login
      await page.goto('http://localhost:3000/login');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await page.locator('input[type="text"]').fill(username);
      await page.locator('input[type="password"]').fill(password);
      await page.locator('button:has-text("Login")').click();
      await page.waitForTimeout(2000);

      if (page.url() !== 'http://localhost:3000/') {
        console.log('   ❌ Login failed');
        return null;
      }

      // Delete sensitive tweets
      let deleted = 0;
      while (true) {
        const warning = await page.locator('text=Contains Password Clue').first();
        if (!(await warning.isVisible().catch(() => false))) break;

        const deleteButtons = await page.locator('button:has-text("Delete")').all();
        if (deleteButtons.length === 0) break;

        await deleteButtons[0].click();
        deleted++;
        await page.waitForTimeout(400);
      }

      console.log(`   ✅ Completed (deleted ${deleted} tweets)`);

      // Close modal if it appears
      await page.waitForTimeout(1500);
      const closeBtn = await page.locator('button[aria-label="Close"]').first();
      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click();
        await page.waitForTimeout(1000);
      }

      // Click Next Round
      const nextBtn = await page.locator('button:has-text("Next Round")').first();
      if (await nextBtn.isVisible().catch(() => false)) {
        await nextBtn.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
      }

      return {
        roundNum,
        username,
        firstThreeTweets,
      };
    };

    // Complete 2 rounds
    const round1 = await completeRound(1);
    const round2 = await completeRound(2);

    if (!round1 || !round2) {
      console.log('\n❌ Could not complete both rounds, test cannot continue\n');
      await page.waitForTimeout(10000);
      await browser.close();
      return;
    }

    roundData.push(round1, round2);

    console.log('\n' + '='.repeat(60));
    console.log('🧪 Testing Tweet Isolation Bug');
    console.log('='.repeat(60));

    console.log('\n📍 Step 1: On Round 2, navigate to Round 1...');

    // Click "1" button to view round 1
    const round1Button = await page.locator('button:has-text("1")').filter({ hasNotText: 'Prev' }).first();
    await round1Button.click();
    await page.waitForTimeout(1500);

    const round1Username = await page.locator('text=/^@\\w+$/').first().textContent();
    console.log(`   Viewing: ${round1Username}`);
    console.log(`   ${round1Username.includes(round1.username) ? '✅' : '❌'} Correct profile shown`);

    const round1Tweets = await page.locator('[data-testid="tweet-text"]').allTextContents();
    const round1FirstTweet = round1Tweets[0];
    console.log(`   First tweet: "${round1FirstTweet?.substring(0, 60)}..."`);

    console.log('\n📍 Step 2: Navigate back to Round 2...');

    // Click "2" button to return to round 2
    const round2Button = await page.locator('button:has-text("2")').filter({ hasNotText: 'Next' }).first();
    await round2Button.click();
    await page.waitForTimeout(1500);

    const round2Username = await page.locator('text=/^@\\w+$/').first().textContent();
    console.log(`   Viewing: ${round2Username}`);
    console.log(`   ${round2Username.includes(round2.username) ? '✅' : '❌'} Correct profile shown`);

    const round2Tweets = await page.locator('[data-testid="tweet-text"]').allTextContents();
    const round2FirstTweet = round2Tweets[0];
    console.log(`   First tweet: "${round2FirstTweet?.substring(0, 60)}..."`);

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESULTS');
    console.log('='.repeat(60));

    // Check if tweets are isolated
    const tweetsMatch = round2FirstTweet === round1FirstTweet;

    if (tweetsMatch) {
      console.log('\n❌ BUG DETECTED: Round 2 shows Round 1\'s tweets!');
      console.log(`   Round 1 first tweet: "${round1.firstThreeTweets[0]?.substring(0, 60)}..."`);
      console.log(`   Round 2 first tweet: "${round2.firstThreeTweets[0]?.substring(0, 60)}..."`);
      console.log(`   Current first tweet:  "${round2FirstTweet?.substring(0, 60)}..."`);
    } else {
      console.log('\n✅ TWEETS ARE ISOLATED!');
      console.log(`   Round 1: "${round1.firstThreeTweets[0]?.substring(0, 60)}..."`);
      console.log(`   Round 2: "${round2.firstThreeTweets[0]?.substring(0, 60)}..."`);
      console.log(`   ${round2.firstThreeTweets.includes(round2FirstTweet) ? '✅' : '❌'} Round 2 shows its original tweets`);
    }

    console.log('\n' + '='.repeat(60));
    console.log(tweetsMatch ? '❌ TEST FAILED' : '✅ TEST PASSED');
    console.log('='.repeat(60));

    console.log('\n\nBrowser will stay open for 15 seconds...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await browser.close();
  }
})();
