'use client';

import { useState } from 'react';
import { KoreaMap } from './korea-map';
import { MapPin } from 'lucide-react';

interface MapContainerProps {
  visitedCities?: string[];
  onCityClick?: (cityCode: string) => void;
}

export function MapContainer({ visitedCities = [], onCityClick }: MapContainerProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleCityClick = (cityCode: string) => {
    setSelectedCity(cityCode);
    onCityClick?.(cityCode);
  };

  const visitedCount = visitedCities.length;
  const totalCities = 229;
  const completionRate = ((visitedCount / totalCities) * 100).toFixed(1);

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <MapPin className="text-primary-600 h-5 w-5" />
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            대한민국 방문 지도
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            <span className="text-primary-600 font-semibold">{visitedCount}</span>
            <span className="mx-1">/</span>
            <span>{totalCities}</span>
            <span className="ml-2 text-zinc-500">({completionRate}%)</span>
          </div>
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <KoreaMap
          visitedCities={visitedCities}
          onCityClick={handleCityClick}
          className="max-h-full max-w-full"
        />

        {/* 범례 */}
        <div className="absolute bottom-4 left-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">범례</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-[#10B981]" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">방문한 지역</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-[#9CA3AF]" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">미방문 지역</span>
            </div>
          </div>
        </div>
      </div>

      {/* 선택된 도시 정보 (추후 확장) */}
      {selectedCity && (
        <div className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            선택된 지역:{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedCity}</span>
          </p>
        </div>
      )}
    </div>
  );
}
