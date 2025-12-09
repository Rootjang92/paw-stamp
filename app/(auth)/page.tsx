import { redirect } from 'next/navigation';
import { createClient } from '@/shared/api/supabase/server';
import { GoogleLoginButton, KakaoLoginButton } from '@/features/auth/login/ui';
import {
  MapPin,
  Image as ImageIcon,
  Sparkles,
  Plane,
  Camera,
  Map as MapIcon,
} from 'lucide-react';

export default async function HomePage() {
  // 서버 사이드에서 인증 상태 확인
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/map');
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-secondary-emerald-50 flex flex-col">
      {/* Main Content - 중앙 정렬 */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl">
          <div className="text-center space-y-8">
            {/* 귀여운 아이콘 애니메이션 */}
            <div className="relative h-32 mb-8">
              {/* 중앙 지구본 */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-20 h-20 bg-linear-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg animate-float">
                    <MapIcon className="w-10 h-10 text-white animate-pulse" />
                  </div>
                  {/* 반짝이 효과 */}
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-secondary-amber-500 animate-ping" />
                </div>
              </div>

              {/* 떠다니는 아이콘들 */}
              <FloatingIcon
                icon={<MapPin className="w-6 h-6 text-primary-600" />}
                delay="0s"
                position="top-0 left-1/4"
              />
              <FloatingIcon
                icon={<Camera className="w-5 h-5 text-secondary-emerald-600" />}
                delay="1s"
                position="top-4 right-1/4"
              />
              <FloatingIcon
                icon={<Plane className="w-5 h-5 text-secondary-amber-600" />}
                delay="2s"
                position="bottom-4 left-1/3"
              />
              <FloatingIcon
                icon={<ImageIcon className="w-5 h-5 text-purple-600" />}
                delay="1.5s"
                position="bottom-0 right-1/3"
              />
            </div>

            {/* 헤드라인 */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-slate-700">
                  대한민국 229개 시/군/구
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                <span className="block">나만의 여행 지도</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                방문한 곳을 기록하고, 사진과 메모로 추억을 남기세요
              </p>
            </div>

            {/* 로그인 카드 - 중앙 */}
            <div className="max-w-md mx-auto mt-12">
              <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    시작하기
                  </h2>
                  <p className="text-slate-600">
                    소셜 계정으로 간편하게 로그인
                  </p>
                </div>

                <div className="space-y-3">
                  <GoogleLoginButton />
                  <KakaoLoginButton />
                </div>

                <p className="text-xs text-center text-slate-500 leading-relaxed">
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

// 떠다니는 아이콘 컴포넌트
function FloatingIcon({
  icon,
  delay,
  position,
}: {
  icon: React.ReactNode;
  delay: string;
  position: string;
}) {
  return (
    <div
      className={`absolute ${position}`}
      style={{
        animationDelay: delay,
      }}
    >
      <div className="animate-float-slow">
        <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

// 기능 아이템 컴포넌트
function FeatureItem({
  icon,
  text,
  gradient,
}: {
  icon: React.ReactNode;
  text: string;
  gradient: string;
}) {
  return (
    <div className="group flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/50 transition-all duration-200">
      <div
        className={`w-12 h-12 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}
      >
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-700">{text}</span>
    </div>
  );
}
