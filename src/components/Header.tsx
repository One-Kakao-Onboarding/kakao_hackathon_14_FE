"use client";

import { Search, ShoppingCart, Menu, ChevronDown } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function Header() {
  const nickname = useUserStore((state) => state.nickname);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="w-[1280px] mx-auto flex items-center justify-between h-20">
        {/* Left Section: Logo + Main Nav */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900 pr-8">선물하기</h1>

          <nav className="flex items-center px-5">
            <ul className="flex items-center">
              <li className="pr-2.5">
                <button className="px-2.5 py-2 text-base font-bold hover:text-[#4684e9]">
                  홈
                </button>
              </li>
              <li className="pr-2.5">
                <button className="px-2.5 py-2 text-base font-bold hover:text-[#4684e9]">
                  위시
                </button>
              </li>
              <li className="pr-2.5">
                <button className="px-2.5 py-2 text-base font-bold hover:text-[#4684e9]">
                  선물함
                </button>
              </li>
            </ul>
          </nav>

          {/* <div className="flex items-center py-5 before:content-[''] before:w-px before:h-3.5 before:mr-5 before:bg-[#ddd]">
            <button className="inline-flex h-10 px-2.5 pt-2 text-base font-bold hover:text-[#4684e9]">
              <Menu size={30} className="mr-2 -mt-0.5" />
              <span>카테고리</span>
            </button>
          </div> */}
        </div>

        {/* Right Section: Search, Cart, User, Business Link */}
        <div className="flex items-center py-5 ml-auto">
          <button className="inline-block align-top">
            <Search size={24} className="m-2" />
          </button>

          <button className="inline-block align-top relative ml-3.5">
            <ShoppingCart size={24} className="m-2" />
          </button>

          <div className="flex items-center relative pl-5.5">
            <button className="inline-flex items-center relative h-9.5 pt-0.5 text-sm">
              <span className="overflow-hidden max-w-[116px] align-top text-ellipsis whitespace-nowrap">
                {nickname}
              </span>
              <ChevronDown size={10} className="ml-2" />
            </button>
          </div>

          <a
            href="#"
            className="h-10 ml-7.5 px-5 rounded-full text-sm font-bold leading-10 text-[#3063d2] bg-[#3063d20d] hover:bg-[#3063d21a]"
          >
            기업용 선물하기 →
          </a>
        </div>
      </div>
    </header>
  );
}
