export interface Post {
  id: number;
  name: string;
  handle: string;
  verified?: boolean;
  avatarBg: string;
  avatarColor: string;
  initials: string;
  time: string;
  text: string;
  replies: string;
  retweets: string;
  likes: string;
  views: string;
  liked?: boolean;
  hasImage?: boolean;
}