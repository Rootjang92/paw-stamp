'use client';

import { OAuthButton } from './OAuthButton';

interface KakaoLoginButtonProps {
  isLoading?: boolean;
}

export function KakaoLoginButton({ isLoading = false }: KakaoLoginButtonProps) {
  return (
    <OAuthButton
      provider="kakao"
      className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-[#FEE500] hover:bg-[#FDD835] rounded-xl font-medium text-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7L5.5 21l4.1-2.5c.8.1 1.6.2 2.4.2 5.5 0 10-3.6 10-8S17.5 3 12 3z"
          />
        </svg>
      )}
      <span>카카오로 계속하기</span>
    </OAuthButton>
  );
}
