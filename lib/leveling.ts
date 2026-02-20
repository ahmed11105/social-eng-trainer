// XP and Leveling System

const STORAGE_KEY = 'playerProgress';

export interface PlayerProgress {
  level: number;
  xp: number;
  totalXP: number; // Lifetime XP earned
}

export interface RoundScore {
  basePoints: number; // Points from speed
  accuracyMultiplier: number; // 0.0 to 2.0
  speedBonus: number; // Bonus for lightning-fast completion
  finalPoints: number; // (basePoints + speedBonus) * accuracyMultiplier
  correctDeletions: number;
  incorrectDeletions: number;
  timeTaken: number;
}

// XP required for each level (exponential growth)
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Calculate total XP needed to reach a level
export function getTotalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

// Calculate level from total XP
export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpForNextLevel = getXPForLevel(level);
  let accumulatedXP = 0;

  while (totalXP >= accumulatedXP + xpForNextLevel) {
    accumulatedXP += xpForNextLevel;
    level++;
    xpForNextLevel = getXPForLevel(level);
  }

  return level;
}

// Calculate XP progress within current level (0-1)
export function getXPProgress(totalXP: number): number {
  const level = getLevelFromXP(totalXP);
  const xpForCurrentLevel = getXPForLevel(level);
  const xpForPreviousLevels = getTotalXPForLevel(level);
  const xpIntoCurrentLevel = totalXP - xpForPreviousLevels;

  return xpIntoCurrentLevel / xpForCurrentLevel;
}

/**
 * Calculate base points from completion time
 * Faster = more points
 * Max: 1000 points (under 30 seconds)
 * Min: 100 points (over 5 minutes)
 */
export function calculateBasePoints(timeTaken: number): number {
  const maxTime = 300; // 5 minutes
  const minTime = 30; // 30 seconds
  const maxPoints = 1000;
  const minPoints = 100;

  if (timeTaken <= minTime) return maxPoints;
  if (timeTaken >= maxTime) return minPoints;

  // Linear interpolation
  const timeRatio = (maxTime - timeTaken) / (maxTime - minTime);
  return Math.floor(minPoints + (maxPoints - minPoints) * timeRatio);
}

/**
 * Calculate accuracy multiplier from deletions
 * Perfect accuracy (no mistakes) = 2.0x
 * Some mistakes = 1.0x - 1.9x
 * Too many mistakes = 0.0x (no multiplier)
 */
export function calculateAccuracyMultiplier(
  correctDeletions: number,
  incorrectDeletions: number
): number {
  // If no sensitive tweets to delete, return 1.0 (neutral)
  if (correctDeletions === 0) return 1.0;

  // Calculate accuracy ratio
  const totalDeletions = correctDeletions + incorrectDeletions;
  const accuracy = correctDeletions / totalDeletions;

  // Perfect accuracy (no mistakes) = 2.0x multiplier
  if (incorrectDeletions === 0) return 2.0;

  // More than 50% mistakes = 0x multiplier
  if (accuracy < 0.5) return 0.0;

  // Linear scaling from 1.0x to 2.0x based on accuracy
  // 50% accuracy = 1.0x
  // 100% accuracy = 2.0x (already handled above)
  return 1.0 + (accuracy - 0.5) * 2;
}

/**
 * Calculate speed bonus for lightning-fast completions
 * Under 2 minutes (120 seconds) = +200 bonus points
 */
export function calculateSpeedBonus(timeTaken: number): number {
  const LIGHTNING_THRESHOLD = 120; // 2 minutes
  const SPEED_BONUS = 200;

  return timeTaken < LIGHTNING_THRESHOLD ? SPEED_BONUS : 0;
}

/**
 * Calculate final score for a round
 */
export function calculateRoundScore(
  timeTaken: number,
  correctDeletions: number,
  incorrectDeletions: number
): RoundScore {
  const basePoints = calculateBasePoints(timeTaken);
  const speedBonus = calculateSpeedBonus(timeTaken);
  const accuracyMultiplier = calculateAccuracyMultiplier(correctDeletions, incorrectDeletions);
  const finalPoints = Math.floor((basePoints + speedBonus) * accuracyMultiplier);

  return {
    basePoints,
    speedBonus,
    accuracyMultiplier,
    finalPoints,
    correctDeletions,
    incorrectDeletions,
    timeTaken,
  };
}

/**
 * Load player progress from localStorage
 */
export function loadPlayerProgress(): PlayerProgress {
  if (typeof window === 'undefined') {
    return { level: 1, xp: 0, totalXP: 0 };
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // Corrupted data, return defaults
    }
  }

  return { level: 1, xp: 0, totalXP: 0 };
}

/**
 * Save player progress to localStorage
 */
export function savePlayerProgress(progress: PlayerProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * Add XP and update level
 * Returns updated progress and whether player leveled up
 */
export function addXP(currentProgress: PlayerProgress, xpToAdd: number): {
  newProgress: PlayerProgress;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
} {
  const newTotalXP = currentProgress.totalXP + xpToAdd;
  const newLevel = getLevelFromXP(newTotalXP);
  const xpForPreviousLevels = getTotalXPForLevel(newLevel);
  const newXP = newTotalXP - xpForPreviousLevels;

  const newProgress: PlayerProgress = {
    level: newLevel,
    xp: newXP,
    totalXP: newTotalXP,
  };

  savePlayerProgress(newProgress);

  return {
    newProgress,
    leveledUp: newLevel > currentProgress.level,
    oldLevel: currentProgress.level,
    newLevel,
  };
}
