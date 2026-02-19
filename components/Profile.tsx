'use client';

import { Profile as ProfileType } from '@/types';

interface ProfileProps {
  profile: ProfileType;
  isAuthenticated: boolean;
  onLogout?: () => void;
}

export default function Profile({ profile, isAuthenticated, onLogout }: ProfileProps) {
  return (
    <div>
      {/* Cover Photo */}
      <div className="h-48 bg-gray-800 relative overflow-hidden">
        <img
          src={profile.coverUrl}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start mb-4">
          {/* Avatar - positioned to overlap cover */}
          <div className="w-32 h-32 -mt-16 rounded-full border-4 border-black overflow-hidden bg-gray-700 relative z-10">
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Action Button - positioned below cover */}
          <div className="mt-3">
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="px-4 py-2 border border-gray-600 rounded-full hover:bg-gray-900 transition-colors font-bold"
              >
                Logout
              </button>
            ) : (
              <button className="px-4 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
                Follow
              </button>
            )}
          </div>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold" data-testid="profile-display-name">{profile.displayName}</h1>
          <p className="text-gray-500" data-testid="profile-username">@{profile.username}</p>
        </div>

        <p className="mt-3" data-testid="profile-bio">{profile.bio}</p>
        
        <div className="flex gap-4 mt-3 text-gray-500">
          <span>📍 {profile.location}</span>
          <span>🔗 {profile.website}</span>
          <span>📅 Joined {profile.joinedDate}</span>
        </div>
        
        <div className="flex gap-4 mt-3">
          <span><strong>{profile.following}</strong> <span className="text-gray-500">Following</span></span>
          <span><strong>{profile.followers}</strong> <span className="text-gray-500">Followers</span></span>
        </div>
      </div>
    </div>
  );
}
