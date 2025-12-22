/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { X } from 'lucide-react';

interface DistrictModalProps {
  provinceCode: string;
  provinceName: string;
  visitedDistricts: string[];
  onClose: () => void;
  onDistrictClick?: (districtCode: string) => void;
}

interface GeoJSON {
  type: string;
  properties?: {
    provinceCode: string;
    provinceName: string;
    year: number;
  };
  features: Array<{
    type: string;
    properties: {
      adm_cd: string;
      adm_nm: string;
      [key: string]: any;
    };
    geometry: any;
  }>;
}

// 시/도별 지도 중심점과 확대율
const MAP_CONFIGS: Record<string, { center: [number, number]; scale: number }> = {
  '11': { center: [126.98, 37.57], scale: 70000 }, // 서울
  '21': { center: [129.08, 35.18], scale: 50000 }, // 부산
  '22': { center: [128.60, 35.87], scale: 50000 }, // 대구
  '23': { center: [126.71, 37.46], scale: 35000 }, // 인천
  '24': { center: [126.85, 35.16], scale: 60000 }, // 광주
  '25': { center: [127.38, 36.35], scale: 60000 }, // 대전
  '26': { center: [129.31, 35.54], scale: 50000 }, // 울산
  '29': { center: [127.29, 36.48], scale: 60000 }, // 세종
  '31': { center: [127.25, 37.40], scale: 15000 }, // 경기
  '32': { center: [128.30, 37.50], scale: 10000 }, // 강원
  '33': { center: [127.70, 36.80], scale: 20000 }, // 충북
  '34': { center: [126.80, 36.52], scale: 18000 }, // 충남
  '35': { center: [127.15, 35.72], scale: 20000 }, // 전북
  '36': { center: [126.99, 34.87], scale: 13000 }, // 전남
  '37': { center: [128.89, 36.49], scale: 11000 }, // 경북
  '38': { center: [128.21, 35.46], scale: 15000 }, // 경남
  '39': { center: [126.50, 33.45], scale: 40000 }, // 제주
};

export function DistrictModal({
  provinceCode,
  provinceName,
  visitedDistricts,
  onClose,
  onDistrictClick,
}: DistrictModalProps) {
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapConfig = MAP_CONFIGS[provinceCode] || { center: [127.5, 36.5], scale: 15000 };

  useEffect(() => {
    async function loadDistrictData() {
      setLoading(true);
      setError(null);

      try {
        // 시/도별 GeoJSON 파일 동적 로드
        const response = await fetch(`/data/districts_wgs84/${provinceCode}.json`);

        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`);
        }

        const data: GeoJSON = await response.json();
        setGeoData(data);
      } catch (err) {
        console.error('Failed to load district data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadDistrictData();
  }, [provinceCode]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{provinceName}</h2>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">시/군/구 선택</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="닫기"
        >
          <X className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="border-primary-600 mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                지도 데이터를 불러오는 중...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="mb-2 text-sm font-semibold text-red-600">
                데이터를 불러올 수 없습니다
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && geoData && (
          <>
            {/* 지도 */}
            <div className="mb-4 aspect-square overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  center: mapConfig.center,
                  scale: mapConfig.scale,
                }}
                width={800}
                height={600}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <Geographies geography={geoData}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const districtCode = geo.properties.adm_cd;
                      const isVisited = visitedDistricts.includes(districtCode);

                      return (
                        <Geography
                          key={districtCode}
                          geography={geo}
                          fill={isVisited ? '#0891B2' : '#E5E7EB'}
                          stroke="#FFFFFF"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: 'none' },
                            hover: {
                              fill: isVisited ? '#0E7490' : '#D1D5DB',
                              outline: 'none',
                              cursor: 'pointer',
                            },
                            pressed: { fill: '#155E75', outline: 'none' },
                          }}
                          onClick={() => onDistrictClick?.(districtCode)}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>

            {/* 시/군/구 목록 */}
            <div>
              <h3 className="mb-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                시/군/구 목록 ({geoData.features.length}개)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {geoData.features.map((feature) => {
                  const code = feature.properties.adm_cd;
                  const name = feature.properties.adm_nm;
                  const isVisited = visitedDistricts.includes(code);

                  return (
                    <button
                      key={code}
                      onClick={() => onDistrictClick?.(code)}
                      className={`rounded-lg border px-2 py-1.5 text-left text-xs transition-colors ${
                        isVisited
                          ? 'border-primary-600 bg-primary-50 text-primary-900 dark:bg-primary-950 dark:text-primary-100'
                          : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="truncate font-medium">{name}</div>
                      {isVisited && (
                        <div className="text-primary-600 dark:text-primary-400 text-[10px]">
                          ✓ 방문함
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 푸터 */}
      <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
        <div className="text-xs text-zinc-600 dark:text-zinc-400">
          {!loading && !error && geoData && (
            <>
              방문한 지역:{' '}
              <span className="text-primary-600 font-semibold">
                {visitedDistricts.filter((code) => code.startsWith(provinceCode)).length}
              </span>
              <span className="mx-1">/</span>
              <span>{geoData.features.length}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
