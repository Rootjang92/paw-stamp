/**
 * 방문 기록 추가 폼 데이터
 */
export interface AddVisitFormData {
  cityCode: string;
  cityName: string;
  visitDate: string | null;
  rating: number | null;
  photos: File[];
  memo: string;
}

/**
 * Funnel 단계
 */
export type FunnelStep = 'basic' | 'photos' | 'memo';

/**
 * Funnel 단계 정보
 */
export interface StepInfo {
  id: FunnelStep;
  title: string;
  description: string;
}

export const FUNNEL_STEPS: StepInfo[] = [
  {
    id: 'basic',
    title: '기본 정보',
    description: '방문 날짜와 평점을 입력해주세요',
  },
  {
    id: 'photos',
    title: '사진 추가',
    description: '방문 기록에 추가할 사진을 선택해주세요 (선택)',
  },
  {
    id: 'memo',
    title: '메모 작성',
    description: '방문 후기나 메모를 남겨보세요 (선택)',
  },
];
