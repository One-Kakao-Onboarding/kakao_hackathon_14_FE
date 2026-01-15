'use client';

import { useState, useEffect } from 'react';

interface FilterButton {
  id: string;
  label: string;
  icon?: string;
}

const filters: FilterButton[] = [
  { id: 'upload', label: '사진 업로드', icon: '📸' },
  { id: 'ai-result', label: 'AI 시각화' },
  { id: 'products', label: '상품 추천' },
  { id: 'voting', label: '카톡 투표' },
  { id: 'schedule', label: '이사 일정' },
  { id: 'projects', label: '최근 프로젝트' },
];

export default function SectionFilter() {
  const [activeFilter, setActiveFilter] = useState('upload');
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const checkActiveSection = () => {
      // 각 섹션의 위치를 확인하여 가장 위에 있는 것을 active로 설정
      const sections = filters.map((filter) => {
        const element = document.getElementById(filter.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return {
            id: filter.id,
            top: rect.top,
            bottom: rect.bottom,
          };
        }
        return null;
      }).filter(Boolean);

      // viewport 상단에서 200px 아래에 있는 섹션 찾기
      const headerOffset = 200;
      const activeSection = sections.find(
        (section) => section && section.top <= headerOffset && section.bottom > headerOffset
      );

      if (activeSection) {
        setActiveFilter(activeSection.id);
      }
    };

    const handleScroll = () => {
      // Check if scrolled past hero section + carousel (approximately 850px)
      setIsSticky(window.scrollY > 850);
      checkActiveSection();
    };

    // Intersection Observer to track active section
    const observerOptions = {
      root: null,
      rootMargin: '-200px 0px -40% 0px',
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // 보이는 모든 섹션 중에서 가장 위에 있는 것을 선택
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => ({
          id: entry.target.id,
          top: entry.boundingClientRect.top,
        }))
        .sort((a, b) => a.top - b.top);

      if (visibleSections.length > 0) {
        setActiveFilter(visibleSections[0].id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    filters.forEach((filter) => {
      const element = document.getElementById(filter.id);
      if (element) {
        observer.observe(element);
      }
    });

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 136 + 60; // Header (80px) + Tab (56px) + Filter (60px)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Initial centered filter (before sticky) */}
      {!isSticky && (
        <div className="bg-white py-8">
          <div className="w-[1280px] mx-auto">
            <div className="flex items-center justify-center gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => scrollToSection(filter.id)}
                  className={`h-[46px] px-6 rounded-full font-semibold text-lg transition-all ${
                    filter.id === 'upload'
                      ? activeFilter === filter.id
                        ? 'bg-[#ffe600] text-gray-900 border-2 border-[#ffe600]'
                        : 'bg-[#ffe600] text-gray-900 border border-[#ffe600] opacity-70 hover:opacity-100'
                      : activeFilter === filter.id
                      ? 'bg-[#222] text-white border-2 border-[#222]'
                      : 'bg-white text-[#666] border border-[#e5e5e5] hover:border-gray-300'
                  }`}
                >
                  {filter.icon && <span className="mr-1.5">{filter.icon}</span>}
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky filter (compact, left-aligned) */}
      <div
        className={`sticky top-36 z-30 bg-white border-b border-gray-100 py-3 transition-all ${
          isSticky ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-[1280px] mx-auto">
          <div className="flex items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => scrollToSection(filter.id)}
                className={`h-[38px] rounded-full font-medium text-sm transition-all ${
                  filter.id === 'upload'
                    ? activeFilter === filter.id
                      ? 'bg-[#ffe600] text-gray-900 border-2 border-[#ffe600] px-4'
                      : 'bg-[#ffe600] text-gray-900 border border-[#ffe600] opacity-70 hover:opacity-100 px-4'
                    : activeFilter === filter.id
                    ? 'bg-[#222] text-white border-2 border-[#222] px-5'
                    : 'bg-white text-[#666] border border-[#e5e5e5] hover:border-gray-300 px-5'
                }`}
              >
                {filter.icon && filter.id === 'upload' && (
                  <span className="mr-1">{filter.icon}</span>
                )}
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
