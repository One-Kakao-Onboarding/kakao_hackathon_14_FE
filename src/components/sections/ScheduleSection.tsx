'use client';

import { Calendar, Truck, CheckSquare } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

export default function ScheduleSection() {
  const { moveInDate } = useUserStore();

  const calculateDDay = () => {
    if (!moveInDate) return null;
    const today = new Date();
    const target = new Date(moveInDate);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const dDay = calculateDDay();

  return (
    <section id="schedule" className="py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          이사 <span className="text-blue-600">일정 관리</span>
        </h2>
        <p className="text-gray-600">
          통합 배송과 이사 체크리스트를 관리하세요
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* D-Day Card */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={24} className="text-orange-600" />
            <h3 className="text-lg font-bold text-gray-900">이사일</h3>
          </div>
          {dDay !== null && (
            <>
              <div className="text-5xl font-bold text-orange-600 mb-2">
                D-{dDay}
              </div>
              <p className="text-gray-700 text-sm">
                {moveInDate.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </>
          )}
          <button className="w-full mt-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
            일정 수정하기
          </button>
        </div>

        {/* Delivery Management Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Truck size={24} className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">통합 배송</h3>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">배송 대기</span>
              <span className="font-bold text-blue-600">4개</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">배송 예정일</span>
              <span className="font-medium text-gray-900">
                {moveInDate?.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
            💡 이사일에 맞춰 일괄 배송됩니다
          </div>
        </div>

        {/* Checklist Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <CheckSquare size={24} className="text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">체크리스트</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-green-600 rounded" defaultChecked />
              <span className="text-sm text-gray-700 line-through">전입신고</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-green-600 rounded" defaultChecked />
              <span className="text-sm text-gray-700 line-through">인터넷 설치</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
              <span className="text-sm text-gray-700">청소업체 예약</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
              <span className="text-sm text-gray-700">가구 조립</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
