'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

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
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Play success sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTcIE2S57OihUBEJTKXh8bllHAU2jdXvynkoBSp+zPLaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBSl+y/LaizsKGGS56+mjTxELTqfd8LdnHgU7k9n0xnMpBQ==');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Fail silently if autoplay blocked

    // Delay showing stats for staggered animation
    setTimeout(() => setShowStats(true), 200);
  }, []);

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

      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-lg w-full my-auto transform transition-all border-2 border-green-500/50 shadow-2xl shadow-green-500/30 animate-scale-in relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Success Icon */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-full mb-3 sm:mb-4 animate-bounce">
            <span className="text-4xl sm:text-5xl md:text-6xl">🎉</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-3">
            Mission Complete!
          </h2>
          <p className="text-green-400 text-base sm:text-lg font-semibold mb-1">Password Cracked Successfully!</p>
          {isFastTime && (
            <p className="text-yellow-400 text-xs sm:text-sm font-semibold animate-pulse">⚡ Lightning Fast!</p>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 md:mb-8">
          {/* Time Taken - Highlighted - ALWAYS VISIBLE */}
          <div className={`bg-gradient-to-r from-green-900/40 to-blue-900/40 border-2 border-green-500/50 rounded-xl p-3 sm:p-4 md:p-5 ${showStats ? 'animate-scale-in' : 'opacity-0'}`}>
            <div className="flex items-center justify-between">
              <span className="text-green-400 font-semibold text-sm sm:text-base">⏱️ Your Time</span>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-bold text-white block">
                  {formatTime(timeTaken)}
                </span>
                {isNewRecord && (
                  <span className="text-yellow-400 text-xs sm:text-sm font-bold animate-pulse">
                    🏆 NEW RECORD!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Overall Stats - Grid - HIDDEN on xs, VISIBLE on sm+ */}
          <div className={`hidden sm:grid grid-cols-3 gap-2 sm:gap-3 ${showStats ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{totalRounds}</div>
              <div className="text-xs text-gray-400 mt-1">Rounds</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{currentStreak}</div>
              <div className="text-xs text-gray-400 mt-1">Streak 🔥</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-500/30 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-400">
                {fastestTime ? formatTime(fastestTime) : '--'}
              </div>
              <div className="text-xs text-gray-400 mt-1">Best</div>
            </div>
          </div>

          {/* Password Revealed - HIDDEN on xs, VISIBLE on md+ */}
          <div className={`hidden md:block bg-black/50 border border-gray-700 rounded-lg p-3 sm:p-4 ${showStats ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="text-gray-400 text-sm mb-2">Password was:</div>
            <code className="text-green-400 font-mono text-lg sm:text-xl block break-all font-bold">
              {password}
            </code>
          </div>

          {/* Clues - Collapsible - HIDDEN on xs and sm, VISIBLE on lg+ */}
          <details className={`hidden lg:block bg-black/30 border border-gray-700 rounded-lg ${showStats ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <summary className="p-3 sm:p-4 cursor-pointer text-gray-400 text-sm font-semibold hover:text-white transition-colors">
              📝 View Clues You Found
            </summary>
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <ul className="space-y-2">
                {clues.map((clue, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="text-gray-300">{clue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>

        {/* Next Round Button - ALWAYS VISIBLE (unless viewing history) */}
        {!isHistorical && (
          <>
            <button
              onClick={onNextRound}
              className="w-full py-3 sm:py-4 md:py-5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold rounded-xl text-lg sm:text-xl transition-all transform hover:scale-105 shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/50 animate-pulse-slow"
            >
              🚀 Next Challenge
            </button>

            <p className="text-center text-gray-400 text-xs sm:text-sm mt-3 sm:mt-4">
              Ready for the next mission?
            </p>
          </>
        )}

        {/* Close message for historical view */}
        {isHistorical && (
          <p className="text-center text-gray-400 text-xs sm:text-sm mt-3 sm:mt-4">
            📜 Viewing historical round - Click X to close
          </p>
        )}
      </div>
    </div>
  );
}
