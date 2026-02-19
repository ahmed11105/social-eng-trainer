import { test } from '@playwright/test';

test('debug profile output', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForSelector('[data-testid="profile-bio"]', { timeout: 5000 });

  const displayName = await page.locator('[data-testid="profile-display-name"]').textContent();
  const username = await page.locator('[data-testid="profile-username"]').textContent();
  const bio = await page.locator('[data-testid="profile-bio"]').textContent();

  console.log('\n========== PROFILE ==========');
  console.log('Name:', displayName);
  console.log('Username:', username);
  console.log('Bio:', bio);

  const tweetElements = await page.locator('[data-testid="tweet-text"]').all();
  const tweets = await Promise.all(tweetElements.map(t => t.textContent()));

  console.log('\n========== ALL TWEETS (', tweets.length, ') ==========');
  tweets.forEach((t, i) => {
    console.log(`${i + 1}. ${t}`);
  });

  console.log('\n========== PET CLUE CHECK ==========');
  const petTweets = tweets.filter(t => t && /\d{4}/.test(t));
  console.log('Tweets with years:', petTweets.length);
  petTweets.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t}`);
  });

  const petClueTweets = tweets.filter(t => t && /\d{4}/.test(t) && (
    t.toLowerCase().includes('adopt') ||
    t.toLowerCase().includes('year') ||
    t.toLowerCase().includes('got') ||
    t.toLowerCase().includes('since')
  ));
  console.log('\nPet clue tweets found:', petClueTweets.length);
  petClueTweets.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t}`);
  });

  console.log('\n========== CAPITALIZATION CHECK ==========');
  const capitalizedTweets = tweets.filter(t => t && /^[A-Z]/.test(t));
  console.log('Tweets starting with capital:', capitalizedTweets.length, '/', tweets.length);
  const lowercaseTweets = tweets.filter(t => t && /^[a-z@]/.test(t));
  console.log('Tweets starting with lowercase:', lowercaseTweets.length, '/', tweets.length);
});
