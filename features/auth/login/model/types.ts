export type AuthProvider = 'google' | 'kakao';

export interface AuthError {
  error: string;
}

export interface LoginState {
  isLoading: boolean;
  provider: AuthProvider | null;
}
