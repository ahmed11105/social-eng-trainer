'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

interface ParticleEffectProps {
  trigger: boolean;
  color?: 'green' | 'blue' | 'purple' | 'yellow' | 'multi';
  count?: number;
  onComplete?: () => void;
}

const COLOR_PALETTES = {
  green: ['#10b981', '#34d399', '#6ee7b7'],
  blue: ['#3b82f6', '#60a5fa', '#93c5fd'],
  purple: ['#a855f7', '#c084fc', '#e9d5ff'],
  yellow: ['#f59e0b', '#fbbf24', '#fcd34d'],
  multi: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7'],
};

export default function ParticleEffect({ trigger, color = 'multi', count = 25, onComplete }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const palette = COLOR_PALETTES[color];
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 40, // Center with spread
        y: 50 + (Math.random() - 0.5) * 40,
        color: palette[Math.floor(Math.random() * palette.length)],
        size: 4 + Math.random() * 8,
        duration: 0.8 + Math.random() * 0.6,
        delay: Math.random() * 0.2,
      });
    }

    setParticles(newParticles);

    // Clear particles after animation
    const timeout = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [trigger, color, count, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 150;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        return (
          <div
            key={particle.id}
            className="absolute animate-particle-burst"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              borderRadius: '50%',
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
