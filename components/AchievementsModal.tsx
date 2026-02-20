'use client';

import { useEffect } from 'react';
import { X, Trophy, Lock } from 'lucide-react';
import type { Achievement } from '@/lib/achievements';
import { getRarityColors, calculateAchievementProgress } from '@/lib/achievements';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
  stats?: {
    roundsCompleted: number;
    currentStreak: number;
    hashCopied: boolean;
    isLoggedIn: boolean;
  };
}

export default function AchievementsModal({ achievements, onClose, stats }: AchievementsModalProps) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  const unlocked = achievements.filter(a => a.unlocked).length;
  const total = achievements.length;
  const progress = (unlocked / total) * 100;

  // Group by rarity
  const grouped = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.rarity]) acc[achievement.rarity] = [];
    acc[achievement.rarity].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const rarityOrder: Achievement['rarity'][] = ['common', 'rare', 'epic', 'legendary'];

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
      style={{ zIndex: 10000 }}
      onClick={(e) => {
        // Close if clicking the backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-700 shadow-2xl animate-scale-in relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div>
              <h2 className="text-2xl font-bold">Achievements</h2>
              <p className="text-sm text-gray-400">{unlocked} of {total} unlocked ({progress.toFixed(0)}%)</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="p-6 space-y-8">
          {rarityOrder.map(rarity => {
            const items = grouped[rarity] || [];
            if (items.length === 0) return null;

            const colors = getRarityColors(rarity);

            return (
              <div key={rarity}>
                <h3 className={`${colors.text} font-bold uppercase text-sm mb-4 flex items-center gap-2`}>
                  <div className={`w-3 h-3 rounded-full ${colors.border} border-2`} />
                  {rarity}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(achievement => {
                    const itemColors = getRarityColors(achievement.rarity);
                    const progressData = stats ? calculateAchievementProgress(achievement.id, stats) : null;
                    const hasProgress = progressData && progressData.progress > 0;

                    return (
                      <div
                        key={achievement.id}
                        className={`
                          ${achievement.unlocked ? itemColors.bg : hasProgress ? 'bg-gray-900/50' : 'bg-gray-900/30'}
                          ${achievement.unlocked ? itemColors.border : hasProgress ? itemColors.border.replace('border-', 'border-').replace('500', '400') : 'border-gray-700'}
                          border-2 rounded-xl p-4 transition-all
                          ${achievement.unlocked ? `${itemColors.glow} shadow-lg` : hasProgress ? 'opacity-90' : 'opacity-60'}
                          ${achievement.unlocked || hasProgress ? 'hover:scale-105' : ''}
                        `}
                      >
                        {/* Icon */}
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`text-4xl ${achievement.unlocked ? '' : hasProgress ? 'grayscale-0 opacity-70' : 'grayscale opacity-30'}`}>
                            {achievement.unlocked ? achievement.icon : hasProgress ? achievement.icon : <Lock className="w-8 h-8 text-gray-600" />}
                          </div>
                          {achievement.unlocked && (
                            <div className="ml-auto">
                              <Trophy className={`w-4 h-4 ${itemColors.text}`} />
                            </div>
                          )}
                        </div>

                        {/* Text */}
                        <h4 className={`font-bold ${achievement.unlocked ? 'text-white' : hasProgress ? 'text-gray-300' : 'text-gray-600'}`}>
                          {achievement.name}
                        </h4>
                        <p className={`text-xs mt-1 ${achievement.unlocked ? 'text-gray-400' : hasProgress ? 'text-gray-500' : 'text-gray-700'}`}>
                          {achievement.description}
                        </p>

                        {/* Progress Bar */}
                        {!achievement.unlocked && progressData && progressData.target > 1 && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>{progressData.current}/{progressData.target}</span>
                              <span>{Math.floor(progressData.progress * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${itemColors.border.replace('border-', 'bg-')}`}
                                style={{ width: `${progressData.progress * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Unlock Date */}
                        {achievement.unlocked && achievement.unlockedAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
