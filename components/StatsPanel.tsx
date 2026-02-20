'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { isAuthenticated } from '@/lib/auth';
import { BarChart3, Trophy } from 'lucide-react';
import Timer from './Timer';
import ConfirmModal from './ConfirmModal';
import ProgressTracker from './ProgressTracker';
import AchievementsModal from './AchievementsModal';
import { playSound } from '@/lib/sounds';
import { loadAchievements, type Achievement } from '@/lib/achievements';

interface StatsPanelProps {
  onRoundComplete?: () => void;
}

export default function StatsPanel({ onRoundComplete }: StatsPanelProps) {
  const {
    stats,
    resetGame,
    skipLevel,
    hashCopied,
    hasPosted,
    allSensitiveTweetsDeleted,
    viewedProfile,
    isViewingHistory,
  } = useGame();
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const isLoggedIn = isAuthenticated();

  // Load achievements
  useEffect(() => {
    setAchievements(loadAchievements());
  }, []);

  // If viewing a completed historical round, show all steps as complete
  const isCompletedHistoricalRound = isViewingHistory && viewedProfile && viewedProfile.completionTime !== undefined;

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
        hashCopied={isCompletedHistoricalRound || hashCopied}
        isLoggedIn={isCompletedHistoricalRound || isLoggedIn}
        hasPosted={isCompletedHistoricalRound || hasPosted}
        allSensitiveTweetsDeleted={isCompletedHistoricalRound || allSensitiveTweetsDeleted}
        onRoundComplete={onRoundComplete}
      />

      {/* Stats Dashboard */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
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

      {/* Achievements Button */}
      <button
        onClick={() => {
          playSound('click');
          setShowAchievements(true);
        }}
        className="w-full px-4 py-3 bg-gradient-to-r from-yellow-900/50 to-purple-900/50 hover:from-yellow-900/70 hover:to-purple-900/70 text-yellow-400 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
      >
        <Trophy className="w-5 h-5" />
        <span>Achievements</span>
        <span className="text-xs bg-yellow-500/20 px-2 py-0.5 rounded-full">
          {achievements.filter(a => a.unlocked).length}/{achievements.length}
        </span>
      </button>

      {/* Skip Level Button */}
      <button
        onClick={() => {
          playSound('click');
          setShowSkipConfirm(true);
        }}
        className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
      >
        ⏭️ Skip Level
      </button>

      {/* Reset Button */}
      <button
        onClick={() => {
          playSound('click');
          setShowResetConfirm(true);
        }}
        className="w-full px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
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

      {/* Achievements Modal */}
      {showAchievements && (
        <AchievementsModal
          achievements={achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

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
