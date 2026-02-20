'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import LoginForm from '@/components/LoginForm';
import CompletionModal from '@/components/CompletionModal';
import { useGame } from '@/contexts/GameContext';

export default function LoginPage() {
  const router = useRouter();
  const { roundCompleted, elapsedTime, currentProfile, stats, isViewingHistory, viewedProfile, startNewRound, setHasPosted } = useGame();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

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
