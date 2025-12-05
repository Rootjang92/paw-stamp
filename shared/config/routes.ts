/**
 * 라우트 경로 상수
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  MAP: '/map',
  STATS: '/stats',
  PROFILE: '/profile',
  PUBLIC_PROFILE: (username: string) => `/@${username}`,
} as const;