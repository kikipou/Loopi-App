export interface User {
  id?: string;
  name?: string;
  username?: string;
  email: string;
  phone?: number;
  password?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}
