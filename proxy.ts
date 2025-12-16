import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@/shared/api/supabase/server';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 보호된 라우트 목록 (인증 필요)
  const protectedRoutes = ['/map', '/profile', '/stats'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 인증이 필요한 페이지에 비로그인 접근 시 홈으로 리다이렉트
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 로그인 상태에서 홈페이지 접근 시 지도 페이지로 리다이렉트
  if (request.nextUrl.pathname === '/' && session) {
    return NextResponse.redirect(new URL('/map', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
