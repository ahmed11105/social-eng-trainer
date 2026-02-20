'use client';

import { useState } from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { useSoundSettings } from '@/contexts/SoundContext';
import { playSound, updateSoundSettings } from '@/lib/sounds';

export default function SoundSettings() {
  const { settings, setVolume, toggleMute, isMuted } = useSoundSettings();
  const [isOpen, setIsOpen] = useState(false);

  // Update global sound settings whenever they change
  updateSoundSettings(settings.volume, settings.muted);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    updateSoundSettings(newVolume, settings.muted);

    // Play test sound
    if (!settings.muted && newVolume > 0) {
      playSound('click');
    }
  };

  const handleToggleMute = () => {
    toggleMute();
    const newMuted = !settings.muted;
    updateSoundSettings(settings.volume, newMuted);

    // Play test sound when unmuting
    if (!newMuted) {
      setTimeout(() => playSound('click'), 100);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl min-w-[250px] animate-scale-in">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-400" />
            Sound Settings
          </h3>

          {/* Mute Toggle */}
          <button
            onClick={handleToggleMute}
            onMouseEnter={() => !isMuted && playSound('hover')}
            className={`w-full p-3 rounded-lg mb-3 flex items-center justify-between transition-all ${
              isMuted
                ? 'bg-red-900/30 border border-red-700 text-red-400'
                : 'bg-green-900/30 border border-green-700 text-green-400'
            }`}
          >
            <span className="flex items-center gap-2">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              <span className="font-medium">{isMuted ? 'Muted' : 'Unmuted'}</span>
            </span>
            <span className="text-xs">Click to toggle</span>
          </button>

          {/* Volume Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Volume</span>
              <span className="font-mono">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={handleVolumeChange}
              disabled={isMuted}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-4
                         [&::-webkit-slider-thumb]:h-4
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-gradient-to-r
                         [&::-webkit-slider-thumb]:from-green-500
                         [&::-webkit-slider-thumb]:to-blue-500
                         [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:hover:scale-110
                         [&::-webkit-slider-thumb]:transition-transform"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Settings are saved automatically
          </p>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isMuted) playSound('click');
        }}
        onMouseEnter={() => !isMuted && playSound('hover')}
        className={`
          p-3 rounded-full transition-all shadow-lg
          ${isOpen
            ? 'bg-blue-600 border-2 border-blue-400 scale-110'
            : 'bg-gray-800 border-2 border-gray-600 hover:bg-gray-700 hover:scale-110'
          }
          active:scale-95
        `}
        title="Sound Settings"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-red-400" />
        ) : (
          <Volume2 className="w-5 h-5 text-green-400" />
        )}
      </button>
    </div>
  );
}
