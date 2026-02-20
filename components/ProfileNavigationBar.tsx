'use client';

import { useGame } from '@/contexts/GameContext';

export default function ProfileNavigationBar() {
  const {
    profileHistory,
    currentViewIndex,
    goToPreviousProfile,
    goToNextProfile,
    goToProfile,
    isViewingHistory,
  } = useGame();

  // Don't show if there's no history or if data is not ready
  if (!profileHistory || profileHistory.length === 0) {
    return null;
  }

  const totalRounds = profileHistory.length + 1; // +1 for current profile

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 shadow-2xl">
        <div className="flex items-center gap-4">
          {/* Previous Button */}
          <button
            onClick={goToPreviousProfile}
            disabled={currentViewIndex === 0}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full font-semibold transition-all hover:scale-105 active:scale-95"
            title="Previous Profile"
            aria-label="Previous profile"
          >
            ← Prev
          </button>

          {/* Round Numbers */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalRounds }, (_, i) => {
              const isCurrentRound = i === totalRounds - 1;
              const isActive = i === currentViewIndex;

              return (
                <button
                  key={i}
                  onClick={() => goToProfile(i)}
                  className={`
                    w-10 h-10 rounded-full font-bold transition-all
                    ${isActive
                      ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/50'
                      : isCurrentRound
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }
                  `}
                  title={isCurrentRound ? 'Current Round (Active)' : `Round ${i + 1}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Next Button (only show when viewing history) */}
          {isViewingHistory && (
            <button
              onClick={goToNextProfile}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full font-semibold transition-all hover:scale-105 active:scale-95"
              title="Next Profile"
              aria-label="Next profile"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
