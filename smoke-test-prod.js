const { chromium } = require('playwright');
const CryptoJS = require('crypto-js');

(async () => {
  console.log('🔍 SMOKE TEST: Testing production deployment...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 800,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  try {
    // Step 1: Load production site
    console.log('Step 1: Loading production site...');
    await page.goto('https://social-eng-trainer.vercel.app');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Wait for profile to load
    await page.waitForSelector('[data-testid="tweet-text"]', { timeout: 15000 });
    console.log('✓ Production site loaded successfully\n');

    // Step 2: Get credentials
    console.log('Step 2: Extracting credentials...');
    const usernameElement = await page.locator('text=/^@\\w+$/').first();
    const usernameWithAt = await usernameElement.textContent();
    const username = usernameWithAt.replace('@', '').trim();

    const hashElement = await page.locator('code').filter({ hasText: /^[a-f0-9]{32}$/ }).first();
    const hash = await hashElement.textContent();

    console.log(`   Username: ${username}`);
    console.log(`   Hash: ${hash}\n`);

    // Step 3: Get pet name and year from tweets
    console.log('Step 3: Analyzing tweets for password clues...');
    const tweets = await page.locator('[data-testid="tweet-text"]').allTextContents();

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

    console.log(`   Pet name: ${petName}`);
    console.log(`   Year: ${year}\n`);

    // Step 4: Crack password
    console.log('Step 4: Cracking password...');
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
        console.log(`   ✅ Password cracked: ${crackedPassword}\n`);
        break;
      }
    }

    if (!crackedPassword) {
      console.log('   ❌ Could not crack password\n');
      await browser.close();
      return;
    }

    // Step 5: Login
    console.log('Step 5: Testing login...');
    await page.goto('https://social-eng-trainer.vercel.app/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.locator('input[type="text"]').fill(username);
    await page.locator('input[type="password"]').fill(crackedPassword);
    await page.locator('button:has-text("Login")').click();
    await page.waitForTimeout(3000);

    const finalUrl = page.url();
    if (finalUrl === 'https://social-eng-trainer.vercel.app/') {
      console.log('   ✅ Login successful!\n');

      // Step 6: Check for sensitive tweet markers
      console.log('Step 6: Checking for sensitive tweet markers...');
      const sensitiveMarkers = await page.locator('text=Contains Password Clue').count();
      console.log(`   Found ${sensitiveMarkers} sensitive tweet markers\n`);

      if (sensitiveMarkers > 0) {
        console.log('   ✅ Sensitive tweets are marked correctly!\n');
      }

      console.log('🎉 Production deployment is working perfectly!');
    } else {
      console.log('   ❌ Login failed\n');
    }

    console.log('\nBrowser will stay open for 15 seconds for inspection...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await browser.close();
  }
})();
