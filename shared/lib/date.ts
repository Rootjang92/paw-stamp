import { format, parseISO, formatDistance } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜 포맷
 * "2024-12-02" → "2024년 12월 2일"
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy년 MM월 dd일', { locale: ko });
}

/**
 * 상대 시간
 * "2시간 전", "3일 전"
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: ko });
}