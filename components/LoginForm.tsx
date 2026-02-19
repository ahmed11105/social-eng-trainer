'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateCredentials, setAuthSession } from '@/lib/auth';
import { useGame } from '@/contexts/GameContext';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showHintOffer, setShowHintOffer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const router = useRouter();
  const { currentProfile } = useGame();

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
      setAuthSession(username);
      router.push('/');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setError('Invalid credentials! Keep cracking that hash 🔐');

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
      <div className="max-w-4xl mx-auto mt-20 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Login Form */}
          <div className="md:col-span-2 bg-gray-900 rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-2">Login</h1>
            <p className="text-gray-400 mb-6">Enter the credentials you cracked!</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full p-3 bg-black border border-gray-700 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter cracked password"
                  className="w-full p-3 bg-black border border-gray-700 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-black p-4 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-500 mb-2">Target MD5 Hash:</p>
                <code className="text-xs text-green-400 break-all">{currentProfile.passwordHash}</code>
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
                className="w-full py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            </form>

            <div className="mt-6 p-4 bg-black rounded-lg border border-gray-800">
              <p className="text-xs text-gray-400">
                <strong>How to crack:</strong><br/>
                1. Analyze the profile for clues<br/>
                2. Build a wordlist with possible passwords<br/>
                3. Use hashcat: <code className="text-green-400">hashcat -m 0 -a 0 hash.txt wordlist.txt</code><br/>
                4. Enter the cracked password here!
              </p>
            </div>
          </div>

          {/* Username Reminder Sidebar */}
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-green-400 mb-3">💡 Reminder</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Username:</p>
                  <p className="text-white font-mono bg-black/50 p-2 rounded border border-green-500/30">
                    @{currentProfile.profile.username}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">No @ symbol when logging in</p>
                </div>
              </div>
            </div>

            {showHint && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3">🔍 Password Hint</h3>
                <p className="text-sm text-gray-300 mb-2">Look for these clues in the profile:</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  {currentProfile.clues.map((clue, i) => (
                    <li key={i}>• {clue}</li>
                  ))}
                </ul>
                <p className="text-xs text-green-400 mt-3">
                  Password pattern: {currentProfile.password.toLowerCase()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hint Offer Modal */}
      {showHintOffer && !showHint && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-blue-500/30 rounded-lg max-w-md w-full p-6">
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
