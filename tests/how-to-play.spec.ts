import { test, expect } from '@playwright/test';

test('How to Play button and modal', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for page to load
  await page.waitForSelector('h2:has-text("OSINT Challenge")', { timeout: 10000 });

  // Check if "How to Play" button exists
  const howToPlayButton = page.locator('button:has-text("How to Play")');
  await expect(howToPlayButton).toBeVisible();

  // Click the button
  await howToPlayButton.click();

  // Check if modal appears
  await expect(page.locator('h2:has-text("How to Play")')).toBeVisible();

  // Check for key sections
  await expect(page.locator('text=The Goal')).toBeVisible();
  await expect(page.locator('text=What You Need')).toBeVisible();
  await expect(page.locator('h3:has-text("💡 Complete Example Walkthrough")')).toBeVisible();
  await expect(page.locator('text=Pro Tips')).toBeVisible();

  // Check for tutorial steps
  await expect(page.locator('text=Gather Intel')).toBeVisible();
  await expect(page.locator('text=Create wordlist.txt')).toBeVisible();
  await expect(page.locator('text=Run Hashcat')).toBeVisible();
  await expect(page.locator('text=Login & Complete')).toBeVisible();

  // Check for hashcat command
  await expect(page.locator('text=hashcat -m 0 -a 0 hash.txt wordlist.txt')).toBeVisible();

  // Scroll down to see the example section
  await page.locator('h3:has-text("💡 Complete Example Walkthrough")').scrollIntoViewIfNeeded();

  // Check example profile
  await expect(page.locator('text=@sarah_jones').first()).toBeVisible();
  await expect(page.locator('text=luna2020').first()).toBeVisible();

  // Close the modal by clicking the close button
  await page.locator('button[aria-label="Close"]').click();
  await expect(page.locator('h2:has-text("How to Play")').first()).not.toBeVisible();

  // Reopen and close by clicking the main button
  await howToPlayButton.click();
  await expect(page.locator('h2:has-text("How to Play")').first()).toBeVisible();
  await page.locator('button:has-text("Got it! Let\'s Play")').click();
  await expect(page.locator('h2:has-text("How to Play")').first()).not.toBeVisible();

  console.log('✅ How to Play button and modal work correctly!');
});
