'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/shared/api/supabase/server';
import { headers } from 'next/headers';

export type AuthProvider = 'google' | 'kakao';

/**
 * OAuth 로그인을 처리하는 서버 액션
 * @param provider - OAuth 제공자 ('google' | 'kakao')
 * @returns 성공 시 리다이렉트 URL, 실패 시 에러 메시지
 */
export async function signInWithOAuth(provider: AuthProvider) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(`[Auth] ${provider} 로그인 실패:`, error);
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: '로그인 URL을 생성할 수 없습니다.' };
}

/**
 * 현재 사용자의 인증 세션을 확인하는 서버 액션
 * @returns 세션이 있으면 true, 없으면 false
 */
export async function checkAuthSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

/**
 * 로그아웃 서버 액션
 */
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('[Auth] 로그아웃 실패:', error);
    return { error: error.message };
  }

  redirect('/');
}
