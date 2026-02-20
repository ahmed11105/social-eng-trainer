'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SoundSettings {
  volume: number; // 0-1
  muted: boolean;
}

interface SoundContextType {
  settings: SoundSettings;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const STORAGE_KEY = 'soundSettings';

export function SoundProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SoundSettings>({
    volume: 0.5, // Default 50%
    muted: false,
  });

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (error) {
        // Use defaults if parsing fails
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings]);

  const setVolume = (volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    setSettings(prev => ({ ...prev, volume: clamped }));
  };

  const toggleMute = () => {
    setSettings(prev => ({ ...prev, muted: !prev.muted }));
  };

  return (
    <SoundContext.Provider
      value={{
        settings,
        setVolume,
        toggleMute,
        isMuted: settings.muted,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundSettings() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundSettings must be used within SoundProvider');
  }
  return context;
}
