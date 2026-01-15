"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  badge?: boolean;
  isSpecial?: boolean;
}

const tabs: Tab[] = [
  { id: "for-me", label: "FOR♥ME", badge: true, isSpecial: true },
  { id: "ranking", label: "랭킹" },
  { id: "discount", label: "할인/위시" },
  { id: "giftx", label: "GiftX" },
  { id: "partnership", label: "제휴단" },
  { id: "ai-homes", label: "AI선물탐험" },
  { id: "kakao-homes", label: "카카오 홈즈" },
];

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState("kakao-homes");

  return (
    <nav className="fixed top-20 left-0 right-0 bg-white border-b border-gray-200 z-40">
      <div className="w-[1280px] mx-auto flex items-center gap-8 h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative transition-colors pt-[10px] pb-[10px] ${
              activeTab === tab.id
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.isSpecial ? (
              // Special FOR♥ME styling
              <div className="flex flex-col items-start relative">
                <span className="text-[10px] font-bold text-purple-600 leading-none mb-1">
                  단7일!더블할인
                </span>
                <div className="flex items-center gap-0.5">
                  <span className="text-base font-black text-gray-900">
                    FOR
                  </span>
                  <span className="text-base font-black text-purple-600">
                    ♥
                  </span>
                  <span className="text-base font-black text-gray-900">ME</span>
                </div>
              </div>
            ) : (
              // Normal tab styling - Kakao style (15px, font-weight: 700, line-height: 18px)
              <span className="flex items-center gap-1 text-[15px] font-bold leading-[18px]">
                {tab.badge && (
                  <span className="inline-block px-1.5 py-0.5 text-xs text-purple-700 bg-purple-100 rounded">
                    인기지금대세
                  </span>
                )}
                {tab.label}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-[-14px] left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
