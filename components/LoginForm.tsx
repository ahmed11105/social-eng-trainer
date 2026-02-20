'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateCredentials, setAuthSession, isAuthenticated } from '@/lib/auth';
import { useGame } from '@/contexts/GameContext';
import { playSound } from '@/lib/sounds';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showHintOffer, setShowHintOffer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const router = useRouter();
  const { currentProfile, hashCopied, hasPosted, setHashCopied } = useGame();
  const isLoggedIn = isAuthenticated();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentProfile) {
      setError('Profile not loaded. Please try again.');
      return;
    }

    if (validateCredentials(
      username,
      password,
      currentProfile.profile.username,
      currentProfile.passwordHash
    )) {
      // Mark hash as copied since they successfully cracked it
      setHashCopied(true);
      setAuthSession(username);
      playSound('success'); // Victory sound!
      router.push('/');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setError('Invalid credentials! Keep cracking that hash 🔐');
      playSound('error'); // Error buzz

      // Offer hint after 3 failed attempts
      if (newAttempts >= 3 && !showHint) {
        setShowHintOffer(true);
      }
    }
  };

  if (!currentProfile) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-gray-900 rounded-2xl">
        <p className="text-center text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative max-w-md mx-auto mt-20">
        {/* Post-it username reminder */}
        {!showHint && (
          <div className="absolute -top-6 -right-6 z-10 transform rotate-6 hover:rotate-12 transition-transform">
            <div className="bg-yellow-200 text-black p-3 shadow-lg" style={{
              boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
              fontFamily: 'Comic Sans MS, cursive'
            }}>
              <div className="text-xs font-bold mb-1">Username 📌</div>
              <div className="font-mono text-sm">@{currentProfile.profile.username}</div>
              <div className="text-xs text-gray-700 mt-1">(no @ when logging in)</div>
            </div>
          </div>
        )}

        {/* Hint sticky note (replaces post-it when hint is shown) */}
        {showHint && (
          <div className="absolute -top-6 -right-6 z-10 transform rotate-6 hover:rotate-12 transition-transform">
            <div className="bg-blue-200 text-black p-3 shadow-lg max-w-xs" style={{
              boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
              fontFamily: 'Comic Sans MS, cursive'
            }}>
              <div className="text-xs font-bold mb-2">🔍 Hints</div>
              {currentProfile.clues.map((clue, i) => (
                <div key={i} className="text-xs mb-1">• {clue}</div>
              ))}
              <div className="text-xs font-bold mt-2 text-blue-900">
                Pattern: {currentProfile.password.toLowerCase()}
              </div>
            </div>
          </div>
        )}

        {/* Login form */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
          <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Login
          </h1>
          <p className="text-gray-400 mb-4 text-center">Enter the credentials you cracked!</p>

          {/* Compact horizontal progress */}
          <div className="flex items-center justify-center gap-2 mb-6 px-4">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${hashCopied ? 'bg-green-500' : 'bg-gray-700'}`} />
              <span className={`text-xs ${hashCopied ? 'text-green-400' : 'text-gray-600'}`}>Hash</span>
            </div>
            <div className={`h-px flex-1 max-w-[40px] ${hashCopied ? 'bg-green-500' : 'bg-gray-700'}`} />
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isLoggedIn ? 'bg-blue-500 animate-pulse' : 'bg-gray-700'}`} />
              <span className={`text-xs font-semibold ${isLoggedIn ? 'text-blue-400' : 'text-gray-600'}`}>Login</span>
            </div>
            <div className={`h-px flex-1 max-w-[40px] ${isLoggedIn ? 'bg-blue-500' : 'bg-gray-700'}`} />
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${hasPosted ? 'bg-purple-500' : 'bg-gray-700'}`} />
              <span className={`text-xs ${hasPosted ? 'text-purple-400' : 'text-gray-600'}`}>Post</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full p-3 bg-black border border-gray-700 rounded-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter cracked password"
                className="w-full p-3 bg-black border border-gray-700 rounded-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-sm">
                {error}
                {failedAttempts > 0 && (
                  <p className="text-xs mt-1 text-red-300">Attempts: {failedAttempts}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              onClick={() => playSound('click')}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-green-500/50"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Hint Offer Modal */}
      {showHintOffer && !showHint && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-blue-500/30 rounded-lg max-w-md w-full p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-blue-400 mb-3">Need a Hint?</h2>
            <p className="text-gray-300 mb-6">
              You've tried {failedAttempts} times. Would you like a hint to help crack this password?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowHintOffer(false)}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                No Thanks
              </button>
              <button
                onClick={() => {
                  setShowHint(true);
                  setShowHintOffer(false);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Show Hint
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
