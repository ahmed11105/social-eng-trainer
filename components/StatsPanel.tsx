'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { isAuthenticated } from '@/lib/auth';
import { Trophy, FastForward, RotateCcw } from 'lucide-react';
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
    <div className="w-80 h-screen sticky top-0 p-4 space-y-4 flex flex-col pointer-events-none">
      <div className="pointer-events-auto space-y-4">
        {/* Timer */}
        <div className="flex justify-center">
          <Timer />
        </div>

        {/* Compact Stats - Single Row */}
        <div className="grid grid-cols-4 gap-1.5">
          <div
            className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-lg p-2 text-center cursor-help"
            title="Total number of rounds you've completed"
          >
            <div className="text-base font-bold text-white">{stats.roundsCompleted}</div>
            <div className="text-[10px] text-gray-400 leading-tight">Rounds</div>
          </div>
          <div
            className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-lg p-2 text-center cursor-help"
            title="Your current win streak"
          >
            <div className="text-base font-bold text-yellow-400">{stats.currentStreak}</div>
            <div className="text-[10px] text-gray-400 leading-tight">Streak</div>
          </div>
          <div
            className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-500/30 rounded-lg p-2 text-center cursor-help"
            title="Your longest win streak ever"
          >
            <div className="text-base font-bold text-green-400">{stats.bestStreak}</div>
            <div className="text-[10px] text-gray-400 leading-tight">Best</div>
          </div>
          <div
            className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-lg p-2 text-center cursor-help"
            title="Your fastest completion time"
          >
            <div className="text-sm font-bold text-cyan-400">
              {formatTime(stats.fastestTime)}
            </div>
            <div className="text-[10px] text-gray-400 leading-tight">Record</div>
          </div>
        </div>

      {/* Progress Tracker */}
      <ProgressTracker
        hashCopied={isCompletedHistoricalRound || hashCopied}
        isLoggedIn={isCompletedHistoricalRound || isLoggedIn}
        hasPosted={isCompletedHistoricalRound || hasPosted}
        allSensitiveTweetsDeleted={isCompletedHistoricalRound || allSensitiveTweetsDeleted}
        onRoundComplete={onRoundComplete}
      />

        {/* Achievements Button */}
        <button
          onClick={() => {
            playSound('click');
            setShowAchievements(true);
          }}
          onMouseEnter={() => playSound('hover')}
          className="w-full px-4 py-3 bg-gradient-to-r from-yellow-900/50 to-purple-900/50 hover:from-yellow-900/70 hover:to-purple-900/70 text-yellow-400 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Trophy className="w-5 h-5" />
          <span>Achievements</span>
          <span className="text-xs bg-yellow-500/20 px-2 py-0.5 rounded-full">
            {achievements.filter(a => a.unlocked).length}/{achievements.length}
          </span>
        </button>

        {/* Skip and Reset Buttons Side by Side */}
        <div className="grid grid-cols-2 gap-2">
          {/* Skip Level Button */}
          <button
            onClick={() => {
              playSound('click');
              setShowSkipConfirm(true);
            }}
            onMouseEnter={() => playSound('hover')}
            className="px-3 py-2 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 hover:from-blue-900/70 hover:to-cyan-900/70 text-blue-400 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-blue-500/30"
          >
            <FastForward className="w-4 h-4" />
            <span className="text-sm">Skip</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              playSound('click');
              setShowResetConfirm(true);
            }}
            onMouseEnter={() => playSound('hover')}
            className="px-3 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 border border-red-500/30 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Reset</span>
          </button>
        </div>
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
