'use client';

import { Home, Palette, Users, User, LogOut, Calendar, Sparkles } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useState } from 'react';

const navItems = [
  { id: 'home', label: '홈', icon: Home },
  { id: 'canvas', label: 'AI 캔버스', icon: Palette },
  { id: 'social', label: '소셜', icon: Users },
  { id: 'my', label: '마이 페이지', icon: User },
];

export default function Sidebar() {
  const { nickname, moveInDate } = useUserStore();
  const [activeNav, setActiveNav] = useState('home');

  // Calculate D-Day
  const calculateDDay = () => {
    if (!moveInDate) return null;
    const today = new Date();
    const target = new Date(moveInDate);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const dDay = calculateDDay();

  return (
    <aside className="fixed left-0 top-28 bottom-0 w-[280px] bg-white border-r border-gray-200 p-6 overflow-y-auto">
      {/* User Profile */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
          {nickname.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-gray-900">{nickname}</div>
          <div className="text-sm text-gray-500">user@kakao.com</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mb-8">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeNav === item.id
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* D-Day Widget */}
      {dDay !== null && (
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-orange-600" />
            <span className="text-xs font-medium text-orange-900">이사까지</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">
            D-{dDay}
          </div>
          <div className="text-xs text-orange-700 mt-1">
            {moveInDate.toLocaleDateString('ko-KR')}
          </div>
        </div>
      )}

      {/* AI CTA Button */}
      <button className="w-full mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium flex items-center justify-between hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles size={20} />
          <span>AI 인테리어 시작하기</span>
        </div>
        <span>→</span>
      </button>

      {/* Logout */}
      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
        <LogOut size={20} />
        <span>로그아웃</span>
      </button>
    </aside>
  );
}
