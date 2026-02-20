'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lock } from 'lucide-react';

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

      {/* Quick Tips */}
      <div className="mt-8 p-4 bg-gray-900 rounded-2xl">
        <h3 className="font-bold mb-2">Quick Tips 💡</h3>
        <ul className="text-sm space-y-1 text-gray-400">
          <li>• Look for pet names</li>
          <li>• Check birth years and dates</li>
          <li>• Note adoption years</li>
          <li>• Combine words + numbers</li>
        </ul>
      </div>
    </div>
  );
}
