'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lock, Lightbulb } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen sticky top-0 p-4 border-r border-gray-800">
      <div className="text-2xl font-bold mb-8 text-green-400">OSINT Trainer</div>

      <nav className="space-y-2">
        <Link href="/" className={`flex items-center gap-4 p-3 rounded-full text-xl hover:bg-gray-900 ${pathname === '/' ? 'font-bold' : ''}`}>
          <Home className="w-6 h-6" />
          <span>Home</span>
        </Link>

        <Link href="/login" className={`flex items-center gap-4 p-3 rounded-full text-xl hover:bg-gray-900 ${pathname === '/login' ? 'font-bold' : ''}`}>
          <Lock className="w-6 h-6" />
          <span>Login</span>
        </Link>
      </nav>

      {/* Quick Tips - Clean & Minimal */}
      <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-semibold text-gray-200">Password Clues</h3>
        </div>

        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">•</span>
            <span>Pet names</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">•</span>
            <span>Birth years & dates</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">•</span>
            <span>Locations & places</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">•</span>
            <span>Words + numbers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
