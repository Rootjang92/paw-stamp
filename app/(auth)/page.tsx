import { MapPin, Image as ImageIcon, Sparkles, Plane, Camera, Map as MapIcon } from 'lucide-react';

import { GoogleLoginButton } from '@/features/auth/login/ui';
import FloatingIcon from '@/shared/ui/FloatingIcon';

export default async function HomePage() {
  return (
    <div className="from-primary-50 to-secondary-emerald-50 flex min-h-screen flex-col bg-linear-to-br via-white">
      {/* Main Content - 중앙 정렬 */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl">
          <div className="space-y-8 text-center">
            {/* 귀여운 아이콘 애니메이션 */}
            <div className="relative mb-8 h-32">
              {/* 중앙 지구본 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="from-primary-500 to-primary-700 animate-float flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br shadow-lg">
                    <MapIcon className="h-10 w-10 animate-pulse text-white" />
                  </div>
                  {/* 반짝이 효과 */}
                  <Sparkles className="text-secondary-amber-500 absolute -top-2 -right-2 h-6 w-6 animate-ping" />
                </div>
              </div>

              {/* 떠다니는 아이콘들 */}
              <FloatingIcon
                icon={<MapPin className="text-primary-600 h-6 w-6" />}
                delay="0s"
                position="top-0 left-1/4"
              />
              <FloatingIcon
                icon={<Camera className="text-secondary-emerald-600 h-5 w-5" />}
                delay="1s"
                position="top-4 right-1/4"
              />
              <FloatingIcon
                icon={<Plane className="text-secondary-amber-600 h-5 w-5" />}
                delay="2s"
                position="bottom-4 left-1/3"
              />
              <FloatingIcon
                icon={<ImageIcon className="h-5 w-5 text-purple-600" />}
                delay="1.5s"
                position="bottom-0 right-1/3"
              />
            </div>

            {/* 헤드라인 */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                <Sparkles className="text-primary-600 h-4 w-4" />
                <span className="text-sm font-medium text-slate-700">대한민국 229개 시/군/구</span>
              </div>

              <h1 className="text-4xl leading-tight font-bold text-slate-900 md:text-5xl lg:text-6xl">
                <span className="block">나만의 여행 지도</span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg text-slate-600 md:text-xl">
                방문한 곳을 기록하고, 사진과 메모로 추억을 남기세요
              </p>
            </div>

            {/* 로그인 카드 - 중앙 */}
            <div className="mx-auto mt-12 max-w-md">
              <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-8 shadow-xl">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-bold text-slate-900">시작하기</h2>
                  <p className="text-slate-600">소셜 계정으로 간편하게 로그인</p>
                </div>

                <div className="space-y-3">
                  <GoogleLoginButton />
                  {/* <KakaoLoginButton /> */}
                </div>

                <p className="text-center text-xs leading-relaxed text-slate-500">
                  계속 진행하면{' '}
                  <a href="#" className="text-primary-600 hover:underline">
                    서비스 약관
                  </a>
                  과{' '}
                  <a href="#" className="text-primary-600 hover:underline">
                    개인정보 처리방침
                  </a>
                  에 동의하게 됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
