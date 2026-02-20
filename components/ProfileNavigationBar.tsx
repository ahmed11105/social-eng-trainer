'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { playPitchedHover, playSound } from '@/lib/sounds';

export default function ProfileNavigationBar() {
  const {
    profileHistory,
    currentViewIndex,
    goToPreviousProfile,
    goToNextProfile,
    goToProfile,
    isViewingHistory,
  } = useGame();

  const [isHidden, setIsHidden] = useState(false);

  // Hide nav bar when scrolled to bottom, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Check if user is near bottom (within 100px)
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      setIsHidden(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show if there's no history or if data is not ready
  if (!profileHistory || profileHistory.length === 0) {
    return null;
  }

  const totalRounds = profileHistory.length + 1; // +1 for current profile

  // Calculate pitch range for navigation buttons
  const LOW_PITCH = 300; // Hz - lowest pitch for first button
  const HIGH_PITCH = 900; // Hz - highest pitch for last button

  // Calculate total number of buttons (Prev + numbers + Next if applicable)
  const totalButtons = 1 + totalRounds + (isViewingHistory ? 1 : 0); // Prev + numbers + (Next if viewing history)

  // Helper function to calculate pitch for a button at given index
  const getPitchForIndex = (index: number): number => {
    if (totalButtons <= 1) return LOW_PITCH;
    return LOW_PITCH + (HIGH_PITCH - LOW_PITCH) * (index / (totalButtons - 1));
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-transform duration-300 ease-in-out ${
        isHidden ? 'translate-y-32' : 'translate-y-0'
      }`}
    >
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 shadow-2xl max-w-4xl">
        <div className="flex items-center gap-4">
          {/* Previous Button */}
          <button
            onClick={() => {
              playSound('click');
              goToPreviousProfile();
            }}
            onMouseEnter={() => playPitchedHover(getPitchForIndex(0))}
            disabled={currentViewIndex === 0}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-full font-semibold transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            title="Previous Profile"
            aria-label="Previous profile"
          >
            ← Prev
          </button>

          {/* Round Numbers - scrollable if too many */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-2xl scrollbar-hide">
            {Array.from({ length: totalRounds }, (_, i) => {
              const isCurrentRound = i === totalRounds - 1;
              const isActive = i === currentViewIndex;
              const buttonIndex = 1 + i; // Prev is 0, numbers start at 1

              return (
                <button
                  key={i}
                  onClick={() => {
                    playSound('click');
                    goToProfile(i);
                  }}
                  onMouseEnter={() => playPitchedHover(getPitchForIndex(buttonIndex))}
                  className={`
                    w-10 h-10 rounded-full font-bold transition-all flex-shrink-0
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
              onClick={() => {
                playSound('click');
                goToNextProfile();
              }}
              onMouseEnter={() => playPitchedHover(getPitchForIndex(totalButtons - 1))}
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
