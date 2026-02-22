import { test } from '@playwright/test';

test('Grab real profile for cracking tutorial', async ({ page }) => {
  console.log('\n🎯 GRABBING REAL MEDIUM MODE PROFILE\n');
  console.log('='.repeat(70) + '\n');

  await page.goto('https://social-eng-trainer.vercel.app');
  await page.waitForTimeout(2000);

  // Switch to Medium
  const mediumBtn = page.locator('button:has-text("Medium")').first();
  await mediumBtn.click();
  await page.waitForTimeout(2000);

  // Get hash
  const hash = await page.locator('text=/[a-f0-9]{64}/i').first().textContent();
  console.log('🔐 SHA-256 HASH:');
  console.log(hash);
  console.log('');

  // Save hash to file
  const fs = require('fs');
  fs.writeFileSync('/tmp/hash.txt', hash?.trim() || '');
  console.log('✓ Hash saved to /tmp/hash.txt\n');

  // Get username
  const username = await page.locator('text=/@\\w+/').first().textContent();
  console.log(`👤 USERNAME: ${username}\n`);

  // Get bio
  try {
    const bioElements = await page.locator('.text-gray-300, .text-gray-400').allTextContents();
    const bio = bioElements.find(text => text.length > 30 && text.length < 300);
    if (bio) {
      console.log(`📝 BIO: ${bio.substring(0, 120)}...\n`);
    }
  } catch (e) {}

  // Take screenshot
  await page.screenshot({ path: '/tmp/medium-profile.png', fullPage: true });
  console.log('📸 Screenshot saved to /tmp/medium-profile.png\n');

  console.log('='.repeat(70));
  console.log('\n📋 NEXT STEPS:\n');
  console.log('1. Visit https://social-eng-trainer.vercel.app in YOUR browser');
  console.log('2. Click "Medium" difficulty');
  console.log('3. Read the profile and tweets carefully');
  console.log('4. Look for: pet names, years, locations');
  console.log('5. Build your wordlist based on the clues');
  console.log('6. Run hashcat with the hash from above!\n');
});
