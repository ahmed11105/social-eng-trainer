export interface Tweet {
  id: number;
  text: string;
  date: string;
  likes: number;
  retweets: number;
  replies?: number;
  media?: string;
}

export interface Profile {
  username: string;
  displayName: string;
  bio: string;
  location: string;
  website: string;
  joinedDate: string;
  following: number;
  followers: number;
  avatarUrl: string;
  coverUrl: string;
}

export interface User {
  username: string;
  passwordHash: string;
}
