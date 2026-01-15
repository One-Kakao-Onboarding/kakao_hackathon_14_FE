"use client";

export default function HeroSection() {
  return (
    <section className="w-full bg-gray-100">
      <div className="relative w-full" style={{ aspectRatio: "16 / 3" }}>
        {/* 배너 이미지를 여기에 넣으세요 */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center">
            <p className="text-gray-400 text-lg mb-4">배너 이미지 영역</p>
            <p className="text-gray-500 text-sm">1920 x 360px 권장</p>
          </div>
        </div>

        {/* 실제 사용 시 아래 img 태그 주석 해제하고 위 placeholder div 삭제 */}
        {/* <img
          src="/banner.jpg"
          alt="카카오 홈즈 배너"
          className="w-full h-full object-cover"
        /> */}
      </div>
    </section>
  );
}
