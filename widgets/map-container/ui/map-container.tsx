'use client';

import { useState } from 'react';
import { KoreaMap } from './korea-map';
import { DistrictPanel } from './district-panel';
import { MapPin } from 'lucide-react';
import { getProvinceName } from '@/shared/data/provinces';
import { AnimatePresence } from 'motion/react';
import { AddVisitFunnel, type AddVisitFormData } from '@/features/visit/add-visit';

interface MapContainerProps {
  visitedCities?: string[];
  onCityClick?: (cityCode: string) => void;
}

export function MapContainer({ visitedCities = [], onCityClick }: MapContainerProps) {
  const [selectedProvince, setSelectedProvince] = useState<{
    code: string;
    name: string;
  } | null>(null);

  const [selectedDistrict, setSelectedDistrict] = useState<{
    code: string;
    name: string;
  } | null>(null);

  const handleProvinceClick = (provinceCode: string) => {
    setSelectedProvince({
      code: provinceCode,
      name: getProvinceName(provinceCode),
    });
    onCityClick?.(provinceCode);
  };

  const handleDistrictClick = (districtCode: string, districtName: string) => {
    setSelectedDistrict({
      code: districtCode,
      name: districtName,
    });
  };

  const handleFunnelSubmit = (data: AddVisitFormData) => {
    console.log('방문 기록 제출:', data);
    // TODO: 실제 Supabase에 데이터 저장 로직 구현
  };

  const handleFunnelClose = () => {
    setSelectedDistrict(null);
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

      {/* 본문: 모바일은 세로, 데스크톱은 가로 레이아웃 */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* 지도 영역 */}
        <div className="relative flex flex-1 md:flex-none md:grow items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 md:h-full">
          <KoreaMap
            visitedCities={visitedCities}
            onCityClick={handleProvinceClick}
            selectedProvinceCode={selectedProvince?.code ?? null}
            onDistrictClick={handleDistrictClick}
            className="max-h-full max-w-full"
          />

          {/* 범례 */}
          <div className="absolute bottom-4 left-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">범례</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-[#0891B2]" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">방문한 지역</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-[#E5E7EB]" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">미방문 지역</span>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 패널 - 선택된 도시 정보 및 시/군/구 선택 */}
        <div className="border-t md:border-t-0 md:border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 w-full md:w-80 md:shrink-0 lg:w-96 flex flex-col min-h-screen overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedProvince ? (
              <DistrictPanel
                key={selectedProvince.code}
                provinceCode={selectedProvince.code}
                provinceName={selectedProvince.name}
                visitedDistricts={visitedCities}
                onClose={() => setSelectedProvince(null)}
                onDistrictClick={handleDistrictClick}
              />
            ) : (
              <div key="empty" className="flex flex-1 items-center justify-center p-8">
                <div className="text-center">
                  <MapPin className="mx-auto mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    지역을 선택해주세요
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    지도에서 시/도를 클릭하면<br />
                    시/군/구를 선택할 수 있습니다
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 방문 기록 추가 Funnel 모달 */}
      {selectedDistrict && (
        <AddVisitFunnel
          cityCode={selectedDistrict.code}
          cityName={selectedDistrict.name}
          isOpen={!!selectedDistrict}
          onClose={handleFunnelClose}
          onSubmit={handleFunnelSubmit}
        />
      )}
    </div>
  );
}
