'use client';

import { useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Clock } from 'lucide-react';

export default function Timer() {
  const { isRunning, elapsedTime, startTime, updateElapsedTime, isViewingHistory, viewedProfile } = useGame();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        updateElapsedTime(elapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime, updateElapsedTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // When viewing history, show the completion time of that round
  // Otherwise show the current elapsed time
  const displayTime = isViewingHistory && viewedProfile?.completionTime !== undefined
    ? viewedProfile.completionTime
    : elapsedTime;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-800">
      <Clock className="w-5 h-5 text-green-400" />
      <span className="font-mono text-lg font-bold text-white">
        {formatTime(displayTime)}
      </span>
    </div>
  );
}
