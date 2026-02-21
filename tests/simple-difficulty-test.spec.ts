import { test } from '@playwright/test';

test('Get passwords from Medium and Hard modes', async ({ page }) => {
  console.log('\n🎮 TESTING MEDIUM & HARD PASSWORDS\n');
  console.log('==========================================\n');

  // Test MEDIUM
  await page.goto('https://social-eng-trainer.vercel.app');
  await page.waitForLoadState('networkidle');
  
  const mediumBtn = page.locator('button:has-text("Medium")').first();
  await mediumBtn.click();
  await page.waitForTimeout(2000);
  
  console.log('🟡 MEDIUM MODE ACTIVATED');
  
  // Get hash from banner
  const mediumHashText = await page.locator('text=/[a-f0-9]{32,}/i').first().textContent();
  console.log(`   Hash: ${mediumHashText?.substring(0, 16)}... (${mediumHashText?.length} chars = ${mediumHashText?.length === 64 ? 'SHA-256 ✓' : 'MD5'})`);

  // Go to login and get hint
  await page.goto('https://social-eng-trainer.vercel.app/login');
  await page.waitForTimeout(1500);

  const usernameInput = page.locator('input[placeholder*="username"]').first();
  const passwordInput = page.locator('input[placeholder*="password"]').first();
  const loginButton = page.locator('button:has-text("Login")').first();

  // Fail 3 times
  for (let i = 0; i < 3; i++) {
    await usernameInput.fill('wrong');
    await passwordInput.fill('wrong');
    await loginButton.click();
    await page.waitForTimeout(1000);
  }

  const showHint = page.locator('button:has-text("Show Hint")');
  await showHint.waitFor({ timeout: 10000 });
  await showHint.click();
  await page.waitForTimeout(500);

  const hintContent = await page.locator('.bg-blue-200').textContent();
  const mediumPwd = hintContent?.match(/Password:\s*(\S+)/i)?.[1] || '';
  
  console.log(`   Password: ${mediumPwd}`);
  console.log(`   ✓ Capitalized: ${/[A-Z]/.test(mediumPwd) ? 'YES' : 'NO'}`);
  console.log(`   ✓ Special chars: ${/[!@#$*]/.test(mediumPwd) ? 'YES' : 'NO'}`);

  // Test HARD
  console.log('\n🔴 HARD MODE ACTIVATED');
  
  await page.goto('https://social-eng-trainer.vercel.app');
  await page.waitForTimeout(1500);
  
  const hardBtn = page.locator('button:has-text("Hard")').first();
  await hardBtn.click();
  await page.waitForTimeout(2000);

  const hardHashText = await page.locator('text=/[a-f0-9]{32,}/i').first().textContent();
  console.log(`   Hash: ${hardHashText?.substring(0, 16)}... (${hardHashText?.length} chars = ${hardHashText?.length === 64 ? 'SHA-256 ✓' : 'MD5'})`);

  await page.goto('https://social-eng-trainer.vercel.app/login');
  await page.waitForTimeout(1500);

  for (let i = 0; i < 3; i++) {
    await usernameInput.fill('wrong');
    await passwordInput.fill('wrong');
    await loginButton.click();
    await page.waitForTimeout(1000);
  }

  await showHint.waitFor({ timeout: 10000 });
  await showHint.click();
  await page.waitForTimeout(500);

  const hardHint = await page.locator('.bg-blue-200').textContent();
  const hardPwd = hardHint?.match(/Password:\s*(\S+)/i)?.[1] || '';
  
  console.log(`   Password: ${hardPwd}`);
  console.log(`   ✓ Capitalized: ${/[A-Z]/.test(hardPwd) ? 'YES' : 'NO'}`);
  console.log(`   ✓ Special chars: ${/[!@#$*]/.test(hardPwd) ? 'YES' : 'NO'}`);
  console.log(`   ✓ Leetspeak: ${/[3-9]/.test(hardPwd.replace(/\d{2,4}$/, '')) ? 'LIKELY' : 'NO'}`);

  console.log('\n📊 COMPARISON:\n');
  console.log(`   🟡 Medium: ${mediumPwd}`);
  console.log(`   🔴 Hard:   ${hardPwd}`);
  console.log('\n✅ Test complete!\n');
});
