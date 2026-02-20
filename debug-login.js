const { chromium } = require('playwright');
const CryptoJS = require('crypto-js');

(async () => {
  console.log('🔍 DEBUG: Testing login flow on localhost...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  // Enable console logging from the browser
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error));

  try {
    // Step 1: Go to homepage
    console.log('Step 1: Going to homepage...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Wait for profile to load
    await page.waitForSelector('[data-testid="tweet-text"]', { timeout: 10000 });
    console.log('✓ Profile loaded\n');

    // Step 2: Get username
    console.log('Step 2: Getting username...');
    const usernameElement = await page.locator('text=/^@\\w+$/').first();
    const usernameWithAt = await usernameElement.textContent();
    const username = usernameWithAt.replace('@', '').trim();
    console.log(`   Username found: ${username} (displayed as: ${usernameWithAt})\n`);

    // Step 3: Get hash
    console.log('Step 3: Getting hash...');
    const hashElement = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first();
    const hash = await hashElement.textContent();
    console.log(`   Hash: ${hash}\n`);

    // Step 4: Analyze tweets and crack password
    console.log('Step 4: Analyzing tweets...');
    const tweets = await page.locator('[data-testid="tweet-text"]').allTextContents();
    console.log(`   Found ${tweets.length} tweets\n`);

    let petName = null;
    let year = null;

    for (const tweet of tweets) {
      const petWords = /(dog|cat|pet|puppy|kitten|adopted|got\s+|companion)/i;
      if (petWords.test(tweet)) {
        const nameMatch = tweet.match(/\b([A-Z][a-z]{2,})\b/);
        if (nameMatch && !petName) {
          petName = nameMatch[1];
          console.log(`   Found pet name: ${petName}`);
        }
      }

      const yearMatch = tweet.match(/\b(19|20)\d{2}\b/);
      if (yearMatch && !year) {
        year = yearMatch[0];
        console.log(`   Found year: ${year}`);
      }
    }

    console.log('\nStep 5: Checking for sensitive tweet markers...');
    const sensitiveMarkers = await page.locator('text=Contains Password Clue').count();
    console.log(`   Sensitive markers visible: ${sensitiveMarkers}`);

    // Check if any tweets have the red background
    const redTweets = await page.locator('.bg-red-900\\/10').count();
    console.log(`   Tweets with red background: ${redTweets}\n`);

    // Step 6: Crack password
    console.log('Step 6: Cracking password...');
    const wordlist = [
      `${petName.toLowerCase()}${year}`,
      `${year}${petName.toLowerCase()}`,
      `${petName.toLowerCase()}${year.slice(-2)}`,
    ];
    console.log(`   Wordlist: ${wordlist.join(', ')}`);

    let crackedPassword = null;
    for (const word of wordlist) {
      const testHash = CryptoJS.MD5(word).toString();
      if (testHash === hash) {
        crackedPassword = word;
        console.log(`   ✅ CRACKED: ${crackedPassword} (hash: ${testHash})\n`);
        break;
      }
    }

    if (!crackedPassword) {
      console.log('   ❌ Could not crack password\n');
      await browser.close();
      return;
    }

    // Step 7: Check game state in localStorage
    console.log('Step 7: Checking game state...');
    const gameState = await page.evaluate(() => {
      const state = localStorage.getItem('gameState');
      if (!state) return null;
      const parsed = JSON.parse(state);
      return {
        profileUsername: parsed.currentProfile?.profile?.username,
        passwordHash: parsed.currentProfile?.passwordHash,
        password: parsed.currentProfile?.password,
      };
    });
    console.log('   Game state:', JSON.stringify(gameState, null, 2));
    console.log('');

    // Step 8: Navigate to login
    console.log('Step 8: Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    console.log('   Current URL:', page.url());
    console.log('');

    // Step 9: Check login form state
    console.log('Step 9: Checking login form...');
    const formProfile = await page.evaluate(() => {
      const state = localStorage.getItem('gameState');
      if (!state) return null;
      const parsed = JSON.parse(state);
      return {
        profileUsername: parsed.currentProfile?.profile?.username,
        passwordHash: parsed.currentProfile?.passwordHash,
      };
    });
    console.log('   Profile from form context:', JSON.stringify(formProfile, null, 2));
    console.log('');

    // Step 10: Fill and submit login
    console.log('Step 10: Filling login form...');
    const usernameInput = await page.locator('input[type="text"]').first();
    const passwordInput = await page.locator('input[type="password"]').first();

    await usernameInput.fill(username);
    await passwordInput.fill(crackedPassword);
    console.log(`   Filled username: "${username}"`);
    console.log(`   Filled password: "${crackedPassword}"`);
    console.log('');

    console.log('Step 11: Submitting form...');
    const loginButton = await page.locator('button:has-text("Login")').first();
    await loginButton.click();
    await page.waitForTimeout(3000);

    const finalUrl = page.url();
    console.log(`   Final URL: ${finalUrl}`);

    // Check for error message
    const errorMessage = await page.locator('text=Invalid credentials').isVisible().catch(() => false);
    console.log(`   Error visible: ${errorMessage}`);

    if (finalUrl === 'http://localhost:3000/') {
      console.log('   ✅ LOGIN SUCCESSFUL!\n');

      // Check if authenticated
      const isAuth = await page.evaluate(() => {
        return localStorage.getItem('authToken') === 'authenticated';
      });
      console.log(`   Authenticated in localStorage: ${isAuth}`);
    } else {
      console.log('   ❌ LOGIN FAILED - Still on login page\n');
    }

    console.log('\n🔍 Debug complete. Browser will stay open for 30 seconds...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await browser.close();
  }
})();
