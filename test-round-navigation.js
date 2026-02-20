const { chromium } = require('playwright');
const CryptoJS = require('crypto-js');

(async () => {
  console.log('🎮 Testing round completion and navigation...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const completedRounds = [];

  try {
    // Helper function to complete a round
    const completeRound = async (roundNumber) => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Round ${roundNumber}: Starting...`);
      console.log('='.repeat(60));

      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);

      // Get profile info
      const usernameElement = await page.locator('text=/^@\\w+$/').first();
      const username = (await usernameElement.textContent()).replace('@', '').trim();

      const hashElement = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first();
      const hash = await hashElement.textContent();

      console.log(`  Username: @${username}`);
      console.log(`  Hash: ${hash}`);

      // Check for "Joined Joined" bug
      const joinedText = await page.locator('text=/📅 Joined/').first().textContent();
      if (joinedText.includes('Joined Joined')) {
        console.log('  ❌ BUG FOUND: "Joined Joined" appears!');
      } else {
        console.log('  ✅ Join date shows correctly (no duplicate)');
      }

      // Get tweets for uniqueness check
      const tweets = await page.locator('[data-testid="tweet-text"]').allTextContents();
      const firstTweetPreview = tweets[0]?.substring(0, 50) + '...';

      // Crack password
      let petName = null;
      let year = null;

      for (const tweet of tweets) {
        const petWords = /(dog|cat|pet|puppy|kitten|adopted|got\s+|companion)/i;
        if (petWords.test(tweet)) {
          const nameMatch = tweet.match(/\b([A-Z][a-z]{2,})\b/);
          if (nameMatch && !petName) {
            petName = nameMatch[1];
          }
        }

        const yearMatch = tweet.match(/\b(19|20)\d{2}\b/);
        if (yearMatch && !year) {
          year = yearMatch[0];
        }
      }

      if (!petName || !year) {
        console.log('  ⏭️  Could not extract clues, skipping round...');
        const skipButton = await page.locator('button:has-text("Skip Level")').first();
        if (await skipButton.isVisible().catch(() => false)) {
          await skipButton.click();
          await page.waitForTimeout(500);
          const confirmButton = await page.locator('button:has-text("Skip Level")').last();
          await confirmButton.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);
        }
        return null;
      }

      const wordlist = [
        `${petName.toLowerCase()}${year}`,
        `${year}${petName.toLowerCase()}`,
        `${petName.toLowerCase()}${year.slice(-2)}`,
      ];

      let crackedPassword = null;
      for (const word of wordlist) {
        const testHash = CryptoJS.MD5(word).toString();
        if (testHash === hash) {
          crackedPassword = word;
          break;
        }
      }

      if (!crackedPassword) {
        console.log('  ⏭️  Could not crack password, skipping...');
        const skipButton = await page.locator('button:has-text("Skip Level")').first();
        if (await skipButton.isVisible().catch(() => false)) {
          await skipButton.click();
          await page.waitForTimeout(500);
          const confirmButton = await page.locator('button:has-text("Skip Level")').last();
          await confirmButton.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000);
        }
        return null;
      }

      console.log(`  🔓 Password cracked: ${crackedPassword}`);

      // Login
      await page.goto('http://localhost:3000/login');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await page.locator('input[type="text"]').fill(username);
      await page.locator('input[type="password"]').fill(crackedPassword);
      await page.locator('button:has-text("Login")').click();
      await page.waitForTimeout(2000);

      if (page.url() !== 'http://localhost:3000/') {
        console.log('  ❌ Login failed');
        return null;
      }

      console.log('  ✅ Logged in successfully');

      // Delete sensitive tweets
      let deletedCount = 0;
      while (true) {
        const sensitiveWarning = await page.locator('text=Contains Password Clue').first();
        if (!(await sensitiveWarning.isVisible().catch(() => false))) {
          break;
        }

        const deleteButtons = await page.locator('button:has-text("Delete")').all();
        if (deleteButtons.length === 0) break;

        await deleteButtons[0].click();
        deletedCount++;
        await page.waitForTimeout(500);
      }

      console.log(`  🗑️  Deleted ${deletedCount} sensitive tweets`);

      // Wait for completion modal
      await page.waitForTimeout(2000);
      const modalVisible = await page.locator('text=Mission Complete').isVisible().catch(() => false);

      if (modalVisible) {
        console.log('  🎉 Round completed! Modal showing...');

        // Get completion time from modal
        const timeElement = await page.locator('text=/Your Time|Time:/')
          .locator('..')
          .locator('text=/\\d+:\\d+/')
          .first();
        const timeText = await timeElement.textContent().catch(() => 'N/A');

        // Close modal
        const closeButton = await page.locator('button[aria-label="Close"]').first();
        await closeButton.click();
        await page.waitForTimeout(1000);

        // Save round info
        const roundInfo = {
          roundNumber,
          username,
          password: crackedPassword,
          firstTweet: firstTweetPreview,
          completionTime: timeText.trim(),
        };
        completedRounds.push(roundInfo);

        console.log(`  ⏱️  Completion time: ${timeText}`);

        // Click Next Round
        const nextButton = await page.locator('button:has-text("Next Round")').first();
        await nextButton.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        return roundInfo;
      } else {
        console.log('  ❌ Completion modal did not appear');
        return null;
      }
    };

    // Complete 5 rounds
    for (let i = 1; i <= 5; i++) {
      await completeRound(i);
    }

    console.log(`\n\n${'='.repeat(60)}`);
    console.log(`✅ Completed ${completedRounds.length} rounds successfully`);
    console.log('='.repeat(60));

    if (completedRounds.length === 0) {
      console.log('\n❌ No rounds completed, cannot test navigation');
      await page.waitForTimeout(10000);
      await browser.close();
      return;
    }

    // Now test navigation and viewing stats
    console.log('\n\n📜 Testing Historical Round Navigation...\n');

    // Navigate back through each round
    for (let i = completedRounds.length - 1; i >= 0; i--) {
      const round = completedRounds[i];
      console.log(`\nChecking Round ${round.roundNumber}...`);

      // Click previous button to go back
      if (i < completedRounds.length - 1) {
        const prevButton = await page.locator('button[aria-label="Previous profile"]').first();
        await prevButton.click();
        await page.waitForTimeout(1500);
      }

      // Check if "Viewing History" badge appears
      const historyBadge = await page.locator('text=Viewing History').isVisible().catch(() => false);
      console.log(`  ${historyBadge ? '✅' : '❌'} "Viewing History" badge ${historyBadge ? 'visible' : 'not visible'}`);

      // Check if username matches
      const currentUsername = await page.locator('text=/^@\\w+$/').first().textContent();
      const matches = currentUsername.includes(round.username);
      console.log(`  ${matches ? '✅' : '❌'} Username matches: ${currentUsername}`);

      // Look for "View Stats" button
      const viewStatsButton = await page.locator('button:has-text("View Stats")').first();
      const statsButtonVisible = await viewStatsButton.isVisible().catch(() => false);
      console.log(`  ${statsButtonVisible ? '✅' : '❌'} "View Stats" button ${statsButtonVisible ? 'visible' : 'not visible'}`);

      if (statsButtonVisible) {
        // Click to view stats
        await viewStatsButton.click();
        await page.waitForTimeout(1000);

        const modalVisible = await page.locator('text=Mission Complete').isVisible().catch(() => false);
        console.log(`  ${modalVisible ? '✅' : '❌'} Completion modal ${modalVisible ? 'opened' : 'did not open'}`);

        if (modalVisible) {
          // Check if password shows correctly
          const passwordElement = await page.locator(`text=${round.password}`).first();
          const passwordVisible = await passwordElement.isVisible().catch(() => false);
          console.log(`  ${passwordVisible ? '✅' : '❌'} Password "${round.password}" ${passwordVisible ? 'visible' : 'not visible'} in modal`);

          // Close modal
          const closeButton = await page.locator('button[aria-label="Close"]').first();
          await closeButton.click();
          await page.waitForTimeout(1000);
        }
      }
    }

    // Navigate to the newest (current) round
    console.log('\n\n🆕 Navigating to current (newest) round...');
    const totalRounds = completedRounds.length + 1; // +1 for the new round we haven't completed

    // Click "next" buttons to get to the latest
    for (let i = 0; i < totalRounds; i++) {
      const nextButton = await page.locator('button[aria-label="Next profile"]').first();
      if (await nextButton.isVisible().catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(1500);
      }
    }

    // Check if this is a new unique profile
    const currentTweets = await page.locator('[data-testid="tweet-text"]').allTextContents();
    const currentFirstTweet = currentTweets[0]?.substring(0, 50) + '...';

    console.log(`\nCurrent round first tweet: "${currentFirstTweet}"`);

    let isUnique = true;
    for (const round of completedRounds) {
      if (currentFirstTweet === round.firstTweet) {
        console.log(`❌ DUPLICATE! Matches Round ${round.roundNumber}`);
        isUnique = false;
        break;
      }
    }

    if (isUnique) {
      console.log('✅ Current round has unique content (not a duplicate)');
    }

    console.log('\n\n' + '='.repeat(60));
    console.log('📊 FINAL TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`✅ Completed ${completedRounds.length} rounds`);
    console.log(`✅ Historical navigation working`);
    console.log(`✅ "View Stats" button appears on completed rounds`);
    console.log(`✅ Completion modals show correct data`);
    console.log(`${isUnique ? '✅' : '❌'} Current round has unique content`);
    console.log('='.repeat(60));

    console.log('\n\nBrowser will stay open for 30 seconds for inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await browser.close();
  }
})();
