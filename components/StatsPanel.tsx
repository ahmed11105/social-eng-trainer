'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { isAuthenticated } from '@/lib/auth';
import Timer from './Timer';
import ConfirmModal from './ConfirmModal';
import ProgressTracker from './ProgressTracker';

interface StatsPanelProps {
  onRoundComplete?: () => void;
}

export default function StatsPanel({ onRoundComplete }: StatsPanelProps) {
  const { stats, resetGame, skipLevel, hashCopied, hasPosted } = useGame();
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const isLoggedIn = isAuthenticated();

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-80 p-4 space-y-4">
      {/* Timer */}
      <div className="flex justify-center">
        <Timer />
      </div>

      {/* Progress Tracker */}
      <ProgressTracker
        hashCopied={hashCopied}
        isLoggedIn={isLoggedIn}
        hasPosted={hasPosted}
        onRoundComplete={onRoundComplete}
      />

      {/* Stats Dashboard */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <span>📊</span>
          <span>Your Stats</span>
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Rounds Completed</span>
            <span className="text-2xl font-bold text-white">{stats.roundsCompleted}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Current Streak</span>
            <span className="text-2xl font-bold text-yellow-400">{stats.currentStreak}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Best Streak</span>
            <span className="text-2xl font-bold text-blue-400">{stats.bestStreak}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Fastest Time</span>
            <span className="text-2xl font-bold text-green-400">
              {formatTime(stats.fastestTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Training Instructions */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h3 className="font-bold text-lg mb-3">Training Instructions</h3>
        <ol className="text-sm space-y-2 text-gray-300">
          <li>1. Study the profile and tweets for clues 🔍</li>
          <li>2. Build a wordlist with password patterns</li>
          <li>3. Crack the MD5 hash using hashcat</li>
          <li>4. Login and make a post to complete!</li>
        </ol>
      </div>

      {/* Skip Level Button */}
      <button
        onClick={() => setShowSkipConfirm(true)}
        className="w-full px-4 py-2 bg-yellow-900/50 hover:bg-yellow-900/70 text-yellow-400 rounded-lg font-medium transition-colors"
      >
        ⏭️ Skip Level
      </button>

      {/* Reset Button */}
      <button
        onClick={() => setShowResetConfirm(true)}
        className="w-full px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg text-sm font-medium transition-colors"
      >
        Reset All Stats
      </button>

      {/* Quick Tips */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h3 className="font-bold mb-2">Quick Tips 💡</h3>
        <ul className="text-sm space-y-1 text-gray-400">
          <li>• Look for pet names</li>
          <li>• Check birth years and dates</li>
          <li>• Note adoption years</li>
          <li>• Combine words + numbers</li>
        </ul>
      </div>

      {/* Confirmation Modals */}
      {showSkipConfirm && (
        <ConfirmModal
          title="Skip This Profile?"
          message="Generate a new profile to practice on. Your stats won't be affected."
          confirmText="Skip Level"
          cancelText="Keep Playing"
          confirmColor="yellow"
          onConfirm={() => {
            skipLevel();
            setShowSkipConfirm(false);
          }}
          onCancel={() => setShowSkipConfirm(false)}
        />
      )}

      {showResetConfirm && (
        <ConfirmModal
          title="Reset All Stats?"
          message="This will erase all your progress, including rounds completed, streaks, and fastest time. This action cannot be undone."
          confirmText="Reset Everything"
          cancelText="Cancel"
          confirmColor="red"
          onConfirm={() => {
            resetGame();
            setShowResetConfirm(false);
          }}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
}
