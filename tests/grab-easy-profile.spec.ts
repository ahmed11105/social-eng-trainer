import { test } from '@playwright/test';

test('Grab Easy mode profile and crack it', async ({ page }) => {
  console.log('\n🎯 GRABBING EASY MODE PROFILE\n');
  console.log('='.repeat(70) + '\n');

  await page.goto('https://social-eng-trainer.vercel.app');
  await page.waitForTimeout(2000);

  // Make sure we're on Easy mode (default)
  const easyBtn = page.locator('button:has-text("Easy")').first();
  await easyBtn.click();
  await page.waitForTimeout(2000);

  // Get hash
  const hash = await page.locator('text=/[a-f0-9]{32}/i').first().textContent();
  console.log('🔐 MD5 HASH:');
  console.log(hash);
  console.log('');

  // Get username
  const username = await page.locator('text=/@\\w+/').first().textContent();
  console.log(`👤 USERNAME: ${username}\n`);

  // Get name from profile
  const profileName = await page.locator('.text-xl.font-bold').first().textContent();
  console.log(`📛 NAME: ${profileName}\n`);

  // Get all tweets to find clues
  const tweets = await page.locator('[class*="border-b"]').allTextContents();

  console.log('📝 ANALYZING TWEETS FOR CLUES:\n');

  // Look for pet names, years, locations
  const petRegex = /(?:got|adopted|met|love|best friend|buddy)\s+(\w+)/gi;
  const yearRegex = /\b(19\d{2}|20\d{2})\b/g;
  const locationRegex = /(?:from|in|at|visiting)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g;

  const clues = {
    pets: new Set(),
    years: new Set(),
    locations: new Set(),
    names: new Set()
  };

  tweets.forEach(tweet => {
    // Find pets
    const petMatches = [...tweet.matchAll(petRegex)];
    petMatches.forEach(m => clues.pets.add(m[1].toLowerCase()));

    // Find years
    const yearMatches = [...tweet.matchAll(yearRegex)];
    yearMatches.forEach(m => {
      clues.years.add(m[1]);
      clues.years.add(m[1].slice(-2)); // Add 2-digit year
    });

    // Find locations
    const locMatches = [...tweet.matchAll(locationRegex)];
    locMatches.forEach(m => clues.locations.add(m[1].toLowerCase().replace(/\s+/g, '')));
  });

  // Add username parts
  const usernameParts = username?.replace('@', '').match(/[a-z]+/gi) || [];
  usernameParts.forEach(part => clues.names.add(part.toLowerCase()));

  console.log('🔍 EXTRACTED CLUES:');
  console.log(`   Pets: [${Array.from(clues.pets).join(', ')}]`);
  console.log(`   Years: [${Array.from(clues.years).join(', ')}]`);
  console.log(`   Names: [${Array.from(clues.names).join(', ')}]`);
  console.log(`   Locations: [${Array.from(clues.locations).join(', ')}]`);
  console.log('');

  // Save data for cracking
  const fs = require('fs');
  const data = {
    hash: hash?.trim(),
    pets: Array.from(clues.pets),
    years: Array.from(clues.years),
    names: Array.from(clues.names),
    locations: Array.from(clues.locations)
  };

  fs.writeFileSync('/tmp/easy-profile-data.json', JSON.stringify(data, null, 2));
  console.log('✅ Profile data saved to /tmp/easy-profile-data.json\n');
  console.log('='.repeat(70));
});
