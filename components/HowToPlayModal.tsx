'use client';

import { X } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export default function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-green-500/30 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-green-500/30 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-green-400">How to Play: Dictionary Attack Training</h2>
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
              Learn to perform a <strong>dictionary attack</strong> by gathering OSINT (open source intelligence) from a Twitter profile,
              building a custom wordlist, and using command-line tools to crack MD5 hashes.
            </p>
          </div>

          {/* What You Need */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-3">🛠️ What You Need</h3>
            <div className="bg-gray-800/50 border border-gray-700 rounded p-4 space-y-3">
              <div>
                <p className="text-gray-300 font-medium">Required Tools:</p>
                <ul className="text-gray-400 text-sm ml-4 mt-2 space-y-1">
                  <li>• <strong className="text-green-400">Hashcat</strong> (password cracking tool)</li>
                  <li>• A terminal or command prompt</li>
                  <li>• A text editor to create wordlists</li>
                </ul>
              </div>

              {/* macOS/Linux Installation */}
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <span>🍎</span> macOS / <span>🐧</span> Linux
                </p>
                <pre className="text-green-400 text-xs overflow-x-auto">brew install hashcat</pre>
              </div>

              {/* Windows Installation */}
              <div className="bg-gray-900 p-3 rounded">
                <p className="text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <span>🪟</span> Windows
                </p>
                <p className="text-gray-400 text-xs">Download from <a href="https://hashcat.net/hashcat/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">hashcat.net/hashcat</a></p>
              </div>
            </div>
          </div>

          {/* Complete Example Walkthrough */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-3">💡 Complete Example Walkthrough</h3>
            <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-4">

              {/* Example Profile */}
              <div>
                <p className="text-gray-400 text-sm font-semibold mb-2">📋 Example Profile:</p>
                <div className="bg-gray-900 p-3 rounded text-sm space-y-1">
                  <p className="text-gray-300"><span className="text-green-400">Username:</span> @sarah_jones</p>
                  <p className="text-gray-300"><span className="text-green-400">Bio:</span> Seattle dog mom 🐕 | Coffee enthusiast</p>
                  <p className="text-gray-300"><span className="text-green-400">Tweet 1:</span> "Luna's 4th birthday today! 🎉"</p>
                  <p className="text-gray-300"><span className="text-green-400">Tweet 2:</span> "Adopted this little troublemaker back in 2020. Best decision ever!"</p>
                  <p className="text-gray-300"><span className="text-green-400">MD5 Hash:</span> <code className="text-yellow-400">b59c67bf196a4758191e42f76670ceba</code></p>
                </div>
              </div>

              {/* Step 1: Gather Intel */}
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-white font-semibold mb-2">Step 1: Gather Intel 🔍</p>
                <p className="text-gray-400 text-sm mb-2">From the profile, we found:</p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Pet name: <strong className="text-green-400">Luna</strong></li>
                  <li>• Adoption year: <strong className="text-green-400">2020</strong></li>
                  <li>• Location: <strong className="text-green-400">Seattle</strong></li>
                </ul>
              </div>

              {/* Step 2: Build Wordlist */}
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-white font-semibold mb-2">Step 2: Create wordlist.txt 📝</p>
                <p className="text-gray-400 text-sm mb-2">Create a file with password guesses (one per line):</p>
                <pre className="bg-gray-900 p-3 rounded text-green-400 text-xs overflow-x-auto">
cat &gt; wordlist.txt &lt;&lt;EOF
luna2019
luna2021
luna2022
seattle2019
seattle2021
lunaseattle
seattleluna
luna
EOF</pre>
                <p className="text-gray-400 text-xs mt-2">💡 Build variations - the actual password might not be your first guess!</p>
                <p className="text-gray-400 text-xs mt-1">Common patterns: name+year, location+year, year variations (±1-2 years)</p>
              </div>

              {/* Step 3: Save the Hash */}
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-white font-semibold mb-2">Step 3: Save the Hash 💾</p>
                <p className="text-gray-400 text-sm mb-2">Copy the MD5 hash to a file:</p>
                <pre className="bg-gray-900 p-3 rounded text-green-400 text-xs overflow-x-auto">
echo "b59c67bf196a4758191e42f76670ceba" &gt; hash.txt</pre>
              </div>

              {/* Step 4: Run Hashcat */}
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-white font-semibold mb-2">Step 4: Run Hashcat ⚡</p>
                <p className="text-gray-400 text-sm mb-2">Launch the dictionary attack:</p>
                <pre className="bg-gray-900 p-3 rounded text-green-400 text-xs overflow-x-auto">
hashcat -m 0 -a 0 hash.txt wordlist.txt</pre>
                <div className="mt-2 text-xs text-gray-400">
                  <p>• <code className="text-green-400">-m 0</code> = MD5 mode</p>
                  <p>• <code className="text-green-400">-a 0</code> = Dictionary attack</p>
                  <p>• <code className="text-green-400">hash.txt</code> = Your hash file</p>
                  <p>• <code className="text-green-400">wordlist.txt</code> = Your wordlist</p>
                </div>
              </div>

              {/* Step 5: View Results */}
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-white font-semibold mb-2">Step 5: Check Results & Iterate 🔄</p>
                <p className="text-gray-400 text-sm mb-2">First attempt - no match found:</p>
                <pre className="bg-gray-900 p-3 rounded text-red-400 text-xs overflow-x-auto">
Exhausted
Status: Not cracked</pre>
                <p className="text-gray-400 text-sm mt-3 mb-2">Think again! Adoption year was 2020. Add it to wordlist:</p>
                <pre className="bg-gray-900 p-3 rounded text-green-400 text-xs overflow-x-auto">
echo "luna2020" &gt;&gt; wordlist.txt</pre>
                <p className="text-gray-400 text-sm mt-2 mb-2">Run hashcat again:</p>
                <pre className="bg-gray-900 p-3 rounded text-green-400 text-xs overflow-x-auto">
hashcat -m 0 -a 0 hash.txt wordlist.txt

b59c67bf196a4758191e42f76670ceba:luna2020
Status: Cracked</pre>
                <p className="text-green-400 text-sm mt-2 font-semibold">✓ Password found: luna2020</p>
                <p className="text-gray-400 text-xs mt-2">💡 Dictionary attacks often require iteration and refinement!</p>
              </div>

              {/* Step 6: Login */}
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-white font-semibold mb-2">Step 6: Login & Complete 🎯</p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Click the <strong className="text-green-400">Login</strong> button</li>
                  <li>• Username: <code className="text-green-400">sarah_jones</code> (no @)</li>
                  <li>• Password: <code className="text-green-400">luna2020</code></li>
                  <li>• Make a post to complete the round!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-3">💡 Pro Tips</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>• <strong>Passwords are always lowercase</strong> - convert everything to lowercase in your wordlist</li>
              <li>• Read all tweets carefully - years and names are hidden in casual mentions</li>
              <li>• Common patterns: petname+year, petname+location, firstname+year</li>
              <li>• Build a robust wordlist with 20-30 guesses for each profile</li>
              <li>• Use variations: try the year before and after the adoption year</li>
            </ul>
          </div>

          {/* Alternative: Quick Method */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
            <p className="text-yellow-400 font-semibold mb-2">🚀 Quick Method (Less Learning)</p>
            <p className="text-gray-400 text-sm">
              If you don't want to set up Hashcat, you can use online MD5 crackers like crackstation.net,
              but you'll miss out on learning dictionary attack fundamentals!
            </p>
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
