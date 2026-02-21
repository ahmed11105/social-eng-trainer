import { test } from '@playwright/test';

test('Test Medium and Hard difficulties', async ({ page }) => {
  console.log('\n🎮 TESTING MEDIUM & HARD MODES\n');
  console.log('==========================================\n');

  // Navigate to production site
  await page.goto('https://social-eng-trainer.vercel.app');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Test MEDIUM difficulty
  console.log('🟡 TESTING MEDIUM MODE\n');
  
  // Click Medium difficulty button
  const mediumButton = page.locator('button:has-text("Medium")').first();
  await mediumButton.click();
  await page.waitForTimeout(1000);
  
  console.log('✓ Switched to Medium difficulty (SHA-256)');
  
  // Get profile information
  const bioText = await page.locator('[class*="bio"]').first().textContent() || '';
  console.log(`\nProfile Bio: ${bioText.substring(0, 100)}...`);
  
  // Get hash
  const hashBanner = await page.locator('text=/[a-f0-9]{64}/i').first().textContent();
  console.log(`\nSHA-256 Hash: ${hashBanner?.substring(0, 20)}...`);
  
  // Get a few tweets to see clues
  const tweets = await page.locator('[class*="tweet"]').allTextContents();
  console.log(`\nSample Tweets (${tweets.length} total):`);
  tweets.slice(0, 3).forEach((tweet, i) => {
    console.log(`  ${i + 1}. ${tweet.substring(0, 80)}...`);
  });

  // Go to login page and try to get hint
  await page.goto('https://social-eng-trainer.vercel.app/login');
  await page.waitForTimeout(1000);

  // Fail 3 times to get hint
  console.log('\n🔓 Getting password hint...');
  const usernameInput = page.locator('input[placeholder*="username"]').first();
  const passwordInput = page.locator('input[placeholder*="password"]').first();
  const loginButton = page.locator('button:has-text("Login")').first();

  for (let i = 0; i < 3; i++) {
    await usernameInput.fill('test');
    await passwordInput.fill('wrong');
    await loginButton.click();
    await page.waitForTimeout(800);
  }

  // Click Show Hint
  const showHintBtn = page.locator('button:has-text("Show Hint")');
  await showHintBtn.waitFor({ state: 'visible', timeout: 5000 });
  await showHintBtn.click();
  await page.waitForTimeout(500);

  // Get password from hint
  const hintText = await page.locator('.bg-blue-200').first().textContent();
  const mediumPassword = hintText?.match(/Password:\s*(\S+)/i)?.[1] || '';
  
  console.log(`\n🟡 MEDIUM PASSWORD: ${mediumPassword}`);
  console.log(`   Pattern: ${/[A-Z]/.test(mediumPassword) ? 'Capitalized ✓' : 'lowercase'}`);
  console.log(`   Special chars: ${/[!@#$*]/.test(mediumPassword) ? 'Yes' : 'No'}`);
  console.log(`   Separator: ${/[_\-]/.test(mediumPassword) ? 'Yes' : 'No'}`);

  // Take screenshot
  await page.screenshot({ path: '/tmp/medium-mode-test.png' });
  console.log('\n📸 Screenshot saved: /tmp/medium-mode-test.png');

  // Now test HARD mode
  console.log('\n\n🔴 TESTING HARD MODE\n');
  
  // Go back home
  await page.goto('https://social-eng-trainer.vercel.app');
  await page.waitForTimeout(1000);

  // Click Hard difficulty
  const hardButton = page.locator('button:has-text("Hard")').first();
  await hardButton.click();
  await page.waitForTimeout(1000);
  
  console.log('✓ Switched to Hard difficulty (SHA-256 + Complex)');

  // Get hash
  await page.waitForTimeout(1000);
  const hardHash = await page.locator('text=/[a-f0-9]{64}/i').first().textContent();
  console.log(`\nSHA-256 Hash: ${hardHash?.substring(0, 20)}...`);

  // Go to login
  await page.goto('https://social-eng-trainer.vercel.app/login');
  await page.waitForTimeout(1000);

  // Fail to get hint
  console.log('\n🔓 Getting password hint...');
  for (let i = 0; i < 3; i++) {
    await usernameInput.fill('test');
    await passwordInput.fill('wrong');
    await loginButton.click();
    await page.waitForTimeout(800);
  }

  await showHintBtn.waitFor({ state: 'visible', timeout: 5000 });
  await showHintBtn.click();
  await page.waitForTimeout(500);

  const hardHintText = await page.locator('.bg-blue-200').first().textContent();
  const hardPassword = hardHintText?.match(/Password:\s*(\S+)/i)?.[1] || '';
  
  console.log(`\n🔴 HARD PASSWORD: ${hardPassword}`);
  console.log(`   Pattern: ${/[A-Z]/.test(hardPassword) ? 'Mixed case ✓' : 'lowercase'}`);
  console.log(`   Special chars: ${/[!@#$*]/.test(hardPassword) ? 'Yes ✓' : 'No'}`);
  console.log(`   Separator: ${/[_\-.]/.test(hardPassword) ? 'Yes' : 'No'}`);
  console.log(`   Leetspeak: ${/[0-9]/.test(hardPassword.replace(/\d{4}|\d{2}$/, '')) ? 'Possible ✓' : 'No'}`);

  // Take screenshot
  await page.screenshot({ path: '/tmp/hard-mode-test.png' });
  console.log('\n📸 Screenshot saved: /tmp/hard-mode-test.png');

  console.log('\n\n✅ DIFFICULTY TEST COMPLETE!\n');
  console.log('Summary:');
  console.log(`  🟡 Medium: ${mediumPassword}`);
  console.log(`  🔴 Hard:   ${hardPassword}`);
  console.log('\n');
});
