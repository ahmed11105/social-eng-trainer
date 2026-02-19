'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Profile from '@/components/Profile';
import TweetFeed from '@/components/TweetFeed';
import HashBanner from '@/components/HashBanner';
import CompletionModal from '@/components/CompletionModal';
import StatsPanel from '@/components/StatsPanel';
import ProfileNavigationBar from '@/components/ProfileNavigationBar';
import { useGame } from '@/contexts/GameContext';
import { isAuthenticated, clearAuthSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  const {
    currentProfile,
    viewedProfile,
    isViewingHistory,
    roundCompleted,
    elapsedTime,
    stats,
    difficulty,
    hasPosted,
    setHasPosted,
    completeRound,
    startNewRound,
  } = useGame();

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  // Check for round completion when user logs in and makes first post
  useEffect(() => {
    if (isAuth && hasPosted && !roundCompleted) {
      completeRound();
    }
  }, [isAuth, hasPosted, roundCompleted, completeRound]);

  const handleLogout = () => {
    clearAuthSession();
    setIsAuth(false);
    router.refresh();
  };

  const handleNextRound = () => {
    // Clear auth and start new round
    clearAuthSession();
    setIsAuth(false);
    setHasPosted(false);
    startNewRound();
  };

  if (!currentProfile || !viewedProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Generating profile...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 max-w-2xl border-r border-gray-800">
        <div className="border-b border-gray-800 p-4 backdrop-blur bg-black/80 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">OSINT Challenge</h2>
            {isViewingHistory && (
              <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-600/50 text-yellow-400 text-sm rounded-full">
                📜 Viewing History
              </span>
            )}
          </div>
        </div>

        {/* Hash Banner */}
        <HashBanner
          hash={viewedProfile.passwordHash}
          difficulty={viewedProfile.difficulty}
        />

        <Profile
          profile={viewedProfile.profile}
          isAuthenticated={isAuth && !isViewingHistory}
          onLogout={handleLogout}
        />

        <TweetFeed
          initialTweets={viewedProfile.tweets}
          isAuthenticated={isAuth && !isViewingHistory}
          onFirstPost={() => setHasPosted(true)}
          profile={viewedProfile.profile}
        />
      </main>

      <StatsPanel />

      {/* Profile Navigation */}
      <ProfileNavigationBar />

      {/* Completion Modal */}
      {roundCompleted && !isViewingHistory && (
        <CompletionModal
          timeTaken={elapsedTime}
          password={currentProfile.password}
          clues={currentProfile.clues}
          difficulty={difficulty}
          totalRounds={stats.totalRounds}
          currentStreak={stats.currentStreak}
          fastestTime={stats.fastestTime}
          onNextRound={handleNextRound}
        />
      )}
    </div>
  );
}
