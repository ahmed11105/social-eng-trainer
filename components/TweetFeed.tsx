'use client';

import { useState, useEffect } from 'react';
import { Image, BarChart3, Smile } from 'lucide-react';
import Tweet from './Tweet';
import { Tweet as TweetType, Profile } from '@/types';

interface TweetFeedProps {
  initialTweets: TweetType[];
  isAuthenticated: boolean;
  onFirstPost?: () => void;
  profile: Profile;
}

export default function TweetFeed({ initialTweets, isAuthenticated, onFirstPost, profile }: TweetFeedProps) {
  const [tweets, setTweets] = useState<TweetType[]>(initialTweets);
  const [newTweetText, setNewTweetText] = useState('');
  const [hasAddedTweet, setHasAddedTweet] = useState(false);

  // Update tweets when initialTweets changes (new profile loaded)
  useEffect(() => {
    setTweets(initialTweets);
    setHasAddedTweet(false);
  }, [initialTweets]);

  const addTweet = () => {
    if (!newTweetText.trim()) return;

    const newTweet: TweetType = {
      id: Date.now(),
      text: newTweetText,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      retweets: 0,
    };

    setTweets([newTweet, ...tweets]);
    setNewTweetText('');

    // Trigger onFirstPost callback if this is the first post added
    if (!hasAddedTweet && onFirstPost) {
      setHasAddedTweet(true);
      onFirstPost();
    }
  };

  const deleteTweet = (id: number) => {
    setTweets(tweets.filter(t => t.id !== id));
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button className="flex-1 py-4 hover:bg-gray-900 font-bold border-b-4 border-blue-500 transition-colors">
          Posts
        </button>
        <button className="flex-1 py-4 hover:bg-gray-900 text-gray-500 hover:text-gray-300 transition-colors">
          Replies
        </button>
        <button className="flex-1 py-4 hover:bg-gray-900 text-gray-500 hover:text-gray-300 transition-colors">
          Media
        </button>
        <button className="flex-1 py-4 hover:bg-gray-900 text-gray-500 hover:text-gray-300 transition-colors">
          Likes
        </button>
      </div>

      {/* Add Tweet (authenticated only) */}
      {isAuthenticated && (
        <div className="border-b border-gray-800 p-4">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0 overflow-hidden">
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <textarea
                value={newTweetText}
                onChange={(e) => setNewTweetText(e.target.value)}
                placeholder="What's happening?"
                className="w-full bg-transparent text-xl outline-none resize-none placeholder-gray-500"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-800">
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-blue-400/10 rounded-full text-blue-400 transition-colors">
                    <Image className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-blue-400/10 rounded-full text-blue-400 transition-colors">
                    <BarChart3 className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-blue-400/10 rounded-full text-blue-400 transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={addTweet}
                  disabled={!newTweetText.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tweet List */}
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            {...tweet}
            profile={profile}
            onDelete={isAuthenticated ? () => deleteTweet(tweet.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
