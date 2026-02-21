import { generateProfile } from '../lib/profileGenerator';

console.log('\n🎯 SIDE-BY-SIDE COMPARISON\n');
console.log('==========================================\n');

// Generate 10 profiles and show how the same components look in each difficulty
for (let i = 0; i < 10; i++) {
  const easy = generateProfile('easy');
  const medium = generateProfile('medium');
  const hard = generateProfile('hard');
  
  console.log(`Example ${i + 1}:`);
  console.log(`  🟢 Easy:   ${easy.password}`);
  console.log(`  🟡 Medium: ${medium.password}`);
  console.log(`  🔴 Hard:   ${hard.password}`);
  console.log('');
}

console.log('\n📝 PATTERN BREAKDOWN:\n');
console.log('==========================================\n');
console.log('🟢 EASY:');
console.log('  • All lowercase');
console.log('  • No special characters');
console.log('  • MD5 hash (fast to crack)\n');

console.log('🟡 MEDIUM:');
console.log('  • First letter capitalized');
console.log('  • May have separators (_ or -)');
console.log('  • SHA-256 hash (10x slower)\n');

console.log('🔴 HARD:');
console.log('  • Mixed case + leetspeak (a→4, e→3, i→1, o→0)');
console.log('  • Special chars at end (!@#$*)');
console.log('  • May have separators');
console.log('  • SHA-256 hash + requires hashcat rules\n');
