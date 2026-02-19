'use client';

import { X } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export default function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-green-500/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-green-500/30 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-green-400">How to Play</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Goal */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">🎯 The Goal</h3>
            <p className="text-gray-300">
              Crack the target's password using OSINT (open source intelligence) from their Twitter profile,
              then log in and make a post.
            </p>
          </div>

          {/* What You Need */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-3">🛠️ What You Need</h3>
            <div className="bg-gray-800/50 border border-gray-700 rounded p-4 space-y-2">
              <p className="text-gray-300 font-medium">Option 1 (Easiest):</p>
              <p className="text-gray-400 text-sm ml-4">
                • No installation needed - use an online MD5 decoder
              </p>

              <p className="text-gray-300 font-medium mt-3">Option 2 (CLI Tools):</p>
              <p className="text-gray-400 text-sm ml-4">
                • Hashcat or John the Ripper (for offline cracking)
              </p>
              <p className="text-gray-400 text-sm ml-4">
                • Python or Node.js (for building wordlists)
              </p>
            </div>
          </div>

          {/* Step by Step */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-3">📋 Step-by-Step Guide</h3>
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="bg-gray-800/50 border border-gray-700 rounded p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Gather Information</h4>
                    <p className="text-gray-400 text-sm">
                      Look through their bio, location, and tweets. Find:
                    </p>
                    <ul className="text-gray-400 text-sm ml-4 mt-1 space-y-1">
                      <li>• Pet name (usually mentioned in tweets)</li>
                      <li>• Pet adoption year (look for dates like "got him in 2019")</li>
                      <li>• Their location or other personal details</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-gray-800/50 border border-gray-700 rounded p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Build Password Guesses</h4>
                    <p className="text-gray-400 text-sm">
                      Common patterns: <code className="bg-gray-900 px-2 py-0.5 rounded text-green-400">petname + year</code>
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Example: If pet is "Max" adopted in 2019 → try <code className="bg-gray-900 px-2 py-0.5 rounded text-green-400">max2019</code>
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-gray-800/50 border border-gray-700 rounded p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Crack the Hash</h4>
                    <p className="text-gray-400 text-sm mb-2">
                      Copy the MD5 hash shown on the profile page.
                    </p>
                    <p className="text-gray-400 text-sm font-medium">Quick Method:</p>
                    <p className="text-gray-400 text-sm ml-4">
                      Use an online MD5 cracker like <span className="text-green-400">crackstation.net</span> or <span className="text-green-400">md5decrypt.net</span>
                    </p>
                    <p className="text-gray-400 text-sm font-medium mt-2">CLI Method:</p>
                    <pre className="bg-gray-900 p-2 rounded text-xs text-green-400 mt-1 overflow-x-auto">
hashcat -m 0 -a 0 hash.txt wordlist.txt
                    </pre>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-gray-800/50 border border-gray-700 rounded p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Login & Post</h4>
                    <p className="text-gray-400 text-sm">
                      Click "Login", enter the username (without @) and cracked password,
                      then make any post to complete the round!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-3">💡 Example</h3>
            <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-3">
              <div>
                <p className="text-gray-400 text-sm font-medium">Profile Info:</p>
                <div className="bg-gray-900 p-3 rounded mt-1 text-sm">
                  <p className="text-gray-300"><span className="text-green-400">Bio:</span> Dog lover, coffee addict</p>
                  <p className="text-gray-300"><span className="text-green-400">Tweet:</span> "Luna had her checkup today. Can't believe it's been 3 years since I adopted her in 2021!"</p>
                  <p className="text-gray-300"><span className="text-green-400">Hash:</span> <code className="text-green-400">a1b2c3d4...</code></p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm font-medium">Your Analysis:</p>
                <div className="bg-gray-900 p-3 rounded mt-1 text-sm">
                  <p className="text-gray-300">• Pet name: <span className="text-green-400">Luna</span></p>
                  <p className="text-gray-300">• Adoption year: <span className="text-green-400">2021</span></p>
                  <p className="text-gray-300">• Password guess: <span className="text-green-400">luna2021</span></p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm font-medium">Result:</p>
                <div className="bg-green-900/20 border border-green-500/30 p-3 rounded mt-1">
                  <p className="text-green-400 text-sm">✓ Hash cracked! Password: luna2021</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-3">💡 Pro Tips</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>• Passwords are always lowercase</li>
              <li>• Look for tweets mentioning years or dates</li>
              <li>• Pet names are almost always in the tweets</li>
              <li>• Try variations: name+year, location+year, name+location</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-green-500/30 p-4">
          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Got it! Let's Play
          </button>
        </div>
      </div>
    </div>
  );
}
