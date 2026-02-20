'use client';

import { useEffect, useState } from 'react';
import { playAudioEffect } from '@/lib/audioEffects';

interface XPCircleProps {
  currentLevel: number;
  xpGained: number;
  startXP: number; // XP at start of animation (within current level)
  xpForLevel: number; // Total XP needed for current level
  onComplete: () => void;
}

export default function XPCircle({
  currentLevel,
  xpGained,
  startXP,
  xpForLevel,
  onComplete,
}: XPCircleProps) {
  const [animatedXP, setAnimatedXP] = useState(startXP);
  const [isComplete, setIsComplete] = useState(false);

  const endXP = Math.min(startXP + xpGained, xpForLevel);
  const startProgress = startXP / xpForLevel;
  const endProgress = endXP / xpForLevel;

  // SVG circle properties
  const size = 280;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dash offset for progress
  const progress = animatedXP / xpForLevel;
  const offset = circumference - progress * circumference;

  useEffect(() => {
    // Animate XP counting up
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    const xpPerStep = (endXP - startXP) / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newXP = startXP + (xpPerStep * currentStep);

      if (currentStep >= steps) {
        setAnimatedXP(endXP);
        clearInterval(interval);

        // Wait a moment then mark as complete
        setTimeout(() => {
          setIsComplete(true);
          // Fade out after 1 second
          setTimeout(() => {
            onComplete();
          }, 1000);
        }, 500);
      } else {
        setAnimatedXP(newXP);
      }

      // Play subtle tick sound every few steps
      if (currentStep % 5 === 0) {
        playAudioEffect('click', 0.05);
      }
    }, stepDuration);

    // Celebration sound at the end
    setTimeout(() => {
      playAudioEffect('success', 0.4);
    }, duration);

    return () => clearInterval(interval);
  }, [startXP, endXP, xpGained, onComplete]);

  return (
    <div
      className={`flex items-center justify-center transition-opacity duration-1000 ${
        isComplete ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative">
        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.4) 0%, transparent 70%)',
          }}
        />

        {/* SVG Circle */}
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(75, 85, 99, 0.3)"
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-100 ease-out"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Level number */}
          <div className="text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            {currentLevel}
          </div>
          <div className="text-sm text-gray-400 mt-1 font-semibold">LEVEL</div>

          {/* XP Progress */}
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-white">
              +{Math.floor(animatedXP - startXP)}
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {Math.floor(animatedXP)}/{xpForLevel} XP
            </div>
          </div>

          {/* Progress percentage */}
          <div className="mt-3 text-xs text-gray-400 font-semibold">
            {Math.floor(progress * 100)}%
          </div>
        </div>

        {/* Particle effects around the circle */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full animate-pulse"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 30}deg) translateY(-${radius + 30}px)`,
                animationDelay: `${i * 0.1}s`,
                opacity: progress > i / 12 ? 1 : 0.2,
                transition: 'opacity 0.3s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
