'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateProfile, GeneratedProfile, Difficulty } from '@/lib/profileGenerator';

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
}

interface GameContextType extends GameState {
  startNewRound: (difficulty?: Difficulty) => void;
  completeRound: () => void;
  updateElapsedTime: (time: number) => void;
  setHasPosted: (posted: boolean) => void;
  setHashCopied: (copied: boolean) => void;
  setAllSensitiveTweetsDeleted: (deleted: boolean) => void; // New: setter for sensitive tweets
  updateCurrentProfileTweets: (tweets: any[]) => void; // New: update tweets in current profile
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
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from localStorage on mount (client-side only)
  useEffect(() => {
    // Ensure we're on the client
    if (typeof window === 'undefined') return;

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
        };

        setState(migratedState);
      } catch (error) {
        // Silent fail - will generate new profile below
        const profile = generateProfile('easy');
        setState(prev => ({
          ...prev,
          currentProfile: profile,
          startTime: Date.now(),
          isRunning: true,
          profileHistory: [],
          currentViewIndex: 0,
        }));
      }
    } else {
      // No saved state, generate initial profile
      const profile = generateProfile('easy');
      setState(prev => ({
        ...prev,
        currentProfile: profile,
        startTime: Date.now(),
        isRunning: true,
        profileHistory: [],
        currentViewIndex: 0,
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
      const newHistory = prev.currentProfile
        ? [...prev.profileHistory, prev.currentProfile]
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
      };
    });
  };

  const completeRound = () => {
    if (!state.startTime || state.roundCompleted) return;

    const timeTaken = Math.floor((Date.now() - state.startTime) / 1000);
    const isFastest = !state.stats.fastestTime || timeTaken < state.stats.fastestTime;

    setState(prev => ({
      ...prev,
      isRunning: false,
      roundCompleted: true,
      elapsedTime: timeTaken,
      currentProfile: prev.currentProfile ? {
        ...prev.currentProfile,
        completionTime: timeTaken, // Save completion time to profile
      } : prev.currentProfile,
      stats: {
        totalRounds: prev.stats.totalRounds + 1,
        fastestTime: isFastest ? timeTaken : prev.stats.fastestTime,
        currentStreak: prev.stats.currentStreak + 1,
        bestStreak: Math.max(prev.stats.currentStreak + 1, prev.stats.bestStreak),
        roundsCompleted: prev.stats.roundsCompleted + 1,
      },
    }));
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
  };

  const updateElapsedTime = (time: number) => {
    setState(prev => ({
      ...prev,
      elapsedTime: time,
    }));
  };

  const setHasPosted = (posted: boolean) => {
    setState(prev => ({
      ...prev,
      hasPosted: posted,
    }));
  };

  const setHashCopied = (copied: boolean) => {
    setState(prev => ({
      ...prev,
      hashCopied: copied,
    }));
  };

  const setAllSensitiveTweetsDeleted = (deleted: boolean) => {
    setState(prev => ({
      ...prev,
      allSensitiveTweetsDeleted: deleted,
    }));
  };

  const updateCurrentProfileTweets = (tweets: any[]) => {
    setState(prev => {
      if (!prev.currentProfile) return prev;

      // Update current profile
      const updatedCurrentProfile = {
        ...prev.currentProfile,
        tweets,
      };

      // If viewing current profile, update it
      // If viewing history, update the history entry
      let updatedHistory = prev.profileHistory;

      if (prev.currentViewIndex < prev.profileHistory.length) {
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
  };

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
