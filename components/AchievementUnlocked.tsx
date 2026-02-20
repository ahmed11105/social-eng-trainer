'use client';

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import type { Achievement } from '@/lib/achievements';
import { getRarityColors } from '@/lib/achievements';
import { playSound } from '@/lib/sounds';

interface AchievementUnlockedProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementUnlocked({ achievement, onClose }: AchievementUnlockedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const colors = getRarityColors(achievement.rarity);

  useEffect(() => {
    // Play achievement sound
    playSound('milestone');

    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto close after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        fixed top-6 right-6 z-50
        ${colors.bg} ${colors.border}
        border-2 rounded-xl shadow-2xl ${colors.glow}
        p-4 min-w-[320px] max-w-md
        transition-all duration-500 ease-out
        ${
          isVisible
            ? 'translate-x-0 opacity-100 scale-100'
            : 'translate-x-[120%] opacity-0 scale-95'
        }
      `}
    >
      {/* Celebration particles */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float-up"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          />
        ))}
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`${colors.bg} ${colors.border} border rounded-lg p-2`}>
            <Trophy className={`w-6 h-6 ${colors.text} animate-bounce`} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Achievement Unlocked!
            </div>
            <div className={`text-sm font-medium ${colors.text} capitalize`}>
              {achievement.rarity}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-start gap-3">
          <div className="text-4xl">{achievement.icon}</div>
          <div className="flex-1">
            <h4 className="font-bold text-white text-lg">{achievement.name}</h4>
            <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
