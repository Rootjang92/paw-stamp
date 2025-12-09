import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 via-white to-secondary-emerald-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                로그인 실패
              </h1>
              <p className="text-slate-600">
                인증 과정에서 문제가 발생했습니다.
                <br />
                다시 시도해 주세요.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="block w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-center"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
