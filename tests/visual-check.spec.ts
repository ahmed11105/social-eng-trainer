import { test } from '@playwright/test';

test('Visual check of How to Play modal', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for page to load
  await page.waitForSelector('h2:has-text("OSINT Challenge")', { timeout: 10000 });

  // Click How to Play button
  await page.locator('button:has-text("How to Play")').click();

  // Wait for modal to appear
  await page.waitForSelector('h2:has-text("How to Play: Dictionary Attack Training")');

  // Take screenshot of top of modal
  await page.screenshot({
    path: 'visual-check-top.png',
    fullPage: false
  });

  // Scroll to What You Need section
  await page.locator('h3:has-text("🛠️ What You Need")').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: 'visual-check-tools.png',
    fullPage: false
  });

  // Scroll to Complete Example Walkthrough
  await page.locator('h3:has-text("💡 Complete Example Walkthrough")').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: 'visual-check-example.png',
    fullPage: false
  });

  // Scroll to Step 2
  await page.locator('text=Step 2: Create wordlist.txt').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: 'visual-check-step2.png',
    fullPage: false
  });

  // Scroll to Step 4
  await page.locator('text=Step 4: Run Hashcat').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: 'visual-check-step4.png',
    fullPage: false
  });

  // Scroll to Step 5
  await page.locator('text=Step 5: Check Results & Iterate').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: 'visual-check-step5.png',
    fullPage: false
  });

  // Scroll to bottom
  await page.locator('button:has-text("Got it! Let\'s Play")').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: 'visual-check-bottom.png',
    fullPage: false
  });

  console.log('✅ Screenshots saved for visual inspection');
});
