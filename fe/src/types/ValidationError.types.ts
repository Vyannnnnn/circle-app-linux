export type ValidationErrors = {
  username?: string;
  full_Name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  [key: string]: string | undefined;
};
