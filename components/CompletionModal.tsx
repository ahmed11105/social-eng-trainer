'use client';

import { useEffect, useState } from 'react';
import { X, Trophy, Clock, Target, Zap } from 'lucide-react';
import { playSound } from '@/lib/sounds';
import { playAudioEffect } from '@/lib/audioEffects';
import { calculateRoundScore, addXP, getXPForLevel } from '@/lib/leveling';
import { useGame } from '@/contexts/GameContext';
import XPCircle from './XPCircle';

interface CompletionModalProps {
  timeTaken: number;
  password: string;
  clues: string[];
  difficulty: string;
  totalRounds: number;
  currentStreak: number;
  fastestTime: number | null;
  onNextRound: () => void;
  onClose: () => void;
  isHistorical?: boolean;
}

export default function CompletionModal({
  timeTaken,
  password,
  clues,
  difficulty,
  totalRounds,
  currentStreak,
  fastestTime,
  onNextRound,
  onClose,
  isHistorical = false,
}: CompletionModalProps) {
  const { correctDeletions, incorrectDeletions, playerProgress } = useGame();
  const [showXPAnimation, setShowXPAnimation] = useState(!isHistorical);
  const [showStats, setShowStats] = useState(isHistorical); // Show stats immediately for historical rounds
  const [roundScore, setRoundScore] = useState<any>(null);
  const [newProgress, setNewProgress] = useState(playerProgress);

  useEffect(() => {
    if (isHistorical) {
      // For historical rounds, just show stats
      setTimeout(() => setShowStats(true), 200);
      return;
    }

    // Calculate score and XP for current round
    const score = calculateRoundScore(timeTaken, correctDeletions, incorrectDeletions);
    setRoundScore(score);

    // Add XP and update progress
    const result = addXP(playerProgress, score.finalPoints);
    setNewProgress(result.newProgress);

    // Play celebration sound
    playAudioEffect('celebration', 0.5);

    // XP animation will handle when to show stats
  }, [timeTaken, correctDeletions, incorrectDeletions, playerProgress, isHistorical]);

  const handleXPAnimationComplete = () => {
    setShowXPAnimation(false);
    setTimeout(() => setShowStats(true), 300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isNewRecord = fastestTime === timeTaken && totalRounds > 1;
  const isFastTime = timeTaken < 120; // Under 2 minutes

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in overflow-y-auto">
      {/* Celebration confetti effect */}
      {showStats && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* XP Animation Phase */}
      {showXPAnimation && roundScore && (
        <div className="animate-scale-in">
          <XPCircle
            currentLevel={newProgress.level}
            xpGained={roundScore.finalPoints}
            startXP={playerProgress.xp}
            xpForLevel={getXPForLevel(newProgress.level)}
            onComplete={handleXPAnimationComplete}
          />
        </div>
      )}

      {/* Stats Phase */}
      {showStats && (
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto my-auto transform transition-all border-2 border-green-500/50 shadow-2xl shadow-green-500/30 animate-scale-in relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Success Icon - Compact */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-full mb-2 animate-bounce">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
            Mission Complete!
          </h2>
          <p className="text-green-400 text-xs font-semibold">Password Cracked Successfully!</p>
        </div>

        {/* Stats - Compact grid layout */}
        <div className="space-y-2 mb-3">
          {/* Row 1: Password and Time side-by-side */}
          <div className="grid grid-cols-2 gap-2">
            {/* Password */}
            <div className={`bg-black/50 border border-gray-700 rounded-lg p-2 ${showStats ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0s' }}>
              <div className="text-gray-400 text-xs mb-1">Password:</div>
              <code className="text-green-400 font-mono text-xs block break-all font-bold">
                {password}
              </code>
            </div>

            {/* Time */}
            <div className={`bg-gradient-to-r from-green-900/40 to-blue-900/40 border-2 border-green-500/50 rounded-lg p-2 ${showStats ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0s' }}>
              <div className="text-green-400 font-semibold text-xs flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3" />
                Your Time
              </div>
              <div className="text-xl font-bold text-white">
                {formatTime(timeTaken)}
              </div>
            </div>
          </div>

          {/* Row 2: Score Breakdown - Compact */}
          {!isHistorical && roundScore && (
            <div className={`bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 rounded-lg p-2 ${showStats ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="text-center">
                  <div className="text-yellow-400 text-xs flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3" />
                    Speed
                  </div>
                  <div className="text-lg font-bold text-white">{roundScore.basePoints}</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 text-xs flex items-center justify-center gap-1">
                    <Target className="w-3 h-3" />
                    Multiplier
                  </div>
                  <div className={`text-lg font-bold ${roundScore.accuracyMultiplier === 0 ? 'text-red-400' : roundScore.accuracyMultiplier === 2.0 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {roundScore.accuracyMultiplier.toFixed(1)}x
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-purple-300 text-xs">Total XP</div>
                  <div className="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    +{roundScore.finalPoints}
                  </div>
                </div>
              </div>
              {roundScore.accuracyMultiplier === 2.0 && (
                <p className="text-xs text-green-400 text-center animate-pulse">
                  🎯 Perfect accuracy!
                </p>
              )}
              {roundScore.incorrectDeletions > 0 && roundScore.accuracyMultiplier < 2.0 && (
                <p className="text-xs text-red-400 text-center">
                  ⚠️ {roundScore.incorrectDeletions} wrong deletion{roundScore.incorrectDeletions > 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {/* Row 3: Overall Stats Grid - Always visible, compact */}
          <div className={`grid grid-cols-3 gap-2 ${showStats ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-lg p-2 text-center">
              <div className="text-xl font-bold text-white">{totalRounds}</div>
              <div className="text-xs text-gray-400">Rounds</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-lg p-2 text-center">
              <div className="text-xl font-bold text-yellow-400">{currentStreak}</div>
              <div className="text-xs text-gray-400">Streak 🔥</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-500/30 rounded-lg p-2 text-center">
              <div className="text-xl font-bold text-green-400">
                {fastestTime ? formatTime(fastestTime) : '--'}
              </div>
              <div className="text-xs text-gray-400">Best</div>
            </div>
          </div>
        </div>

        {/* Next Round Button - Compact */}
        {!isHistorical && (
          <button
            onClick={() => {
              playSound('click');
              onNextRound();
            }}
            onMouseEnter={() => playSound('hover')}
            className="w-full py-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold rounded-lg text-sm transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/50"
          >
            🚀 Next Challenge
          </button>
        )}

        {/* Close message for historical view */}
        {isHistorical && (
          <p className="text-center text-gray-400 text-xs mt-2">
            📜 Viewing historical round - Click X to close
          </p>
        )}
      </div>
      )}
    </div>
  );
}
