'use client';

import { useState } from 'react';
import { signOut } from '../../login/api';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

/**
 * 로그아웃 버튼 컴포넌트
 * 클라이언트 컴포넌트로 서버 액션을 호출
 */
export function LogoutButton({
  className = "flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors",
  children,
  showIcon = true,
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('로그아웃 에러:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        showIcon && <LogOut className="w-4 h-4" />
      )}
      {children || '로그아웃'}
    </button>
  );
}
