'use client';

import { Check, Copy, LogIn, MessageSquare } from 'lucide-react';

interface ProgressTrackerProps {
  hashCopied: boolean;
  isLoggedIn: boolean;
  hasPosted: boolean;
}

export default function ProgressTracker({ hashCopied, isLoggedIn, hasPosted }: ProgressTrackerProps) {
  const steps = [
    {
      id: 'hash',
      label: 'Copy MD5 Hash',
      icon: Copy,
      completed: hashCopied,
      description: 'Click the hash banner to copy',
    },
    {
      id: 'login',
      label: 'Login Successfully',
      icon: LogIn,
      completed: isLoggedIn,
      description: 'Crack the hash and login',
    },
    {
      id: 'post',
      label: 'Make a Post',
      icon: MessageSquare,
      completed: hasPosted,
      description: 'Post something to complete',
    },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span>🎯</span>
          <span>Progress</span>
        </h3>
        <span className="text-sm text-gray-400">
          {completedCount}/{steps.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = !step.completed && (index === 0 || steps[index - 1].completed);

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${
                step.completed
                  ? 'bg-green-900/30 border border-green-500/30'
                  : isActive
                  ? 'bg-blue-900/20 border border-blue-500/30 animate-pulse'
                  : 'bg-gray-800/50 border border-gray-700/30 opacity-60'
              }`}
            >
              {/* Icon/Checkbox */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400'
                    : 'bg-gray-700 border-2 border-gray-600 text-gray-500'
                }`}
              >
                {step.completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Label and Description */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold text-sm ${
                    step.completed
                      ? 'text-green-400'
                      : isActive
                      ? 'text-blue-400'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
              </div>

              {/* Completion Badge */}
              {step.completed && (
                <div className="flex-shrink-0 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-semibold">
                  ✓ Done
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedCount === steps.length && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-lg text-center">
          <p className="text-green-400 font-bold">🎉 Round Complete!</p>
          <p className="text-xs text-gray-400 mt-1">Check your stats and completion modal</p>
        </div>
      )}
    </div>
  );
}
