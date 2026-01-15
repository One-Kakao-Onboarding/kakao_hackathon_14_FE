'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    step: 'STEP 1',
    title: '방 사진을 업로드하고\nAI가 재해석한 인테리어를 확인하세요!',
    description: '사진 한 장으로 시작하는\n나만의 인테리어 디자인',
    image: '/tutorial-1.png',
    color: 'from-blue-100 to-purple-100',
  },
  {
    id: 2,
    step: 'STEP 2',
    title: '월세 거주자를 위한\n무타공 가구 추천!',
    description: '주거 형태에 맞춘\n맞춤형 상품 큐레이션',
    image: '/tutorial-2.png',
    color: 'from-green-100 to-blue-100',
  },
  {
    id: 3,
    step: 'STEP 3',
    title: '친구들에게 투표를 받고\n최종 디자인을 결정하세요!',
    description: '카카오톡으로 공유하고\n의견을 받아보세요',
    image: '/tutorial-3.png',
    color: 'from-yellow-100 to-orange-100',
  },
  {
    id: 4,
    step: 'STEP 4',
    title: '이사일에 맞춰\n통합 배송으로 한 번에!',
    description: '선택한 가구들을\n이사일에 일괄 배송',
    image: '/tutorial-4.png',
    color: 'from-pink-100 to-red-100',
  },
];

export default function TutorialCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-white py-12">
      <div className="w-[1280px] mx-auto">
        <div className="relative overflow-hidden">
          {/* Slides Container */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="w-full flex-shrink-0">
                <div
                  className={`relative h-[400px] rounded-3xl bg-gradient-to-br ${slide.color} p-16 flex items-center justify-between`}
                >
                  {/* Left Content */}
                  <div className="flex-1">
                    <p className="text-orange-500 font-bold text-2xl mb-4">
                      {slide.step}
                    </p>
                    <h3 className="text-4xl font-bold text-gray-900 mb-6 whitespace-pre-line">
                      {slide.title}
                    </h3>
                    <p className="text-xl text-gray-600 whitespace-pre-line">
                      {slide.description}
                    </p>
                  </div>

                  {/* Right Illustration */}
                  <div className="flex-shrink-0 ml-16">
                    <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-lg">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-gray-900'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
