'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lock, Lightbulb, PawPrint, Calendar, MapPin, Hash } from 'lucide-react';

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

      {/* Quick Tips - Redesigned */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3 px-3">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <h3 className="text-sm font-bold text-gray-300">Quick Tips</h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
            <PawPrint className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="text-xs text-gray-300">Look for pet names</span>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-xs text-gray-300">Check birth years & dates</span>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-green-900/20 to-teal-900/20 border border-green-500/20 hover:border-green-500/40 transition-colors">
            <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-xs text-gray-300">Note locations & places</span>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
            <Hash className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <span className="text-xs text-gray-300">Combine words + numbers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
