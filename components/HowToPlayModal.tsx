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

              {/* Installation - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* macOS/Linux Installation */}
                <div className="bg-gray-900 p-3 rounded">
                  <p className="text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    macOS /
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.835-.41 1.6-.41 2.311 0 1.279.678 2.362 1.697 3.005.675.427 1.525.687 2.452.687.181 0 .359-.01.536-.03.722-.082 1.364-.472 1.944-.902.58-.43 1.127-.902 1.697-.902.57 0 1.117.472 1.697.902.58.43 1.222.82 1.944.902.177.02.355.03.536.03.927 0 1.777-.26 2.452-.687 1.019-.643 1.697-1.726 1.697-3.005 0-.711-.132-1.476-.41-2.311-.589-1.771-1.831-3.47-2.716-4.521-.75-1.067-.974-1.928-1.05-3.02-.065-1.491 1.056-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021zm-.134 2.938c1.71 0 2.597 1.522 2.597 3.063 0 1.541-.887 3.063-2.597 3.063s-2.597-1.522-2.597-3.063c0-1.541.887-3.063 2.597-3.063z"/>
                    </svg>
                    Linux
                  </p>
                  <pre className="text-green-400 text-xs overflow-x-auto">brew install hashcat</pre>
                </div>

                {/* Windows Installation */}
                <div className="bg-gray-900 p-3 rounded">
                  <p className="text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                    </svg>
                    Windows
                  </p>
                  <p className="text-gray-400 text-xs">Download from <a href="https://hashcat.net/hashcat/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">hashcat.net/hashcat</a></p>
                </div>
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
                <p className="text-white font-semibold mb-3">Step 2: Create wordlist.txt 📝</p>

                {/* Side by side options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A */}
                  <div className="bg-gray-900 p-3 rounded border border-gray-700">
                    <p className="text-green-400 text-sm font-semibold mb-1">Option A: Manual Guesses</p>
                    <p className="text-gray-400 text-xs mb-2">Make manual password guesses for hashcat to try</p>
                    <pre className="bg-black/50 p-2 rounded text-green-400 text-xs whitespace-pre-wrap break-words">{`cat > wordlist.txt << EOF
luna2019
luna2021
luna2022
seattle2019
seattle2021
lunaseattle
seattleluna
EOF`}</pre>
                  </div>

                  {/* Option B */}
                  <div className="bg-gray-900 p-3 rounded border border-gray-700">
                    <p className="text-green-400 text-sm font-semibold mb-1">Option B: Auto-Combine</p>
                    <p className="text-gray-400 text-xs mb-2">Hashcat combines all words with all numbers</p>
                    <pre className="bg-black/50 p-2 rounded text-green-400 text-xs whitespace-pre-wrap break-words">{`cat > words.txt << EOF
luna
seattle
EOF

cat > numbers.txt << EOF
2019
2020
2021
2022
EOF`}</pre>
                  </div>
                </div>
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
                <p className="text-white font-semibold mb-3">Step 4: Run Hashcat ⚡</p>

                {/* Side by side options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A */}
                  <div className="bg-gray-900 p-3 rounded border border-gray-700">
                    <p className="text-green-400 text-sm font-semibold mb-1">Option A: Straight Attack</p>
                    <p className="text-gray-400 text-xs mb-2">Tries each line as-is</p>
                    <div className="relative">
                      <pre className="bg-black/50 p-2 rounded text-green-400 text-xs overflow-x-auto">{`hashcat -m 0 -a 0 hash.txt wordlist.txt`}</pre>
                      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-black/50 to-transparent pointer-events-none rounded-r"></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      <p>• <code className="text-green-400">-a 0</code> = Dictionary mode</p>
                    </div>
                  </div>

                  {/* Option B */}
                  <div className="bg-gray-900 p-3 rounded border border-gray-700">
                    <p className="text-green-400 text-sm font-semibold mb-1">Option B: Combinator Attack</p>
                    <p className="text-gray-400 text-xs mb-2">Auto-combines word+number</p>
                    <div className="relative">
                      <pre className="bg-black/50 p-2 rounded text-green-400 text-xs overflow-x-auto">{`hashcat -m 0 -a 1 hash.txt words.txt numbers.txt`}</pre>
                      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-black/50 to-transparent pointer-events-none rounded-r"></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      <p>• <code className="text-green-400">-a 1</code> = Combinator mode</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-400 bg-gray-800 p-2 rounded">
                  <p>• <code className="text-green-400">-m 0</code> = MD5 hash type</p>
                  <p>• <code className="text-green-400">hash.txt</code> = Your hash file</p>
                </div>
              </div>

              {/* Step 5: View Results */}
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-white font-semibold mb-2">Step 5: Check Results & Iterate 🔄</p>
                <p className="text-gray-400 text-sm mb-2">First attempt - no match found:</p>
                <pre className="bg-gray-900 p-3 rounded text-red-400 text-xs overflow-x-auto">
Exhausted
Status: Not cracked</pre>
                <p className="text-gray-400 text-sm mt-3 mb-3"><em>Think again! Adoption year was 2020.</em></p>

                {/* Side by side options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A */}
                  <div className="bg-gray-900 p-3 rounded border border-gray-700">
                    <p className="text-green-400 text-sm font-semibold mb-1">Option A: Manual Fix</p>
                    <p className="text-gray-400 text-xs mb-2">Add the missing combination</p>
                    <pre className="bg-black/50 p-2 rounded text-green-400 text-xs overflow-x-auto whitespace-pre">{`echo "luna2020" >> wordlist.txt
hashcat -m 0 -a 0 hash.txt wordlist.txt`}</pre>
                  </div>

                  {/* Option B */}
                  <div className="bg-gray-900 p-3 rounded border border-gray-700">
                    <p className="text-green-400 text-sm font-semibold mb-1">Option B: Auto-Fix</p>
                    <p className="text-gray-400 text-xs mb-2">Add 2020 to auto-combine</p>
                    <pre className="bg-black/50 p-2 rounded text-green-400 text-xs overflow-x-auto whitespace-pre">{`echo "2020" >> numbers.txt
hashcat -m 0 -a 1 hash.txt words.txt numbers.txt`}</pre>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mt-4 mb-2">Result:</p>
                <pre className="bg-gray-900 p-3 rounded text-green-400 text-xs overflow-x-auto">
b59c67bf196a4758191e42f76670ceba:luna2020
Status: Cracked</pre>
                <p className="text-green-400 text-sm mt-2 font-semibold">✓ Password found: luna2020</p>
                <p className="text-gray-400 text-xs mt-2">💡 Combinator mode (-a 1) automatically tries all combinations!</p>
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
