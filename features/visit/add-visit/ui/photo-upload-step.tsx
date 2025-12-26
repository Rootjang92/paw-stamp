'use client';

import { useRef, ChangeEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { MAX_PHOTOS_PER_VISIT, MAX_PHOTO_SIZE_MB, ALLOWED_IMAGE_TYPES } from '@/shared/config/constants';
import Image from 'next/image';

interface PhotoUploadStepProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
}

export function PhotoUploadStep({ photos, onPhotosChange }: PhotoUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 파일 검증
    const validFiles = files.filter((file) => {
      // 파일 타입 체크
      if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
        alert(`${file.name}은(는) 지원하지 않는 형식입니다. (JPEG, PNG, WebP만 가능)`);
        return false;
      }

      // 파일 크기 체크
      if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
        alert(`${file.name}의 크기가 ${MAX_PHOTO_SIZE_MB}MB를 초과합니다.`);
        return false;
      }

      return true;
    });

    // 최대 개수 체크
    const newPhotos = [...photos, ...validFiles].slice(0, MAX_PHOTOS_PER_VISIT);
    onPhotosChange(newPhotos);

    // Input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const canAddMore = photos.length < MAX_PHOTOS_PER_VISIT;

  return (
    <div className="space-y-6">
      {/* 제목 */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          사진 추가
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          방문 기록에 추가할 사진을 선택해주세요 (최대 {MAX_PHOTOS_PER_VISIT}장)
        </p>
      </div>

      {/* 사진 그리드 */}
      <div className="grid grid-cols-3 gap-3">
        {/* 기존 사진들 */}
        {photos.map((photo, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
          >
            <Image
              src={URL.createObjectURL(photo)}
              alt={`사진 ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemovePhoto(index)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}

        {/* 사진 추가 버튼 */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed',
              'border-zinc-300 bg-zinc-50 transition-colors hover:border-primary-600 hover:bg-primary-50',
              'dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-primary-600 dark:hover:bg-primary-950',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2'
            )}
          >
            <ImagePlus className="mb-2 h-6 w-6 text-zinc-400 dark:text-zinc-600" />
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              사진 추가
            </span>
          </button>
        )}
      </div>

      {/* 안내 문구 */}
      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          • JPEG, PNG, WebP 형식만 지원됩니다<br />
          • 사진 1장당 최대 {MAX_PHOTO_SIZE_MB}MB까지 업로드 가능합니다<br />
          • 사진은 나중에도 추가/삭제할 수 있습니다
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
