'use client';

import { ArrowRight } from 'lucide-react';

export default function MyroomContainer() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-10 mb-12">
      <div className="grid grid-cols-2 gap-12">
        {/* Left: Room Image */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-7xl mb-4">🏠</div>
              <p className="text-gray-500 text-base">내 방 이미지를 업로드하세요</p>
            </div>
          </div>
        </div>

        {/* Right: CTA Text */}
        <div className="flex flex-col justify-center">
          <h3 className="tit_g mb-8">
            AI 캔버스 기능을 통해 자동으로<br />
            나의 집 <span className="txt_point">인테리어</span>를 확인하고,<br />
            제안 받아보세요
          </h3>
          <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold text-base w-fit shadow-md hover:shadow-lg">
            <span>AI 캔버스 시작하기</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
