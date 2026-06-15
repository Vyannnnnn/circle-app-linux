export interface RegisterForm {
  username: string;
  full_Name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type LoginFormData = {
  email: string;
  password: string;
};

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  photo_profile: string;
  full_Name: string;
  bio: string;
  followersCount: number;
  followingCount: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  follows: User[];
  suggestions: User[];

  viewedProfile: User | null;

  searchResults: User[];
}