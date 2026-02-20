'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';

interface HashBannerProps {
  hash: string;
  difficulty: string;
}

export default function HashBanner({ hash, difficulty }: HashBannerProps) {
  const [copied, setCopied] = useState(false);
  const { setHashCopied } = useGame();

  // Detect manual copying (highlight + copy) of the hash
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      const copiedText = selection?.toString().trim();

      // Check if the copied text matches the hash
      if (copiedText === hash) {
        setCopied(true);
        setHashCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, [hash, setHashCopied]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setHashCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-900/30 border-green-700';
      case 'medium':
        return 'bg-yellow-900/30 border-yellow-700';
      case 'hard':
        return 'bg-red-900/30 border-red-700';
      default:
        return 'bg-blue-900/30 border-blue-700';
    }
  };

  return (
    <div className={`border-b ${getDifficultyColor()} border-t-2 p-4`}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                🎯 Target MD5 Hash
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {difficulty.toUpperCase()}
              </span>
            </div>
            <code className="text-sm sm:text-base text-green-400 font-mono break-all select-all">
              {hash}
            </code>
          </div>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {copied ? (
              <>
                <span>✓</span>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Copy Hash</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Analyze the profile below to find clues, build a wordlist, and crack this hash using hashcat
        </p>
      </div>
    </div>
  );
}
