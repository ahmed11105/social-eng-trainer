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

        {/* Success Icon */}
        <div className="text-center mb-3 sm:mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-full mb-2 sm:mb-3 animate-bounce">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-yellow-400" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">
            Mission Complete!
          </h2>
          <p className="text-green-400 text-sm sm:text-base font-semibold mb-1">Password Cracked Successfully!</p>
          {isFastTime && (
            <p className="text-yellow-400 text-xs sm:text-sm font-semibold animate-pulse">⚡ Lightning Fast!</p>
          )}
        </div>

        {/* Stats - Reordered with smooth top-to-bottom reveal */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          {/* 1. Password and Time side-by-side - NEW LAYOUT */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${showStats ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0s' }}>
            {/* Password */}
            <div className="bg-black/50 border border-gray-700 rounded-xl p-2 sm:p-3">
              <div className="text-gray-400 text-xs sm:text-sm mb-1">Password was:</div>
              <code className="text-green-400 font-mono text-sm sm:text-base block break-all font-bold">
                {password}
              </code>
            </div>

            {/* Time */}
            <div className="bg-gradient-to-r from-green-900/40 to-blue-900/40 border-2 border-green-500/50 rounded-xl p-2 sm:p-3">
              <div className="flex items-center justify-between">
                <span className="text-green-400 font-semibold text-xs sm:text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  Your Time
                </span>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-bold text-white block">
                    {formatTime(timeTaken)}
                  </span>
                  {isNewRecord && (
                    <span className="text-yellow-400 text-xs font-bold animate-pulse">
                      🏆 NEW RECORD!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Score Breakdown - Show for non-historical rounds */}
          {!isHistorical && roundScore && (
            <div className={`bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 rounded-xl p-3 ${showStats ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Speed Points
                  </span>
                  <span className="font-bold text-white">{roundScore.basePoints}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 flex items-center gap-1">
                    <Target className="w-4 h-4 text-blue-400" />
                    Accuracy Multiplier
                  </span>
                  <span className={`font-bold ${roundScore.accuracyMultiplier === 0 ? 'text-red-400' : roundScore.accuracyMultiplier === 2.0 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {roundScore.accuracyMultiplier.toFixed(1)}x
                  </span>
                </div>
                <div className="border-t border-purple-500/30 pt-2 flex items-center justify-between">
                  <span className="text-purple-300 font-semibold">Total XP Earned</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    +{roundScore.finalPoints}
                  </span>
                </div>
                {roundScore.incorrectDeletions > 0 && (
                  <p className="text-xs text-red-400 text-center mt-2">
                    ⚠️ {roundScore.incorrectDeletions} wrong deletion{roundScore.incorrectDeletions > 1 ? 's' : ''} reduced multiplier
                  </p>
                )}
                {roundScore.accuracyMultiplier === 2.0 && (
                  <p className="text-xs text-green-400 text-center mt-2 animate-pulse">
                    🎯 Perfect accuracy! 2x multiplier!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 3. Overall Stats Grid THIRD - HIDDEN on mobile, VISIBLE on sm+ */}
          <div className={`hidden sm:grid grid-cols-3 gap-2 ${showStats ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-lg p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">{totalRounds}</div>
              <div className="text-xs text-gray-400 mt-1">Rounds</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-lg p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">{currentStreak}</div>
              <div className="text-xs text-gray-400 mt-1">Streak 🔥</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-500/30 rounded-lg p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-400">
                {fastestTime ? formatTime(fastestTime) : '--'}
              </div>
              <div className="text-xs text-gray-400 mt-1">Best</div>
            </div>
          </div>
        </div>

        {/* Next Round Button - ALWAYS VISIBLE (unless viewing history) */}
        {!isHistorical && (
          <>
            <button
              onClick={() => {
                playSound('click');
                onNextRound();
              }}
              onMouseEnter={() => playSound('hover')}
              className="w-full py-2 sm:py-3 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold rounded-xl text-base sm:text-lg transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/50 animate-pulse-slow"
            >
              🚀 Next Challenge
            </button>

            <p className="hidden sm:block text-center text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3">
              Ready for the next mission?
            </p>
          </>
        )}

        {/* Close message for historical view */}
        {isHistorical && (
          <p className="text-center text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3">
            📜 Viewing historical round - Click X to close
          </p>
        )}
      </div>
      )}
    </div>
  );
}
