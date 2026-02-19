'use client';

import { useGame } from '@/contexts/GameContext';
import Timer from './Timer';

export default function StatsPanel() {
  const { stats, resetGame, skipLevel } = useGame();

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-80 p-4 space-y-4">
      {/* Timer */}
      <div className="flex justify-center">
        <Timer />
      </div>

      {/* Stats Dashboard */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <span>📊</span>
          <span>Your Stats</span>
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Rounds Completed</span>
            <span className="text-2xl font-bold text-white">{stats.roundsCompleted}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Current Streak</span>
            <span className="text-2xl font-bold text-yellow-400">{stats.currentStreak}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Best Streak</span>
            <span className="text-2xl font-bold text-blue-400">{stats.bestStreak}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Fastest Time</span>
            <span className="text-2xl font-bold text-green-400">
              {formatTime(stats.fastestTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Training Instructions */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h3 className="font-bold text-lg mb-3">Training Instructions</h3>
        <ol className="text-sm space-y-2 text-gray-300">
          <li>1. Study the profile and tweets for clues 🔍</li>
          <li>2. Build a wordlist with password patterns</li>
          <li>3. Crack the MD5 hash using hashcat</li>
          <li>4. Login and make a post to complete!</li>
        </ol>
      </div>

      {/* Skip Level Button */}
      <button
        onClick={() => {
          if (confirm('Skip this profile and generate a new one? (No stats penalty)')) {
            skipLevel();
          }
        }}
        className="w-full px-4 py-2 bg-yellow-900/50 hover:bg-yellow-900/70 text-yellow-400 rounded-lg font-medium transition-colors"
      >
        ⏭️ Skip Level
      </button>

      {/* Reset Button */}
      <button
        onClick={() => {
          if (confirm('Reset all stats and start fresh? This cannot be undone.')) {
            resetGame();
          }
        }}
        className="w-full px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg text-sm font-medium transition-colors"
      >
        Reset All Stats
      </button>

      {/* Quick Tips */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h3 className="font-bold mb-2">Quick Tips 💡</h3>
        <ul className="text-sm space-y-1 text-gray-400">
          <li>• Look for pet names</li>
          <li>• Check birth years and dates</li>
          <li>• Note adoption years</li>
          <li>• Combine words + numbers</li>
        </ul>
      </div>
    </div>
  );
}
