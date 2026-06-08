export interface Replie {
  id: number;
  content: string;
  image: string | null;
  createdAt: string;
  user: {
    id: number;
    username: string;
    full_Name: string;
    photo_profile: string | null;
  };
}