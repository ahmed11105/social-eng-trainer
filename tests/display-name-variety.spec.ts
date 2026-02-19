import { test, expect } from '@playwright/test';

test('Display names show variety across archetypes', async ({ page }) => {
  const displayNames: string[] = [];
  const archetypePatterns = new Set<string>();

  // Test 15 profiles to ensure we see variety
  for (let i = 0; i < 15; i++) {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('[data-testid="profile-display-name"]', { timeout: 10000 });

    const displayName = await page.locator('[data-testid="profile-display-name"]').textContent() || '';
    const bio = await page.locator('[data-testid="profile-bio"]').textContent() || '';

    console.log(`\n========== PROFILE ${i + 1} ==========`);
    console.log('Display Name:', displayName);
    console.log('Bio:', bio.substring(0, 60) + '...');

    displayNames.push(displayName);

    // Detect display name patterns
    if (displayName.includes('✨') || displayName.includes('★') || displayName.includes('♡') || displayName.includes('~')) {
      archetypePatterns.add('symbols');
      console.log('Pattern: Symbols/Decorations');
    }
    if (displayName.includes('xX_') || displayName.includes('_Xx')) {
      archetypePatterns.add('gamer');
      console.log('Pattern: Gamer style');
    }
    if (/\d{2,}/.test(displayName)) {
      archetypePatterns.add('numbers');
      console.log('Pattern: Numbers');
    }
    if (displayName.includes('|')) {
      archetypePatterns.add('title');
      console.log('Pattern: Title/Description');
    }
    if (displayName === displayName.toLowerCase() && displayName.length > 3) {
      archetypePatterns.add('lowercase');
      console.log('Pattern: All lowercase');
    }
    if (/[🎨🎓📚💙❤️✨🌙⭐💫🦋🌸💎📷🎮🏃🎸📖🌱🍳✌️]/.test(displayName)) {
      archetypePatterns.add('emoji');
      console.log('Pattern: Emoji');
    }
    if (/[\u{1D4EA}-\u{1D503}]/u.test(displayName)) {
      archetypePatterns.add('fancy-text');
      console.log('Pattern: Fancy Unicode');
    }
    if (/^[A-Z][a-z]+\s[A-Z][a-z]+/.test(displayName)) {
      archetypePatterns.add('full-name');
      console.log('Pattern: Full Name');
    }

    // Clear localStorage to get a new profile
    if (i < 14) {
      await page.evaluate(() => localStorage.clear());
    }
  }

  console.log('\n========== VARIETY CHECK ==========');
  console.log('Total profiles tested:', displayNames.length);
  console.log('Unique display names:', new Set(displayNames).size);
  console.log('Display name patterns found:', Array.from(archetypePatterns).sort());

  // Assertions
  expect(new Set(displayNames).size).toBeGreaterThan(10); // Most should be unique
  expect(archetypePatterns.size).toBeGreaterThanOrEqual(3); // At least 3 different patterns

  // Check we're not seeing only single names
  const singleWordNames = displayNames.filter(name => !name.includes(' ') && !/[✨★♡~|🎨🎓📚💙]/.test(name) && name.length < 15);
  console.log(`Single word names: ${singleWordNames.length}/${displayNames.length}`);
  expect(singleWordNames.length).toBeLessThan(displayNames.length * 0.6); // Less than 60% should be single names

  console.log('\n✅ Display names show good variety across archetypes!');
});

test('Display names match archetype personalities', async ({ page }) => {
  // Test a few specific patterns
  let foundFancyText = false;
  let foundEmoji = false;
  let foundFullName = false;
  let foundSymbols = false;

  for (let i = 0; i < 20; i++) {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('[data-testid="profile-display-name"]', { timeout: 10000 });

    const displayName = await page.locator('[data-testid="profile-display-name"]').textContent() || '';

    if (/[\u{1D4EA}-\u{1D503}]/u.test(displayName)) foundFancyText = true;
    if (/[🎨🎓📚💙❤️✨🌙⭐💫]/.test(displayName)) foundEmoji = true;
    if (/^[A-Z][a-z]+\s[A-Z]/.test(displayName)) foundFullName = true;
    if (/[✨★♡~]/.test(displayName)) foundSymbols = true;

    if (foundFancyText && foundEmoji && foundFullName && foundSymbols) {
      console.log('✅ Found all major display name types!');
      break;
    }

    if (i < 19) {
      await page.evaluate(() => localStorage.clear());
    }
  }

  console.log('\nDisplay name types found:');
  console.log('- Fancy Unicode text:', foundFancyText ? '✓' : '✗');
  console.log('- Emojis:', foundEmoji ? '✓' : '✗');
  console.log('- Full names:', foundFullName ? '✓' : '✗');
  console.log('- Symbols:', foundSymbols ? '✓' : '✗');

  // At least some variety should be present
  const varietyCount = [foundFancyText, foundEmoji, foundFullName, foundSymbols].filter(Boolean).length;
  expect(varietyCount).toBeGreaterThanOrEqual(2);
});
