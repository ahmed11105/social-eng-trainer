'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import LoginForm from '@/components/LoginForm';
import ProgressTracker from '@/components/ProgressTracker';
import { useGame } from '@/contexts/GameContext';
import { isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const { hashCopied, hasPosted } = useGame();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Subtle circuit board pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(90deg, #10b981 1px, transparent 1px),
              linear-gradient(180deg, #10b981 1px, transparent 1px),
              radial-gradient(circle at 20% 30%, #3b82f6 2px, transparent 2px),
              radial-gradient(circle at 80% 60%, #3b82f6 2px, transparent 2px),
              radial-gradient(circle at 40% 80%, #10b981 2px, transparent 2px),
              radial-gradient(circle at 60% 20%, #10b981 2px, transparent 2px)
            `,
            backgroundSize: '40px 40px, 40px 40px, 100px 100px, 120px 120px, 80px 80px, 90px 90px',
            backgroundPosition: '0 0, 0 0, 0 0, 0 0, 0 0, 0 0'
          }}
        />

        <div className="border-b border-gray-800 p-4 backdrop-blur bg-black/80 sticky top-0 z-10">
          <h2 className="text-xl font-bold">Login - OSINT Challenge</h2>
        </div>

        <LoginForm />
      </main>

      {/* Progress Tracker - Fixed on right side */}
      <div className="hidden lg:block w-80 p-4">
        <div className="sticky top-4">
          <ProgressTracker
            hashCopied={hashCopied}
            isLoggedIn={isLoggedIn}
            hasPosted={hasPosted}
          />
        </div>
      </div>
    </div>
  );
}
