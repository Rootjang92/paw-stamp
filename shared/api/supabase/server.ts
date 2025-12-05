import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // 개발 환경에서만 경고 출력
            if (process.env.NODE_ENV === 'development') {
              console.warn(`[Supabase] 쿠키 설정 실패: ${name}`, error);
            }
            // 프로덕션에서는 조용히 무시
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`[Supabase] 쿠키 삭제 실패: ${name}`, error);
            }
          }
        },
      },
    }
  );
}