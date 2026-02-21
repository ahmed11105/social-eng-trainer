import { generateProfile } from '../lib/profileGenerator';

console.log('\n🎮 DEMONSTRATING 10 ROUNDS OF THE GAME\n');
console.log('==========================================\n');

const rounds: { round: number; password: string; pattern: string }[] = [];

for (let i = 1; i <= 10; i++) {
  const profile = generateProfile('easy');
  const password = profile.password;
  
  // Determine pattern type
  let pattern = '';
  const hasYearAtStart = /^\d{4}/.test(password);
  const hasShortYearAtStart = /^\d{2}[a-z]/.test(password);
  const hasYearAtEnd = /\d{4}$/.test(password);
  const hasShortYearAtEnd = /[a-z]\d{2}$/.test(password);
  
  if (hasYearAtStart) pattern = 'year (4-digit) first';
  else if (hasShortYearAtStart) pattern = 'year (2-digit) first';
  else if (hasYearAtEnd) pattern = 'year (4-digit) last';
  else if (hasShortYearAtEnd) pattern = 'year (2-digit) last';
  else pattern = 'name/location combo (no year)';
  
  rounds.push({ round: i, password, pattern });
  
  console.log(`Round ${i}: ${password.padEnd(30)} [${pattern}]`);
}

console.log('\n\n📊 SUMMARY OF 10 ROUNDS\n');
console.log('==========================================\n');
rounds.forEach(r => {
  console.log(`Round ${String(r.round).padStart(2)}: ${r.password}`);
});

// Show pattern distribution
console.log('\n\n📈 PATTERN DISTRIBUTION\n');
console.log('==========================================\n');
const patternCounts = rounds.reduce((acc, r) => {
  acc[r.pattern] = (acc[r.pattern] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

Object.entries(patternCounts).forEach(([pattern, count]) => {
  console.log(`${pattern}: ${count} rounds`);
});
console.log('\n');
