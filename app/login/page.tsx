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
        {/* Aesthetic black/grey background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop&q=80)',
            filter: 'brightness(0.3)'
          }}
        />

        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/60" />

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
