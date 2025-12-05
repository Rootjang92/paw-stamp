/**
 * 전체 시/군/구 개수
 */
export const TOTAL_CITIES = 229;

/**
 * 광역시/도 목록
 */
export const PROVINCES = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
] as const;

/**
 * 방문 기록당 최대 사진 수
 */
export const MAX_PHOTOS_PER_VISIT = 9;

/**
 * 사진 최대 크기 (MB)
 */
export const MAX_PHOTO_SIZE_MB = 5;

/**
 * 사진 허용 형식
 */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

/**
 * 평점 범위
 */
export const MIN_RATING = 1;
export const MAX_RATING = 5;