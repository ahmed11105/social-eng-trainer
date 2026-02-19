import { Profile, Tweet, User } from '@/types';

// OSINT Challenge: Analyze this profile to discover the password!
// Look for clues in bio, tweets, dates, names, locations, interests...

export const TARGET_USER: User = {
  username: 'marcus_shoots',
  passwordHash: '95fe776b4506f1b504c5514d8fb2c3b0', // MD5 hash - crack this!
};

export const PROFILE_DATA: Profile = {
  username: 'marcus_shoots',
  displayName: 'Marcus Rivera',
  bio: '📸 Miami-based photographer | Dog dad to the best boy | Capturing moments since 2010',
  location: 'Miami, FL',
  website: 'marcusrivera.photo',
  joinedDate: 'March 2015',
  following: 342,
  followers: 1847,
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
  coverUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1500&h=500&fit=crop',
};

export const INITIAL_TWEETS: Tweet[] = [
  {
    id: 1,
    text: "Can't believe it's been 10 years since I adopted Atlas! Best decision I ever made 🐕💙 #AdoptDontShop",
    date: '2025-02-15',
    likes: 234,
    retweets: 12,
    replies: 34,
  },
  {
    id: 2,
    text: 'New photo series dropping soon! Shot some amazing sunset views from South Beach 🌅',
    date: '2025-02-10',
    likes: 456,
    retweets: 23,
    replies: 18,
    media: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    text: 'Atlas and I exploring Everglades today. This dog has more energy than me 😅',
    date: '2025-02-08',
    likes: 189,
    retweets: 8,
    replies: 12,
    media: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    text: "Throwback to when I first started photography in 2010. Can't believe how far I've come!",
    date: '2025-02-05',
    likes: 567,
    retweets: 34,
    replies: 45,
  },
  {
    id: 5,
    text: 'Atlas giving me those puppy eyes again. How can I say no to this face? 🥺',
    date: '2025-02-01',
    likes: 892,
    retweets: 45,
    replies: 67,
    media: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop',
  },
  {
    id: 6,
    text: 'Miami sunsets hit different. Been living here my whole life and still not tired of this view',
    date: '2025-01-28',
    likes: 334,
    retweets: 19,
    replies: 23,
    media: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&h=600&fit=crop',
  },
  {
    id: 7,
    text: 'Atlas turned 10 years old today! My loyal companion through thick and thin 🎂🐕',
    date: '2025-01-20',
    likes: 678,
    retweets: 41,
    replies: 89,
  },
  {
    id: 8,
    text: 'Fun fact: I got Atlas the same year I created this account. Both been with me since 2015!',
    date: '2025-01-15',
    likes: 445,
    retweets: 28,
    replies: 37,
  },
];

// Helper to get tweets (initially just the default ones)
export function getInitialTweets(): Tweet[] {
  return [...INITIAL_TWEETS];
}
