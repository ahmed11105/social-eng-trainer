import { test } from '@playwright/test';
import crypto from 'crypto';

test('play 5 levels of the game', async ({ page }) => {
  await page.goto('http://localhost:3000');

  for (let level = 1; level <= 5; level++) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`LEVEL ${level}`);
    console.log('='.repeat(60));

    // Wait for profile to load
    await page.waitForSelector('[data-testid="profile-display-name"]', { timeout: 5000 });

    // Extract profile information
    const displayName = await page.locator('[data-testid="profile-display-name"]').textContent() || '';
    const username = await page.locator('[data-testid="profile-username"]').textContent() || '';
    const bio = await page.locator('[data-testid="profile-bio"]').textContent() || '';
    const location = await page.locator('text=📍').textContent() || '';

    console.log('\n📋 PROFILE INFO:');
    console.log('Name:', displayName);
    console.log('Username:', username);
    console.log('Bio:', bio);
    console.log('Location:', location);

    // Get the hash
    const hashElement = await page.locator('code.text-green-400').textContent();
    console.log('\n🔐 Target Hash:', hashElement);

    // Extract all tweets
    const tweetElements = await page.locator('[data-testid="tweet-text"]').all();
    const tweets: string[] = [];
    for (const tweet of tweetElements) {
      const text = await tweet.textContent();
      if (text) tweets.push(text.trim());
    }

    console.log('\n📱 TWEETS:', tweets.length, 'total');
    tweets.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));

    // OSINT Analysis - find clues
    console.log('\n🔍 OSINT ANALYSIS:');

    // Find pet clues (name + year)
    const petClues: string[] = [];
    tweets.forEach(t => {
      const yearMatch = t.match(/\b(20\d{2}|201\d)\b/);
      if (yearMatch) {
        console.log(`  🐾 Pet clue found: "${t}"`);
        // Extract potential pet name (capitalized word before or after year)
        const words = t.split(/\s+/);
        const yearIndex = words.findIndex(w => w.includes(yearMatch[0]));
        if (yearIndex > 0) {
          const potentialName = words[yearIndex - 1].replace(/[^a-zA-Z]/g, '');
          if (potentialName && /^[A-Z]/.test(potentialName)) {
            petClues.push(`${potentialName.toLowerCase()}${yearMatch[0]}`);
            console.log(`    → Candidate: ${potentialName.toLowerCase()}${yearMatch[0]}`);
          }
        }
      }
    });

    // Build wordlist from common patterns
    const wordlist: string[] = [];

    // Add pet name + year combinations
    wordlist.push(...petClues);

    // Add location-based passwords
    const locationWords = location.match(/[A-Z][a-z]+/g) || [];
    locationWords.forEach(loc => {
      wordlist.push(loc.toLowerCase());
      tweets.forEach(t => {
        const years = t.match(/\b(20\d{2}|201\d)\b/g) || [];
        years.forEach(year => wordlist.push(`${loc.toLowerCase()}${year}`));
      });
    });

    console.log('\n📝 WORDLIST:', wordlist.length, 'candidates');
    console.log(wordlist.slice(0, 10).join(', '), '...');

    // Try to crack the hash
    console.log('\n🔨 CRACKING...');
    let foundPassword = '';
    for (const candidate of wordlist) {
      const hash = crypto.createHash('md5').update(candidate).digest('hex');
      if (hash === hashElement) {
        foundPassword = candidate;
        console.log(`✅ PASSWORD FOUND: ${foundPassword}`);
        break;
      }
    }

    if (!foundPassword) {
      console.log('❌ PASSWORD NOT FOUND in wordlist');
      console.log('🤔 ISSUES DETECTED:');
      console.log('   - Pet clues might not be clear enough');
      console.log('   - Need better clue extraction logic');

      // Try some common patterns as fallback
      const nameWords = displayName.split(' ');
      const bioWords = bio.match(/[A-Z][a-z]+/g) || [];

      console.log('\n🔍 Trying fallback patterns...');
      const fallbackList = [
        ...nameWords.map(n => n.toLowerCase()),
        ...bioWords.map(b => b.toLowerCase()),
      ];

      tweets.forEach(t => {
        const years = t.match(/\b(20\d{2}|201\d)\b/g) || [];
        years.forEach(year => {
          fallbackList.forEach(word => {
            wordlist.push(`${word}${year}`);
          });
        });
      });

      for (const candidate of wordlist) {
        const hash = crypto.createHash('md5').update(candidate).digest('hex');
        if (hash === hashElement) {
          foundPassword = candidate;
          console.log(`✅ PASSWORD FOUND (fallback): ${foundPassword}`);
          break;
        }
      }
    }

    if (foundPassword) {
      // Navigate to login page
      await page.goto('http://localhost:3000/login');
      await page.waitForSelector('input[type="password"]');

      // Enter username (extract from username field which has @ prefix)
      const usernameWithoutAt = username.replace('@', '');
      await page.fill('input[type="text"]', usernameWithoutAt);

      // Enter password
      await page.fill('input[type="password"]', foundPassword);
      await page.click('button:has-text("Login")');

      // Wait for redirect back to main page
      await page.waitForURL('http://localhost:3000', { timeout: 10000 });
      await page.waitForTimeout(500);

      // Make a post
      const textarea = page.locator('textarea[placeholder*="What\'s happening"]');
      await textarea.fill('Just cracked this password! 🎉');
      await page.click('button:has-text("Post")');

      console.log('✅ Posted tweet - round should complete');
      await page.waitForTimeout(1000);

      // Check if completion modal appears
      const modalVisible = await page.locator('text=Round Complete').isVisible().catch(() => false);
      if (modalVisible) {
        console.log('✅ Completion modal appeared');

        // Click Next Round
        await page.click('button:has-text("Next Round")');
        console.log('✅ Started next round');
        await page.waitForTimeout(500);
      } else {
        console.log('⚠️  Completion modal did not appear - might need to check timing');
        // Try to start new round manually by clearing localStorage
        await page.evaluate(() => localStorage.clear());
        await page.reload();
      }
    } else {
      console.log('❌ FAILED TO CRACK - skipping to next level');
      await page.evaluate(() => localStorage.clear());
      await page.reload();
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('GAME COMPLETED - 5 LEVELS PLAYED');
  console.log('='.repeat(60));
});
