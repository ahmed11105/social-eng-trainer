'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { generateProfile, GeneratedProfile, Difficulty } from '@/lib/profileGenerator';
import { clearAuthSession } from '@/lib/auth';
import { PlayerProgress, loadPlayerProgress } from '@/lib/leveling';
import { checkAchievements, loadAchievements, saveAchievements } from '@/lib/achievements';

interface GameStats {
  totalRounds: number;
  fastestTime: number | null;
  currentStreak: number;
  bestStreak: number;
  roundsCompleted: number;
}

interface GameState {
  currentProfile: GeneratedProfile | null;
  difficulty: Difficulty;
  startTime: number | null;
  elapsedTime: number;
  isRunning: boolean;
  roundCompleted: boolean;
  stats: GameStats;
  hasPosted: boolean;
  hashCopied: boolean;
  allSensitiveTweetsDeleted: boolean; // New: tracks if all sensitive tweets are deleted
  profileHistory: GeneratedProfile[];
  currentViewIndex: number;
  correctDeletions: number; // Track correct sensitive tweet deletions
  incorrectDeletions: number; // Track wrong (non-sensitive) tweet deletions
  playerProgress: PlayerProgress; // Level and XP
}

interface GameContextType extends GameState {
  startNewRound: (difficulty?: Difficulty) => void;
  completeRound: () => void;
  updateElapsedTime: (time: number) => void;
  setHasPosted: (posted: boolean) => void;
  setHashCopied: (copied: boolean) => void;
  setAllSensitiveTweetsDeleted: (deleted: boolean) => void; // New: setter for sensitive tweets
  updateCurrentProfileTweets: (tweets: any[]) => void; // New: update tweets in current profile
  trackDeletion: (wasSensitive: boolean) => void; // Track tweet deletion accuracy
  resetGame: () => void;
  changeDifficulty: (difficulty: Difficulty) => void;
  skipLevel: () => void;
  goToPreviousProfile: () => void;
  goToNextProfile: () => void;
  goToProfile: (index: number) => void;
  viewedProfile: GeneratedProfile | null;
  isViewingHistory: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_STATS: GameStats = {
  totalRounds: 0,
  fastestTime: null,
  currentStreak: 0,
  bestStreak: 0,
  roundsCompleted: 0,
};

const INITIAL_STATE: GameState = {
  currentProfile: null,
  difficulty: 'easy',
  startTime: null,
  elapsedTime: 0,
  isRunning: false,
  roundCompleted: false,
  stats: INITIAL_STATS,
  hasPosted: false,
  hashCopied: false,
  allSensitiveTweetsDeleted: false, // Initially false
  profileHistory: [],
  currentViewIndex: 0,
  correctDeletions: 0,
  incorrectDeletions: 0,
  playerProgress: { level: 1, xp: 0, totalXP: 0 },
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from localStorage on mount (client-side only)
  useEffect(() => {
    // Ensure we're on the client
    if (typeof window === 'undefined') return;

    // Load player progress
    const playerProgress = loadPlayerProgress();

    const saved = localStorage.getItem('gameState');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);

        // Migration: Add new fields if they don't exist (for backward compatibility)
        const migratedState = {
          ...parsedState,
          profileHistory: parsedState.profileHistory || [],
          currentViewIndex: parsedState.currentViewIndex ?? (parsedState.profileHistory?.length || 0),
          hashCopied: parsedState.hashCopied ?? false,
          correctDeletions: parsedState.correctDeletions ?? 0,
          incorrectDeletions: parsedState.incorrectDeletions ?? 0,
          playerProgress,
        };

        setState(migratedState);
      } catch (error) {
        // Silent fail - will generate new profile below
        const profile = generateProfile('easy');
        const playerProgress = loadPlayerProgress();
        setState(prev => ({
          ...prev,
          currentProfile: profile,
          startTime: Date.now(),
          isRunning: true,
          profileHistory: [],
          currentViewIndex: 0,
          playerProgress,
        }));
      }
    } else {
      // No saved state, generate initial profile
      const profile = generateProfile('easy');
      const playerProgress = loadPlayerProgress();
      setState(prev => ({
        ...prev,
        currentProfile: profile,
        startTime: Date.now(),
        isRunning: true,
        profileHistory: [],
        currentViewIndex: 0,
        playerProgress,
      }));
    }
    setIsHydrated(true);
  }, []);

  // Save state to localStorage whenever it changes (except during initial hydration)
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem('gameState', JSON.stringify(state));
      } catch (error) {
        // Silent fail if localStorage is not available
      }
    }
  }, [state, isHydrated]);

  const startNewRound = (difficulty?: Difficulty) => {
    const newDifficulty = difficulty || state.difficulty;
    const profile = generateProfile(newDifficulty);

    setState(prev => {
      // Add current profile to history before starting new round
      // IMPORTANT: Create a deep copy to prevent shared references
      const newHistory = prev.currentProfile
        ? [...prev.profileHistory, {
            ...prev.currentProfile,
            tweets: [...prev.currentProfile.tweets], // Deep copy tweets array
          }]
        : prev.profileHistory;

      return {
        ...prev,
        currentProfile: profile,
        difficulty: newDifficulty,
        startTime: Date.now(),
        elapsedTime: 0,
        isRunning: true,
        roundCompleted: false,
        hasPosted: false,
        hashCopied: false,
        allSensitiveTweetsDeleted: false,
        profileHistory: newHistory,
        currentViewIndex: newHistory.length, // View the new profile
        correctDeletions: 0, // Reset deletion tracking
        incorrectDeletions: 0,
      };
    });

    // Clear authentication and reload to ensure UI updates
    clearAuthSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const completeRound = () => {
    if (!state.startTime || state.roundCompleted) return;

    const timeTaken = Math.floor((Date.now() - state.startTime) / 1000);
    const isFastest = !state.stats.fastestTime || timeTaken < state.stats.fastestTime;

    setState(prev => {
      const newStats = {
        totalRounds: prev.stats.totalRounds + 1,
        fastestTime: isFastest ? timeTaken : prev.stats.fastestTime,
        currentStreak: prev.stats.currentStreak + 1,
        bestStreak: Math.max(prev.stats.currentStreak + 1, prev.stats.bestStreak),
        roundsCompleted: prev.stats.roundsCompleted + 1,
      };

      // Check and unlock achievements
      const currentAchievements = loadAchievements();
      const { achievements: updatedAchievements } = checkAchievements(
        {
          roundsCompleted: newStats.roundsCompleted,
          currentStreak: newStats.currentStreak,
          hashCopied: prev.hashCopied,
          isLoggedIn: true, // They must be logged in to complete
          completionTime: timeTaken,
        },
        currentAchievements
      );
      saveAchievements(updatedAchievements);

      return {
        ...prev,
        isRunning: false,
        roundCompleted: true,
        elapsedTime: timeTaken,
        currentProfile: prev.currentProfile ? {
          ...prev.currentProfile,
          completionTime: timeTaken,
        } : prev.currentProfile,
        stats: newStats,
      };
    });
  };

  const skipLevel = () => {
    // Generate new profile without saving current to history or incrementing stats
    const profile = generateProfile('easy'); // Always easy difficulty

    setState(prev => ({
      ...prev,
      currentProfile: profile,
      hashCopied: false,
      hasPosted: false,
      allSensitiveTweetsDeleted: false,
      startTime: Date.now(),
      elapsedTime: 0,
      isRunning: true,
      roundCompleted: false,
      currentViewIndex: prev.profileHistory.length, // Stay on current view index
    }));

    // Clear authentication and reload to ensure UI updates
    clearAuthSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const updateElapsedTime = (time: number) => {
    setState(prev => ({
      ...prev,
      elapsedTime: time,
    }));
  };

  const setHasPosted = useCallback((posted: boolean) => {
    setState(prev => ({
      ...prev,
      hasPosted: posted,
    }));
  }, []);

  const setHashCopied = useCallback((copied: boolean) => {
    setState(prev => {
      // Check achievements when hash is copied
      if (copied) {
        const currentAchievements = loadAchievements();
        const { achievements: updatedAchievements } = checkAchievements(
          {
            roundsCompleted: prev.stats.roundsCompleted,
            currentStreak: prev.stats.currentStreak,
            hashCopied: true,
            isLoggedIn: false,
          },
          currentAchievements
        );
        saveAchievements(updatedAchievements);
      }

      return {
        ...prev,
        hashCopied: copied,
      };
    });
  }, []);

  const setAllSensitiveTweetsDeleted = useCallback((deleted: boolean) => {
    setState(prev => ({
      ...prev,
      allSensitiveTweetsDeleted: deleted,
    }));
  }, []);

  const updateCurrentProfileTweets = useCallback((tweets: any[]) => {
    setState(prev => {
      if (!prev.currentProfile) return prev;

      const isViewingHistory = prev.currentViewIndex < prev.profileHistory.length;

      // Only update current profile if we're viewing it (not viewing history)
      const updatedCurrentProfile = isViewingHistory
        ? prev.currentProfile  // Don't change current profile when viewing history
        : {
            ...prev.currentProfile,
            tweets,
          };

      // If viewing history, update that specific historical profile
      let updatedHistory = prev.profileHistory;

      if (isViewingHistory) {
        // Viewing history - update that specific profile
        updatedHistory = [...prev.profileHistory];
        updatedHistory[prev.currentViewIndex] = {
          ...updatedHistory[prev.currentViewIndex],
          tweets,
        };
      }

      return {
        ...prev,
        currentProfile: updatedCurrentProfile,
        profileHistory: updatedHistory,
      };
    });
  }, []);

  const resetGame = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gameState');
    }

    const profile = generateProfile('easy');
    setState({
      ...INITIAL_STATE,
      currentProfile: profile,
      startTime: Date.now(),
      isRunning: true,
    });

    // Clear authentication and reload to ensure UI updates
    clearAuthSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const changeDifficulty = (difficulty: Difficulty) => {
    setState(prev => ({
      ...prev,
      difficulty,
    }));
  };

  const goToPreviousProfile = () => {
    setState(prev => ({
      ...prev,
      currentViewIndex: Math.max(0, prev.currentViewIndex - 1),
    }));
  };

  const goToNextProfile = () => {
    setState(prev => ({
      ...prev,
      currentViewIndex: Math.min(prev.profileHistory.length, prev.currentViewIndex + 1),
    }));
  };

  const goToProfile = (index: number) => {
    setState(prev => ({
      ...prev,
      currentViewIndex: Math.max(0, Math.min(prev.profileHistory.length, index)),
    }));
  };

  const trackDeletion = useCallback((wasSensitive: boolean) => {
    setState(prev => ({
      ...prev,
      correctDeletions: wasSensitive ? prev.correctDeletions + 1 : prev.correctDeletions,
      incorrectDeletions: !wasSensitive ? prev.incorrectDeletions + 1 : prev.incorrectDeletions,
    }));
  }, []);

  // Computed properties
  const viewedProfile = state.currentViewIndex === state.profileHistory.length
    ? state.currentProfile
    : state.profileHistory[state.currentViewIndex];

  const isViewingHistory = state.currentViewIndex < state.profileHistory.length;

  const value: GameContextType = {
    ...state,
    startNewRound,
    completeRound,
    updateElapsedTime,
    setHasPosted,
    setHashCopied,
    setAllSensitiveTweetsDeleted,
    updateCurrentProfileTweets,
    trackDeletion,
    resetGame,
    changeDifficulty,
    skipLevel,
    goToPreviousProfile,
    goToNextProfile,
    goToProfile,
    viewedProfile,
    isViewingHistory,
  };

  // Don't render until hydrated to avoid mismatch
  if (!isHydrated) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
