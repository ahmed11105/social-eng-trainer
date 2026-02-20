'use client';

import { Tweet as TweetType, Profile } from '@/types';
import { MessageCircle, Repeat2, Heart, Trash2 } from 'lucide-react';

interface TweetProps extends TweetType {
  onDelete?: () => void;
  profile: Profile;
}

// Parse tweet text to make @mentions blue
function parseTextWithMentions(text: string) {
  const parts = text.split(/(@\w+)/g);

  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      return (
        <span key={index} className="text-blue-400 hover:underline cursor-pointer">
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function Tweet({ text, date, likes, retweets, replies = 0, media, onDelete, profile }: TweetProps) {
  return (
    <div className="border-b border-gray-800 p-4 hover:bg-gray-900 transition">
      <div className="flex gap-3">
        <div className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0 overflow-hidden">
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold">{profile.displayName}</span>
            <span className="text-gray-500">@{profile.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{date}</span>
          </div>
          <p className="mt-2 text-white" data-testid="tweet-text">{parseTextWithMentions(text)}</p>
          {media && (
            <div className="mt-3 rounded-2xl overflow-hidden bg-gray-800 border border-gray-700">
              <img
                src={media}
                alt="Tweet media"
                className="w-full object-cover max-h-96"
              />
            </div>
          )}
          <div className="flex gap-16 mt-3 text-gray-500 text-sm">
            <button className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
              <span className="group-hover:bg-blue-400/10 p-2 rounded-full transition-colors">
                <MessageCircle className="w-4 h-4" />
              </span>
              <span>{replies}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-400 transition-colors group">
              <span className="group-hover:bg-green-400/10 p-2 rounded-full transition-colors">
                <Repeat2 className="w-4 h-4" />
              </span>
              <span>{retweets}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-red-400 transition-colors group">
              <span className="group-hover:bg-red-400/10 p-2 rounded-full transition-colors">
                <Heart className="w-4 h-4" />
              </span>
              <span>{likes}</span>
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center gap-2 hover:text-red-500 ml-auto transition-colors group"
              >
                <span className="group-hover:bg-red-500/10 p-2 rounded-full transition-colors">
                  <Trash2 className="w-4 h-4" />
                </span>
                <span className="text-xs">Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
