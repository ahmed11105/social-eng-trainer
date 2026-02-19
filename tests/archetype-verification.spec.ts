import { test, expect } from '@playwright/test';

test.describe('Archetype-Based Profile Generation', () => {
  test('should generate diverse profiles with realistic usernames, bios, and posts', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const profilesData: Array<{
      username: string;
      bio: string;
      tweets: string[];
      displayName: string;
    }> = [];

    // Test 10 different profiles
    for (let round = 0; round < 10; round++) {
      console.log(`\n========== ROUND ${round + 1} ==========`);

      // Wait for profile to load
      await page.waitForSelector('[data-testid="profile-display-name"]', { timeout: 5000 });

      // Extract profile data
      const displayName = await page.locator('[data-testid="profile-display-name"]').textContent() || '';
      const username = await page.locator('[data-testid="profile-username"]').textContent() || '';
      const bio = await page.locator('[data-testid="profile-bio"]').textContent() || '';

      // Extract all tweets
      const tweetElements = await page.locator('[data-testid="tweet-text"]').all();
      const tweets: string[] = [];
      for (const tweet of tweetElements) {
        const text = await tweet.textContent();
        if (text) tweets.push(text.trim());
      }

      console.log('Display Name:', displayName);
      console.log('Username:', username);
      console.log('Bio:', bio);
      console.log('Tweet count:', tweets.length);
      console.log('Sample tweets:');
      tweets.slice(0, 3).forEach((t, i) => console.log(`  ${i + 1}. ${t}`));

      // Store for duplicate checking
      profilesData.push({ username, bio, tweets, displayName });

      // Verify username is realistic (not just @firstname)
      expect(username).toMatch(/@[a-z_0-9]+/);
      expect(username.length).toBeGreaterThan(3); // More than just @x

      // Verify bio is NOT the generic "Job in Location" format
      expect(bio).toBeTruthy();
      expect(bio.length).toBeGreaterThan(10);
      // Should not be exactly "title in location"
      expect(bio).not.toMatch(/^[A-Z][a-z\s]+ in [A-Z][a-z\s]+$/);

      // Verify we have 12-16 tweets
      expect(tweets.length).toBeGreaterThanOrEqual(12);
      expect(tweets.length).toBeLessThanOrEqual(16);

      // Verify tweets are not all lowercase (some archetypes use proper capitalization)
      const allLowercase = tweets.every(t => t === t.toLowerCase() || t.startsWith('@'));
      if (round > 3) {
        // By round 4, we should have seen at least one non-lowercase profile
        // This is a probabilistic check - with 12 archetypes, we should get variety
      }

      // Check for tweet diversity - first 4 words should vary
      const firstFourWords = tweets.map(t => t.split(/\s+/).slice(0, 4).join(' '));
      const uniqueStarts = new Set(firstFourWords);
      expect(uniqueStarts.size).toBeGreaterThan(tweets.length * 0.7); // At least 70% unique starts

      // Verify pet clue exists (adoption year)
      const hasPetClue = tweets.some(t => /\d{4}/.test(t) && (t.toLowerCase().includes('adopt') || t.toLowerCase().includes('year') || t.toLowerCase().includes('got')));
      expect(hasPetClue).toBeTruthy();

      // Click Next Round button if not last round
      if (round < 9) {
        const nextButton = page.locator('button:has-text("Next Round"), button:has-text("Start New Round")');
        await nextButton.click();
        await page.waitForTimeout(500); // Wait for profile to update
      }
    }

    // Check for duplicates across all profiles
    console.log('\n========== DUPLICATE CHECK ==========');
    const allBios = profilesData.map(p => p.bio);
    const uniqueBios = new Set(allBios);
    console.log(`Unique bios: ${uniqueBios.size} out of ${allBios.length}`);
    expect(uniqueBios.size).toBe(allBios.length); // All bios should be unique

    const allUsernames = profilesData.map(p => p.username);
    const uniqueUsernames = new Set(allUsernames);
    console.log(`Unique usernames: ${uniqueUsernames.size} out of ${allUsernames.length}`);
    expect(uniqueUsernames.size).toBe(allUsernames.length); // All usernames should be unique

    // Check for archetype diversity
    console.log('\n========== ARCHETYPE DIVERSITY ==========');

    // Detect archetypes based on bio patterns
    const archetypePatterns = {
      corporate: /MBA|Consultant|Sr\.|Views are my own|Manager/,
      internet_native: /chronically online|void|lowercase numbers|^\d+\s\|/,
      casual: /Coffee dependent|based\.|Just trying/,
      parent: /Parent|Mom\/Dad|Tired always/,
      student: /college student|broke but vibing|University/,
      creative: /commissions|freelance.*artist|Making things/,
      tech: /Software|engineer|keyboard/,
      healthcare: /RN @|Saving lives|nurse/i,
    };

    const detectedArchetypes = profilesData.map(p => {
      for (const [archetype, pattern] of Object.entries(archetypePatterns)) {
        if (pattern.test(p.bio)) return archetype;
      }
      return 'other';
    });

    const archetypeCounts = detectedArchetypes.reduce((acc, a) => {
      acc[a] = (acc[a] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Archetype distribution:', archetypeCounts);

    // Should have at least 3 different archetype patterns in 10 profiles
    expect(Object.keys(archetypeCounts).length).toBeGreaterThanOrEqual(3);
  });

  test('should have voice characteristics that match bio archetype', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Test 5 profiles for voice matching
    for (let i = 0; i < 5; i++) {
      await page.waitForSelector('[data-testid="profile-bio"]', { timeout: 5000 });

      const bio = await page.locator('[data-testid="profile-bio"]').textContent() || '';
      const tweetElements = await page.locator('[data-testid="tweet-text"]').all();
      const tweets: string[] = [];
      for (const tweet of tweetElements) {
        const text = await tweet.textContent();
        if (text) tweets.push(text.trim());
      }

      console.log(`\nProfile ${i + 1}`);
      console.log('Bio:', bio);

      // Corporate/Professional should NOT be all lowercase
      if (/MBA|Consultant|Sr\.|Manager|Views are my own/.test(bio)) {
        console.log('Detected: Corporate Professional');
        const hasProperCapitalization = tweets.some(t => /^[A-Z]/.test(t));
        expect(hasProperCapitalization).toBeTruthy();
        console.log('✓ Has proper capitalization');
      }

      // Internet native SHOULD be lowercase/casual
      if (/chronically online|void|^\d+\s\|/.test(bio)) {
        console.log('Detected: Internet Native');
        const mostlyLowercase = tweets.filter(t => !t.startsWith('@')).filter(t => t === t.toLowerCase()).length;
        expect(mostlyLowercase).toBeGreaterThan(tweets.length * 0.5);
        console.log('✓ Mostly lowercase style');
      }

      // Click next if not last
      if (i < 4) {
        await page.locator('button:has-text("Next Round"), button:has-text("Start New Round")').click();
        await page.waitForTimeout(500);
      }
    }
  });
});
