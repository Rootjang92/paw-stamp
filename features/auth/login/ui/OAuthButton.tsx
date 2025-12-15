'use client';

import { useState } from 'react';
import { signInWithOAuth, type AuthProvider } from '../api';

interface OAuthButtonProps {
  provider: AuthProvider;
  className?: string;
  children: React.ReactNode;
}

/**
 * OAuth 로그인 버튼 컴포넌트
 * 클라이언트 컴포넌트로 서버 액션을 호출
 */
export function OAuthButton({ provider, className, children }: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithOAuth(provider);
    } catch (error) {
      console.error(`${provider} 로그인 에러:`, error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={className}
    >
      {children}
    </button>
  );
}
