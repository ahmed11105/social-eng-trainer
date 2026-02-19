'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateCredentials, setAuthSession } from '@/lib/auth';
import { useGame } from '@/contexts/GameContext';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
      setError('Invalid credentials! Keep cracking that hash 🔐');
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
    <div className="max-w-md mx-auto mt-20 p-8 bg-gray-900 rounded-2xl">
      <h1 className="text-3xl font-bold mb-2">Login</h1>
      <p className="text-gray-400 mb-6">Enter the credentials you cracked!</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={currentProfile.profile.username}
            className="w-full p-3 bg-black border border-gray-700 rounded-lg outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Hint: Check the profile username</p>
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
          <p className="text-xs text-gray-500 mt-1">Hint: Crack the MD5 hash using hashcat</p>
        </div>

        <div className="bg-black p-4 rounded-lg border border-gray-800">
          <p className="text-xs text-gray-500 mb-2">Target MD5 Hash:</p>
          <code className="text-xs text-green-400 break-all">{currentProfile.passwordHash}</code>
        </div>

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-sm">
            {error}
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
  );
}
