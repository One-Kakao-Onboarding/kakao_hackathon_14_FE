"use client";

export default function HeroSection() {
  return (
    <section className="w-full bg-gray-100">
      <div className="relative w-full" style={{ aspectRatio: "16 / 3" }}>
        <img
          src="/hero-banner.png"
          alt="카카오 홈즈 - 편안한 나만의 공간을 위한 똑똑한 관리"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
