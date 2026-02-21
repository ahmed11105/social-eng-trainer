'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lock, Lightbulb, Zap } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { playSound } from '@/lib/sounds';

export default function Sidebar() {
  const pathname = usePathname();
  const { difficulty, changeDifficulty } = useGame();

  return (
    <div className="w-64 h-screen sticky top-0 p-4 border-r border-gray-800">
      <div className="text-2xl font-bold mb-8 text-green-400">OSINT Trainer</div>

      <nav className="space-y-2">
        <Link href="/" className={`flex items-center gap-4 p-3 rounded-full text-xl hover:bg-gray-900 ${pathname === '/' ? 'font-bold' : ''}`}>
          <Home className="w-6 h-6" />
          <span>Home</span>
        </Link>

        <Link href="/login" className={`flex items-center gap-4 p-3 rounded-full text-xl hover:bg-gray-900 ${pathname === '/login' ? 'font-bold' : ''}`}>
          <Lock className="w-6 h-6" />
          <span>Login</span>
        </Link>
      </nav>

      {/* Difficulty Selector */}
      <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-semibold text-gray-200">Difficulty</h3>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              playSound('click');
              changeDifficulty('easy');
            }}
            onMouseEnter={() => playSound('hover')}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              difficulty === 'easy'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => {
              playSound('click');
              changeDifficulty('medium');
            }}
            onMouseEnter={() => playSound('hover')}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              difficulty === 'medium'
                ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => {
              playSound('click');
              changeDifficulty('hard');
            }}
            onMouseEnter={() => playSound('hover')}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              difficulty === 'hard'
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Hard
          </button>
        </div>

        {/* Difficulty Description */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-400">
            {difficulty === 'easy' && '• MD5 hash\n• Lowercase passwords\n• All clues shown'}
            {difficulty === 'medium' && '• SHA-256 hash\n• Capitalized passwords\n• Some clues hidden'}
            {difficulty === 'hard' && '• SHA-256 hash\n• Special chars & leetspeak\n• Many clues hidden'}
          </p>
        </div>
      </div>

      {/* Quick Tips - Clean & Minimal */}
      <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-semibold text-gray-200">Password Clues</h3>
        </div>

        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">•</span>
            <span>Pet names</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">•</span>
            <span>Birth years & dates</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">•</span>
            <span>Locations & places</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">•</span>
            <span>Words + numbers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
