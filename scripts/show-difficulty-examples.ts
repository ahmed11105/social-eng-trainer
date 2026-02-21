import { generateProfile } from '../lib/profileGenerator';

console.log('\n🎯 PASSWORD EXAMPLES BY DIFFICULTY\n');
console.log('==========================================\n');

// Generate 5 examples for each difficulty
const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];

difficulties.forEach(difficulty => {
  const icon = difficulty === 'easy' ? '🟢' : difficulty === 'medium' ? '🟡' : '🔴';
  const hashType = difficulty === 'easy' ? 'MD5' : 'SHA-256';
  
  console.log(`\n${icon} ${difficulty.toUpperCase()} MODE (${hashType})`);
  console.log('─'.repeat(50));
  
  for (let i = 0; i < 5; i++) {
    const profile = generateProfile(difficulty);
    const password = profile.password;
    const hash = profile.passwordHash;
    
    console.log(`${i + 1}. ${password.padEnd(30)} (${hash.substring(0, 12)}...)`);
  }
});

console.log('\n\n📊 KEY DIFFERENCES:\n');
console.log('==========================================\n');
console.log('EASY:    lowercase only, simple combinations');
console.log('         Examples: fluffy2019, seattlemike, luna23\n');
console.log('MEDIUM:  Capitalized, occasional separators');
console.log('         Examples: Fluffy2019, Seattle_Mike, Luna23\n');
console.log('HARD:    Mixed case, special chars, leetspeak');
console.log('         Examples: Fluffy2019!, S3attl3Mike@, Lun4_23#\n');
