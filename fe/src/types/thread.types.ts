export interface Thread {
  id: number;
  content: string;
  createdAt: string;
  image?: string;
  like: number;
  replies: number;
  isLiked: boolean;
  user: ThreadUser;
}

export interface ThreadUser {
  id: number;
  username: string;
  full_Name: string;
  photo_profile: string;
}
