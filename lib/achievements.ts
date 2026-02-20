// Achievement system for tracking player accomplishments

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number; // timestamp
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number; // Current progress (0-1)
  target?: number; // Target value for completion
}

export const ACHIEVEMENTS: Record<string, Omit<Achievement, 'unlocked' | 'unlockedAt'>> = {
  first_hash: {
    id: 'first_hash',
    name: 'Hash Hunter',
    description: 'Copy your first MD5 hash',
    icon: '📋',
    rarity: 'common',
  },
  first_login: {
    id: 'first_login',
    name: 'Access Granted',
    description: 'Successfully crack and login for the first time',
    icon: '🔓',
    rarity: 'common',
  },
  first_round: {
    id: 'first_round',
    name: 'Social Engineer',
    description: 'Complete your first round',
    icon: '🎯',
    rarity: 'common',
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a round in under 2 minutes',
    icon: '⚡',
    rarity: 'rare',
  },
  perfectionist: {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete a round without using hints',
    icon: '✨',
    rarity: 'rare',
  },
  streak_3: {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Achieve a 3-round winning streak',
    icon: '🔥',
    rarity: 'rare',
  },
  streak_5: {
    id: 'streak_5',
    name: 'Unstoppable',
    description: 'Achieve a 5-round winning streak',
    icon: '💫',
    rarity: 'epic',
  },
  streak_10: {
    id: 'streak_10',
    name: 'Legendary',
    description: 'Achieve a 10-round winning streak',
    icon: '👑',
    rarity: 'legendary',
  },
  rounds_10: {
    id: 'rounds_10',
    name: 'Dedicated',
    description: 'Complete 10 rounds total',
    icon: '🎖️',
    rarity: 'common',
  },
  rounds_25: {
    id: 'rounds_25',
    name: 'Expert',
    description: 'Complete 25 rounds total',
    icon: '🏆',
    rarity: 'rare',
  },
  rounds_50: {
    id: 'rounds_50',
    name: 'Master',
    description: 'Complete 50 rounds total',
    icon: '💎',
    rarity: 'epic',
  },
  rounds_100: {
    id: 'rounds_100',
    name: 'Elite Hacker',
    description: 'Complete 100 rounds total',
    icon: '⭐',
    rarity: 'legendary',
  },
  no_hint_streak_3: {
    id: 'no_hint_streak_3',
    name: 'Sharp Mind',
    description: 'Complete 3 rounds in a row without hints',
    icon: '🧠',
    rarity: 'epic',
  },
};

const RARITY_COLORS = {
  common: {
    border: 'border-gray-500',
    bg: 'bg-gray-900/50',
    text: 'text-gray-400',
    glow: 'shadow-gray-500/30',
  },
  rare: {
    border: 'border-blue-500',
    bg: 'bg-blue-900/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/50',
  },
  epic: {
    border: 'border-purple-500',
    bg: 'bg-purple-900/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/50',
  },
  legendary: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-900/30',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/50',
  },
};

export function getRarityColors(rarity: Achievement['rarity']) {
  return RARITY_COLORS[rarity];
}

// Load achievements from localStorage
export function loadAchievements(): Achievement[] {
  if (typeof window === 'undefined') return [];

  const saved = localStorage.getItem('achievements');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initializeAchievements();
    }
  }
  return initializeAchievements();
}

// Initialize achievements with all locked
function initializeAchievements(): Achievement[] {
  return Object.values(ACHIEVEMENTS).map(achievement => ({
    ...achievement,
    unlocked: false,
  }));
}

// Save achievements to localStorage
export function saveAchievements(achievements: Achievement[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('achievements', JSON.stringify(achievements));
}

// Unlock an achievement
export function unlockAchievement(achievementId: string, currentAchievements: Achievement[]): Achievement[] {
  const updated = currentAchievements.map(achievement => {
    if (achievement.id === achievementId && !achievement.unlocked) {
      return {
        ...achievement,
        unlocked: true,
        unlockedAt: Date.now(),
      };
    }
    return achievement;
  });

  saveAchievements(updated);
  return updated;
}

// Check what achievements should be unlocked based on game stats
export function checkAchievements(
  stats: {
    roundsCompleted: number;
    currentStreak: number;
    hashCopied: boolean;
    isLoggedIn: boolean;
    usedHint?: boolean;
    completionTime?: number;
  },
  currentAchievements: Achievement[]
): { achievements: Achievement[]; newUnlocks: string[] } {
  let achievements = [...currentAchievements];
  const newUnlocks: string[] = [];

  const unlock = (id: string) => {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      achievements = unlockAchievement(id, achievements);
      newUnlocks.push(id);
    }
  };

  // Check hash copy
  if (stats.hashCopied) {
    unlock('first_hash');
  }

  // Check login
  if (stats.isLoggedIn) {
    unlock('first_login');
  }

  // Check first round
  if (stats.roundsCompleted >= 1) {
    unlock('first_round');
  }

  // Check round milestones
  if (stats.roundsCompleted >= 10) unlock('rounds_10');
  if (stats.roundsCompleted >= 25) unlock('rounds_25');
  if (stats.roundsCompleted >= 50) unlock('rounds_50');
  if (stats.roundsCompleted >= 100) unlock('rounds_100');

  // Check streaks
  if (stats.currentStreak >= 3) unlock('streak_3');
  if (stats.currentStreak >= 5) unlock('streak_5');
  if (stats.currentStreak >= 10) unlock('streak_10');

  // Check speed
  if (stats.completionTime && stats.completionTime < 120) {
    unlock('speed_demon');
  }

  // Check no hint
  if (!stats.usedHint && stats.roundsCompleted > 0) {
    unlock('perfectionist');
  }

  return { achievements, newUnlocks };
}

// Calculate progress for each achievement based on current stats
export function calculateAchievementProgress(
  achievementId: string,
  stats: {
    roundsCompleted: number;
    currentStreak: number;
    hashCopied: boolean;
    isLoggedIn: boolean;
  }
): { current: number; target: number; progress: number } {
  switch (achievementId) {
    case 'first_hash':
      return { current: stats.hashCopied ? 1 : 0, target: 1, progress: stats.hashCopied ? 1 : 0 };
    case 'first_login':
      return { current: stats.isLoggedIn ? 1 : 0, target: 1, progress: stats.isLoggedIn ? 1 : 0 };
    case 'first_round':
      return { current: Math.min(stats.roundsCompleted, 1), target: 1, progress: Math.min(stats.roundsCompleted, 1) };
    case 'rounds_10':
      return { current: stats.roundsCompleted, target: 10, progress: Math.min(stats.roundsCompleted / 10, 1) };
    case 'rounds_25':
      return { current: stats.roundsCompleted, target: 25, progress: Math.min(stats.roundsCompleted / 25, 1) };
    case 'rounds_50':
      return { current: stats.roundsCompleted, target: 50, progress: Math.min(stats.roundsCompleted / 50, 1) };
    case 'rounds_100':
      return { current: stats.roundsCompleted, target: 100, progress: Math.min(stats.roundsCompleted / 100, 1) };
    case 'streak_3':
      return { current: stats.currentStreak, target: 3, progress: Math.min(stats.currentStreak / 3, 1) };
    case 'streak_5':
      return { current: stats.currentStreak, target: 5, progress: Math.min(stats.currentStreak / 5, 1) };
    case 'streak_10':
      return { current: stats.currentStreak, target: 10, progress: Math.min(stats.currentStreak / 10, 1) };
    default:
      return { current: 0, target: 1, progress: 0 };
  }
}
