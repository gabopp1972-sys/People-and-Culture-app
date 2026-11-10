export type AuthProvider = 'google';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: AuthProvider;
  accessToken?: string;
  expiresAt?: number;
}

