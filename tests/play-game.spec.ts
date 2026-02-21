import { test } from '@playwright/test';

test('Play through 10 rounds', async ({ page }) => {
  const rounds: { round: number; password: string }[] = [];

  console.log('\n🎮 PLAYING THROUGH 10 ROUNDS\n');
  console.log('==========================================\n');

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  for (let roundNum = 1; roundNum <= 10; roundNum++) {
    console.log(`\n🎯 Round ${roundNum}`);

    // Go to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(1000);

    // Fail 3 times to get hint
    const usernameInput = page.locator('input[placeholder*="username"]').first();
    const passwordInput = page.locator('input[placeholder*="password"]').first();
    const loginButton = page.locator('button:has-text("Login")').first();

    for (let i = 0; i < 3; i++) {
      await usernameInput.fill('wronguser');
      await passwordInput.fill('wrongpass');
      await loginButton.click();
      await page.waitForTimeout(800);
    }

    // Click "Show Hint"
    const showHintBtn = page.locator('button:has-text("Show Hint")');
    await showHintBtn.waitFor({ state: 'visible', timeout: 5000 });
    await showHintBtn.click();
    await page.waitForTimeout(500);

    // Get password from hint
    const hintContent = await page.locator('.bg-blue-200').first().textContent();
    const pwMatch = hintContent?.match(/Password:\s*(\S+)/i);
    const password = pwMatch?.[1] || '';
    
    console.log(`   Password: ${password}`);
    rounds.push({ round: roundNum, password });

    // Get username from home page
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(500);
    
    const postitText = await page.locator('.bg-yellow-200').first().textContent();
    const userMatch = postitText?.match(/@(\w+)/);
    const username = userMatch?.[1] || '';
    
    console.log(`   Username: @${username}`);

    // Login with correct credentials
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(500);
    
    await usernameInput.fill(username);
    await passwordInput.fill(password);
    await loginButton.click();
    await page.waitForTimeout(2000);

    console.log(`   ✓ Logged in`);

    // Go to home and delete sensitive tweets
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1500);

    // Find and click all delete buttons (marked sensitive tweets)
    let attempts = 0;
    while (attempts < 20) {
      const deleteBtn = page.locator('button[aria-label="Delete tweet"]').first();
      if (await deleteBtn.isVisible({ timeout: 500 })) {
        await deleteBtn.click();
        await page.waitForTimeout(300);
        attempts++;
      } else {
        break;
      }
    }
    
    console.log(`   ✓ Deleted ${attempts} tweets`);

    // Wait for round completion
    await page.waitForTimeout(2000);

    // Click Next Round button
    const nextRoundBtn = page.locator('button:has-text("Next Round")');
    if (await nextRoundBtn.isVisible({ timeout: 3000 })) {
      await nextRoundBtn.click();
      await page.waitForTimeout(1500);
      console.log(`   ✓ Round ${roundNum} complete!`);
    } else {
      console.log(`   ⚠ Next Round button not found`);
    }
  }

  console.log('\n\n📊 PASSWORD SUMMARY\n');
  console.log('==========================================\n');
  rounds.forEach(r => {
    console.log(`Round ${String(r.round).padStart(2)}: ${r.password}`);
  });
  console.log('\n');
});
