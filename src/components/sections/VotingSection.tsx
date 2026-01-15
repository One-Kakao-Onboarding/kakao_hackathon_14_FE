'use client';

import { MessageCircle, Users } from 'lucide-react';

export default function VotingSection() {
  return (
    <section id="voting" className="py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          친구들에게 <span className="text-blue-600">투표</span> 받기
        </h2>
        <p className="text-gray-600">
          카카오톡으로 공유하고 의견을 받아보세요
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Kakao Share Card */}
        <div className="bg-[#fee500] rounded-2xl p-8 shadow-lg">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle size={24} className="text-gray-900" />
              <h3 className="text-xl font-bold text-gray-900">
                카카오톡으로 공유하기
              </h3>
            </div>
            <p className="text-gray-800 text-sm">
              A안과 B안 중 친구들이 선택할 수 있도록 투표를 공유해보세요
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <p className="font-bold text-gray-900">조성훈</p>
                <p className="text-xs text-gray-600">인테리어 투표 요청</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🛋️</span>
              </div>
              <div className="aspect-square bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl">✨</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-3">
              어떤 인테리어가 더 좋을까요?
            </p>
          </div>

          <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
            카카오톡 공유하기
          </button>
        </div>

        {/* Voting Result Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Users size={24} className="text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">투표 현황</h3>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🛋️</span>
                  </div>
                  <span className="font-medium text-gray-900">A안 (미니멀)</span>
                </div>
                <span className="text-xl font-bold text-blue-600">7표</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <span className="font-medium text-gray-900">B안 (모던)</span>
                </div>
                <span className="text-xl font-bold text-gray-600">3표</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-400 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-bold">총 10명</span>이 투표에 참여했습니다
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
