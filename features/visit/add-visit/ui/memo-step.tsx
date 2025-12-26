'use client';

import { Textarea } from '@/shared/ui/textarea';

interface MemoStepProps {
  memo: string;
  onMemoChange: (memo: string) => void;
}

export function MemoStep({ memo, onMemoChange }: MemoStepProps) {
  const charCount = memo.length;
  const maxChars = 500;

  return (
    <div className="space-y-6">
      {/* 제목 */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          메모 작성
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          방문 후기나 특별한 순간을 기록해보세요
        </p>
      </div>

      {/* 메모 입력 */}
      <div className="relative">
        <Textarea
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          placeholder="이곳에서의 추억을 기록해보세요...&#10;&#10;예시:&#10;• 맛있는 음식점을 발견했어요&#10;• 아름다운 풍경을 봤어요&#10;• 특별한 사람과 함께했어요"
          maxLength={maxChars}
          className="min-h-[200px]"
        />
        <div className="mt-2 text-right">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {charCount} / {maxChars}
          </span>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          💡 메모는 나중에도 수정할 수 있으니 부담없이 작성해보세요
        </p>
      </div>
    </div>
  );
}
