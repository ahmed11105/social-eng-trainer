'use client';

interface CompletionModalProps {
  timeTaken: number;
  password: string;
  clues: string[];
  difficulty: string;
  totalRounds: number;
  currentStreak: number;
  fastestTime: number | null;
  onNextRound: () => void;
}

export default function CompletionModal({
  timeTaken,
  password,
  clues,
  difficulty,
  totalRounds,
  currentStreak,
  fastestTime,
  onNextRound,
}: CompletionModalProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isNewRecord = fastestTime === timeTaken && totalRounds > 1;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full transform transition-all border-2 border-green-500/50 shadow-2xl shadow-green-500/20">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
            <span className="text-5xl">🎉</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Round Complete!</h2>
          <p className="text-gray-400 text-sm">You successfully cracked the password and posted!</p>
        </div>

        {/* Stats */}
        <div className="space-y-4 mb-6">
          {/* Time Taken */}
          <div className="bg-black/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Time Taken</span>
              <span className="text-2xl font-bold text-white">
                {formatTime(timeTaken)}
                {isNewRecord && <span className="text-yellow-400 text-sm ml-2">🏆 NEW RECORD!</span>}
              </span>
            </div>
          </div>

          {/* Password Revealed */}
          <div className="bg-black/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Password was:</div>
            <code className="text-green-400 font-mono text-lg block break-all">
              {password}
            </code>
          </div>

          {/* Clues */}
          <div className="bg-black/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-3">Key Clues in Profile:</div>
            <ul className="space-y-2">
              {clues.map((clue, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span className="text-gray-300">{clue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{totalRounds}</div>
              <div className="text-xs text-gray-400 mt-1">Total Rounds</div>
            </div>
            <div className="bg-black/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-400">{currentStreak}</div>
              <div className="text-xs text-gray-400 mt-1">Streak</div>
            </div>
            <div className="bg-black/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {fastestTime ? formatTime(fastestTime) : '--'}
              </div>
              <div className="text-xs text-gray-400 mt-1">Best Time</div>
            </div>
          </div>
        </div>

        {/* Next Round Button */}
        <button
          onClick={onNextRound}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
        >
          Next Round →
        </button>

        <p className="text-center text-gray-500 text-xs mt-4">
          Take your time to review the profile and see what you missed!
        </p>
      </div>
    </div>
  );
}
