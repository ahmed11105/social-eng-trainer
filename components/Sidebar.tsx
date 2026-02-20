'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lock, Search } from 'lucide-react';

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

      <div className="mt-8 p-4 bg-gray-900 rounded-2xl">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Search className="w-5 h-5 text-green-400" />
          OSINT Challenge
        </h3>
        <p className="text-sm text-gray-400">
          Analyze this profile to find clues. Crack the password hash using what you learned!
        </p>
      </div>
    </div>
  );
}
