import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 서버 컴포넌트 및 서버 액션용 Supabase 클라이언트
 * @supabase/ssr v0.8.0+ 최신 API 사용
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // 미들웨어나 서버 컴포넌트에서 쿠키 설정이 불가능한 경우
            // 개발 환경에서만 경고 출력
            if (process.env.NODE_ENV === 'development') {
              console.warn('[Supabase] 쿠키 설정 실패:', error);
            }
          }
        },
      },
    }
  );
}