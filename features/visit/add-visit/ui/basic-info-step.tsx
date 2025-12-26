'use client';

import { useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Star } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { MIN_RATING, MAX_RATING } from '@/shared/config/constants';

interface BasicInfoStepProps {
  cityName: string;
  visitDate: string | null;
  rating: number | null;
  onVisitDateChange: (date: string) => void;
  onRatingChange: (rating: number) => void;
}

export function BasicInfoStep({
  cityName,
  visitDate,
  rating,
  onVisitDateChange,
  onRatingChange,
}: BasicInfoStepProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const displayRating = hoveredRating ?? rating ?? 0;

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* 제목 */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {cityName}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          방문 날짜와 평점을 입력해주세요
        </p>
      </div>

      {/* 방문 날짜 */}
      <Input
        type="date"
        label="방문 날짜"
        value={visitDate ?? today}
        onChange={(e) => onVisitDateChange(e.target.value)}
        max={today}
      />

      {/* 평점 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
          평점
        </label>
        <div className="flex items-center gap-2">
          {Array.from({ length: MAX_RATING }, (_, i) => i + MIN_RATING).map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(null)}
              className="transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded"
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors',
                  star <= displayRating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-transparent text-zinc-300 dark:text-zinc-700'
                )}
              />
            </button>
          ))}
        </div>
        {rating && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {rating}점을 선택했습니다
          </p>
        )}
      </div>
    </div>
  );
}
