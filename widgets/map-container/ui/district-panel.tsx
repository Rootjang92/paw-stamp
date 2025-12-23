/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DistrictPanelProps {
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

export function DistrictPanel({
  provinceCode,
  provinceName,
  visitedDistricts,
  onClose,
  onDistrictClick,
}: DistrictPanelProps) {
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex h-full w-full flex-col overflow-hidden"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{provinceName}</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">시/군/구 선택</p>
          </div>
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
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="text-center">
                <div className="border-primary-600 mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  지도 데이터를 불러오는 중...
                </p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="text-center">
                <p className="mb-2 text-sm font-semibold text-red-600">
                  데이터를 불러올 수 없습니다
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{error}</p>
              </div>
            </motion.div>
          )}

          {!loading && !error && geoData && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* 시/군/구 목록 */}
              <div>
                <h3 className="mb-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  시/군/구 목록 ({geoData.features.length}개)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {geoData.features.map((feature, index) => {
                    const code = feature.properties.adm_cd;
                    const name = feature.properties.adm_nm;
                    const isVisited = visitedDistricts.includes(code);

                    return (
                      <motion.button
                        key={code}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.2 }}
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
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </motion.div>
  );
}
