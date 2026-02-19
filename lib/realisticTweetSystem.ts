/**
 * Realistic Tweet System - Complete integration
 * GENERATE → CHECK → REWRITE pipeline
 */

import { generatePersona, RichPersona } from './personaFactory';
import { composeTweetSet } from './tweetComposer';

// ========================
// SIMILARITY DATABASE
// ========================

interface TweetStore {
  normalized: Map<string, number>; // tweet -> usage count
}

const globalTweetStore: TweetStore = {
  normalized: new Map(),
};

/**
 * Normalize tweet for comparison
 */
function normalizeTweet(tweet: string): string {
  return tweet
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\d+/g, 'N') // Replace numbers with N
    .trim();
}

/**
 * Calculate Jaccard similarity between two normalized tweets
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(' '));
  const words2 = new Set(str2.split(' '));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Check if tweet is too similar to previously generated ones
 */
function isTooSimilar(tweet: string, threshold: number = 0.7): boolean {
  const normalized = normalizeTweet(tweet);

  // Check against all stored tweets
  for (const [storedTweet, _] of globalTweetStore.normalized) {
    const similarity = calculateSimilarity(normalized, storedTweet);
    if (similarity > threshold) {
      return true;
    }
  }

  return false;
}

/**
 * Store tweet in database
 */
function storeTweet(tweet: string): void {
  const normalized = normalizeTweet(tweet);
  const count = globalTweetStore.normalized.get(normalized) || 0;
  globalTweetStore.normalized.set(normalized, count + 1);
}

/**
 * Generate a fresh variation of a tweet
 */
function regenerateTweet(
  persona: RichPersona,
  originalType: string,
  seed: number,
  attempt: number
): string {
  // Import composer dynamically to avoid circular deps
  const { composeTweet } = require('./tweetComposer');

  // Generate with different seed to get variation
  return composeTweet(persona, originalType, seed + attempt * 1000);
}

// ========================
// MAIN GENERATION FUNCTION
// ========================

export interface GeneratedProfile {
  persona: RichPersona;
  tweets: string[];
  password: string;
  passwordHash: string;
  clues: string[];
}

/**
 * Generate a complete realistic profile with similarity checking
 */
export function generateRealisticProfile(seed: number): GeneratedProfile {
  // PHASE 1: Generate rich persona
  const persona = generatePersona(seed);

  // PHASE 2 & 3: Generate tweet set based on persona
  let tweets = composeTweetSet(persona, seed);

  // PHASE 4 & 5: Check similarity and regenerate if needed
  const maxAttempts = 3;
  const finalTweets: string[] = [];

  for (let i = 0; i < tweets.length; i++) {
    let tweet = tweets[i];
    let attempts = 0;

    // Try to regenerate if too similar
    while (isTooSimilar(tweet) && attempts < maxAttempts) {
      console.log(`[TweetSystem] Tweet ${i} too similar, regenerating (attempt ${attempts + 1})`);

      // Regenerate with different approach
      const tweetTypes = ['mundane', 'social', 'emotional', 'work_frustration', 'hobby'];
      const randomType = tweetTypes[Math.floor(Math.random() * tweetTypes.length)];

      tweet = regenerateTweet(persona, randomType, seed + i, attempts);
      attempts++;
    }

    // Store and add to final set
    storeTweet(tweet);
    finalTweets.push(tweet);
  }

  // Generate password based on persona
  const password = generatePassword(persona);
  const passwordHash = require('crypto-js').MD5(password).toString();

  // Generate clues
  const clues = [
    `Pet: ${persona.pet.name} (${persona.pet.type})`,
    `Pet adoption year: ${persona.pet.adoptionYear}`,
    `Location: ${persona.location}`,
    `Name: ${persona.name}`,
  ];

  return {
    persona,
    tweets: finalTweets,
    password,
    passwordHash,
    clues: clues.filter(clue => {
      const value = clue.split(': ')[1].toLowerCase();
      return password.toLowerCase().includes(value);
    }),
  };
}

/**
 * Generate password from persona data
 */
function generatePassword(persona: RichPersona): string {
  const patterns = [
    () => `${persona.pet.name.toLowerCase()}${persona.pet.adoptionYear}`,
    () => `${persona.location.toLowerCase()}${persona.pet.adoptionYear}`,
    () => `${persona.name.toLowerCase()}${persona.pet.name.toLowerCase()}`,
  ];

  return patterns[Math.floor(Math.random() * patterns.length)]();
}

/**
 * Clear the tweet database (for testing)
 */
export function clearTweetDatabase(): void {
  globalTweetStore.normalized.clear();
}

/**
 * Get database stats (for debugging)
 */
export function getTweetDatabaseStats(): { totalTweets: number; examples: string[] } {
  const examples = Array.from(globalTweetStore.normalized.keys()).slice(0, 5);
  return {
    totalTweets: globalTweetStore.normalized.size,
    examples,
  };
}
