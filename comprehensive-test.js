const { chromium } = require('playwright');
const CryptoJS = require('crypto-js');

(async () => {
  console.log('🎮 Starting comprehensive 5-round playthrough...\n');
  console.log('Opening browser in VISIBLE mode so you can watch...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 800, // Slow down so it's easy to watch
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const roundNotes = [];

  for (let roundNum = 1; roundNum <= 5; roundNum++) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🏁 ROUND ${roundNum} - Starting...`);
    console.log('='.repeat(60));

    const notes = {
      round: roundNum,
      observations: [],
      worksWell: [],
      improvements: [],
      startTime: Date.now(),
    };

    // Go to main page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('\n📊 Step 1: Analyzing profile...');

    // Get profile username - look for @username pattern
    const usernameElement = await page.locator('text=/^@\\w+$/').first();
    const username = await usernameElement.textContent();
    console.log(`   Username: ${username}`);

    // Copy hash - look in the hash banner
    const hashElement = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first();
    const hashText = await hashElement.textContent();
    console.log(`   Hash: ${hashText}`);

    const copyHashButton = await page.locator('button:has-text("Copy Hash")').first();
    await copyHashButton.click();
    notes.observations.push('✓ Hash banner visible and clickable');
    console.log('   ✓ Hash copied to clipboard');

    await page.waitForTimeout(500);

    // Gather clues from profile
    console.log('\n🔍 Step 2: Gathering OSINT clues from tweets...');

    const tweets = await page.locator('[data-testid="tweet-text"]').allTextContents();
    console.log(`   Found ${tweets.length} tweets to analyze`);

    // Extract clues
    let petName = null;
    let year = null;
    let city = null;

    for (const tweet of tweets) {
      const preview = tweet.length > 80 ? tweet.substring(0, 80) + '...' : tweet;
      console.log(`   📝 "${preview}"`);

      // Look for years (4 digits starting with 19 or 20)
      const yearMatch = tweet.match(/\b(19|20)\d{2}\b/);

      // Look for capitalized names near pet-related words
      const petWords = /(dog|cat|pet|puppy|kitten|adopted|got\s+)/i;
      if (petWords.test(tweet)) {
        const nameMatch = tweet.match(/\b([A-Z][a-z]{2,})\b/);
        if (nameMatch && !petName) {
          petName = nameMatch[1];
          console.log(`      → Found potential pet name: ${petName}`);
        }
      }

      if (yearMatch && !year) {
        year = yearMatch[0];
        console.log(`      → Found year: ${year}`);
      }
    }


    // Build wordlist
    console.log('\n🔨 Step 3: Building wordlist and cracking hash...');
    const wordlist = [];

    if (petName && year) {
      // Try common patterns
      wordlist.push(`${petName.toLowerCase()}${year}`);
      wordlist.push(`${year}${petName.toLowerCase()}`);
      wordlist.push(`${petName.toLowerCase()}${year.slice(-2)}`);
    }

    console.log(`   Wordlist: ${wordlist.join(', ')}`);

    // Crack hash
    let crackedPassword = null;
    for (const word of wordlist) {
      const hash = CryptoJS.MD5(word).toString();
      if (hash === hashText) {
        crackedPassword = word;
        console.log(`   ✅ PASSWORD CRACKED: "${crackedPassword}"`);
        break;
      }
    }

    if (!crackedPassword) {
      console.log('   ❌ Could not crack password with gathered clues');
      console.log('   ⏭️  Skipping this round...');
      const skipButton = await page.locator('button:has-text("Skip Level")').first();
      await skipButton.click();
      await page.waitForTimeout(500);
      const confirmButton = await page.locator('button:has-text("Skip Level")').last();
      await confirmButton.click();
      await page.waitForTimeout(2000);
      continue;
    }

    // Go to login page
    console.log('\n🔐 Step 4: Logging in...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check for background
    const hasBackground = await page.locator('main').evaluate(el => {
      const bg = window.getComputedStyle(el.querySelector('div')).backgroundImage;
      return bg && bg !== 'none';
    });
    notes.observations.push(hasBackground ? '✓ Login page has background image' : '✗ No background image on login');

    // Check for progress indicator
    const progressExists = await page.locator('text=Hash').count() > 0;
    notes.observations.push(progressExists ? '✓ Progress indicator visible' : '✗ No progress indicator');

    // Fill in login form
    const usernameInput = await page.locator('input[type="text"]').first();
    const passwordInput = await page.locator('input[type="password"]').first();

    const cleanUsername = username.replace('@', '').trim();
    await usernameInput.fill(cleanUsername);
    await passwordInput.fill(crackedPassword);

    console.log(`   Username: ${cleanUsername}`);
    console.log(`   Password: ${crackedPassword}`);

    const loginButton = await page.locator('button:has-text("Login")').first();
    await loginButton.click();
    await page.waitForTimeout(2000);

    // Check if login succeeded
    const isLoggedIn = await page.url() === 'http://localhost:3000/';
    if (!isLoggedIn) {
      console.log('   ❌ Login failed');
      notes.observations.push('Login failed - possible credential mismatch');
      continue;
    }

    console.log('   ✅ Login successful!');
    notes.worksWell.push('Login flow works smoothly');

    // Check for sensitive tweet markers (now that we're logged in)
    console.log('\n🗑️  Step 5: Checking and deleting sensitive tweets...');
    await page.waitForTimeout(1000);

    const sensitiveMarkers = await page.locator('text=Contains Password Clue').count();
    console.log(`   🔴 Found ${sensitiveMarkers} tweets marked with "Contains Password Clue"`);

    const redBackgrounds = await page.locator('.bg-red-900\\/10').count();
    console.log(`   🔴 Found ${redBackgrounds} tweets with red background`);
    notes.observations.push(`${sensitiveMarkers} sensitive tweet badges visible when authenticated`);

    // Delete all sensitive tweets
    let deletedCount = 0;
    while (true) {
      // Look for tweets with red background (contains sensitive info)
      const sensitiveWarning = await page.locator('text=Contains Password Clue').first();
      if (!(await sensitiveWarning.isVisible().catch(() => false))) {
        break;
      }

      // Find delete buttons
      const deleteButtons = await page.locator('button:has-text("Delete")').all();
      if (deleteButtons.length === 0) break;

      // Click the first delete button
      await deleteButtons[0].click();
      deletedCount++;
      console.log(`   Deleted sensitive tweet ${deletedCount}`);
      await page.waitForTimeout(800);
    }

    console.log(`   ✅ Deleted ${deletedCount} sensitive tweets total`);
    notes.observations.push(`Successfully deleted ${deletedCount} sensitive tweets`);

    // Wait for completion
    await page.waitForTimeout(2000);

    // Check for completion modal
    const modalVisible = await page.locator('text=Mission Complete').isVisible().catch(() => false);
    if (modalVisible) {
      console.log('\n🎉 Step 6: Round completed! Viewing completion modal...');

      await page.screenshot({ path: `round-${roundNum}-completion.png` });
      console.log(`   📸 Screenshot saved: round-${roundNum}-completion.png`);

      // Check modal elements
      const hasPassword = await page.locator('text=Password was:').isVisible().catch(() => false);
      const hasTime = await page.locator('text=Your Time').isVisible().catch(() => false);
      const hasButton = await page.locator('text=Next Challenge').isVisible().catch(() => false);

      notes.observations.push(`Modal shows: ${hasPassword ? '✓' : '✗'} Password, ${hasTime ? '✓' : '✗'} Time, ${hasButton ? '✓' : '✗'} Next button`);

      // Close modal
      const closeButton = await page.locator('button[aria-label="Close"]').first();
      await closeButton.click();
      await page.waitForTimeout(1000);

      console.log('   ✓ Modal closed');
    }

    notes.endTime = Date.now();
    notes.duration = Math.round((notes.endTime - notes.startTime) / 1000);
    console.log(`\n⏱️  Round ${roundNum} completed in ${notes.duration} seconds`);

    // Start next round
    if (roundNum < 5) {
      console.log('\n▶️  Starting next round...');
      const nextButton = await page.locator('button:has-text("Next Round")').first();
      await nextButton.click();
      await page.waitForTimeout(2000);
    }

    roundNotes.push(notes);
  }

  // Final summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📋 FINAL SUMMARY - 5 Rounds Complete');
  console.log('='.repeat(60));

  for (const note of roundNotes) {
    console.log(`\nRound ${note.round} (${note.duration}s):`);
    console.log('  Observations:');
    note.observations.forEach(obs => console.log(`    • ${obs}`));
  }

  console.log('\n✅ Test complete! Browser will stay open for 30 seconds for inspection...');
  await page.waitForTimeout(30000);

  await browser.close();
})();
