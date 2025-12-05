/**
 * 사용자 타입
 */
export interface User {
  id: string;
  email: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 도시 타입
 */
export interface City {
  code: string;
  name: string;
  province: string;
}

/**
 * 방문 기록 타입
 */
export interface Visit {
  id: string;
  user_id: string;
  city_code: string;
  visit_date: string | null;
  rating: number | null;
  memo: string | null;
  photos: string[];
  created_at: string;
  updated_at: string;
}

/**
 * 사진 타입
 */
export interface Photo {
  id: string;
  visit_id: string;
  url: string;
  created_at: string;
}

/**
 * 프로필 타입
 */
export interface Profile extends User {
  visit_count: number;
  completion_rate: number;
  average_rating: number;
}