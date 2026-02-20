'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Profile from '@/components/Profile';
import TweetFeed from '@/components/TweetFeed';
import HashBanner from '@/components/HashBanner';
import CompletionModal from '@/components/CompletionModal';
import StatsPanel from '@/components/StatsPanel';
import ProfileNavigationBar from '@/components/ProfileNavigationBar';
import HowToPlayModal from '@/components/HowToPlayModal';
import { useGame } from '@/contexts/GameContext';
import { isAuthenticated, clearAuthSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { HelpCircle } from 'lucide-react';

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
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
    allSensitiveTweetsDeleted,
    setHasPosted,
    completeRound,
    startNewRound,
  } = useGame();

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  // Check for round completion when user logs in and deletes all sensitive tweets
  useEffect(() => {
    if (isAuth && allSensitiveTweetsDeleted && !roundCompleted) {
      completeRound();
    }
  }, [isAuth, allSensitiveTweetsDeleted, roundCompleted, completeRound]);

  // Show completion modal when round is completed
  useEffect(() => {
    if (roundCompleted && !isViewingHistory) {
      setShowCompletionModal(true);
    }
  }, [roundCompleted, isViewingHistory]);

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
            <div className="flex items-center gap-3">
              {isViewingHistory && (
                <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-600/50 text-yellow-400 text-sm rounded-full">
                  📜 Viewing History
                </span>
              )}
            </div>
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

      <StatsPanel onRoundComplete={() => setShowCompletionModal(true)} />

      {/* Profile Navigation */}
      <ProfileNavigationBar />

      {/* How to Play Button - Bottom Left */}
      <button
        onClick={() => setShowHowToPlay(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 border border-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <HelpCircle className="w-5 h-5" />
        How to Play
      </button>

      {/* Completion Modal */}
      {showCompletionModal && roundCompleted && (
        <CompletionModal
          timeTaken={elapsedTime}
          password={viewedProfile.password}
          clues={viewedProfile.clues}
          difficulty={viewedProfile.difficulty}
          totalRounds={stats.totalRounds}
          currentStreak={stats.currentStreak}
          fastestTime={stats.fastestTime}
          onNextRound={handleNextRound}
          onClose={() => setShowCompletionModal(false)}
          isHistorical={isViewingHistory}
        />
      )}

      {/* Floating Next Round Button (when modal is closed but round completed) */}
      {!showCompletionModal && roundCompleted && !isViewingHistory && (
        <button
          onClick={handleNextRound}
          className="fixed bottom-6 right-6 z-40 px-6 py-4 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-green-500/50 transition-all transform hover:scale-110 animate-pulse-slow"
        >
          🚀 Next Round
        </button>
      )}

      {/* How to Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
}
