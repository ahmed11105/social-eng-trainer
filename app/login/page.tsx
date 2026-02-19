'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import LoginForm from '@/components/LoginForm';
import ProgressTracker from '@/components/ProgressTracker';
import CompletionModal from '@/components/CompletionModal';
import { useGame } from '@/contexts/GameContext';
import { isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { hashCopied, hasPosted, roundCompleted, elapsedTime, currentProfile, stats, isViewingHistory, viewedProfile, startNewRound, setHasPosted } = useGame();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleNextRound = () => {
    // Clear auth and start new round
    setHasPosted(false);
    startNewRound();
    setShowCompletionModal(false);
    router.push('/');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Topographic/circuit pattern background */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, transparent 10%, rgba(16, 185, 129, 0.1) 11%, transparent 12%),
              radial-gradient(circle at 75% 75%, transparent 10%, rgba(59, 130, 246, 0.1) 11%, transparent 12%),
              radial-gradient(circle at 50% 50%, transparent 20%, rgba(16, 185, 129, 0.05) 21%, transparent 22%),
              linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
              linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '200px 200px, 180px 180px, 300px 300px, 50px 50px, 50px 50px',
            backgroundPosition: '0 0, 100px 100px, 50px 50px, 0 0, 0 0'
          }}
        />

        {/* Additional pattern layer for depth */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(59, 130, 246, 0.1) 35px, rgba(59, 130, 246, 0.1) 36px),
              repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(16, 185, 129, 0.1) 35px, rgba(16, 185, 129, 0.1) 36px)
            `
          }}
        />

        <div className="border-b border-gray-800 p-4 backdrop-blur bg-black/80 sticky top-0 z-10">
          <h2 className="text-xl font-bold">Login - OSINT Challenge</h2>
        </div>

        <LoginForm />
      </main>

      {/* Progress Tracker - Minimal version on right side */}
      <div className="hidden lg:block w-72 p-6">
        <div className="sticky top-20">
          {/* Minimal progress checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Progress</h3>

            <div className={`flex items-center gap-3 ${hashCopied ? 'text-green-400' : 'text-gray-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hashCopied ? 'bg-green-500/20 border-2 border-green-500' : 'border-2 border-gray-700'}`}>
                {hashCopied && <span className="text-xs">✓</span>}
              </div>
              <span className="text-sm">Copy Hash</span>
            </div>

            <div className={`flex items-center gap-3 ${isLoggedIn ? 'text-blue-400' : 'text-gray-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isLoggedIn ? 'bg-blue-500/20 border-2 border-blue-500 animate-pulse' : 'border-2 border-gray-700'}`}>
                {isLoggedIn && <span className="text-xs">✓</span>}
              </div>
              <span className="text-sm font-semibold">Login Here</span>
            </div>

            <div className={`flex items-center gap-3 ${hasPosted ? 'text-purple-400' : 'text-gray-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${hasPosted ? 'bg-purple-500/20 border-2 border-purple-500' : 'border-2 border-gray-700'}`}>
                {hasPosted && <span className="text-xs">✓</span>}
              </div>
              <span className="text-sm">Make Post</span>
            </div>

            {hashCopied && isLoggedIn && hasPosted && (
              <button
                onClick={() => setShowCompletionModal(true)}
                className="mt-4 w-full p-2 text-xs bg-gradient-to-r from-green-900/20 to-blue-900/20 hover:from-green-900/40 hover:to-blue-900/40 border border-green-500/30 hover:border-green-500/50 rounded text-green-400 transition-all"
              >
                🎉 View Completion
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && roundCompleted && currentProfile && (
        <CompletionModal
          timeTaken={elapsedTime}
          password={viewedProfile?.password || currentProfile.password}
          clues={viewedProfile?.clues || currentProfile.clues}
          difficulty={viewedProfile?.difficulty || currentProfile.difficulty}
          totalRounds={stats.totalRounds}
          currentStreak={stats.currentStreak}
          fastestTime={stats.fastestTime}
          onNextRound={handleNextRound}
          onClose={() => setShowCompletionModal(false)}
          isHistorical={isViewingHistory}
        />
      )}
    </div>
  );
}
