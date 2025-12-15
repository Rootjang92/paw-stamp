import { LogoutButton } from '@/features/auth/logout';

interface HeaderProps {
  title: string;
  showLogout?: boolean;
}

/**
 * 공통 헤더 컴포넌트
 * 페이지 제목과 로그아웃 버튼을 포함
 */
export function Header({ title, showLogout = true }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      {showLogout && <LogoutButton />}
    </header>
  );
}
