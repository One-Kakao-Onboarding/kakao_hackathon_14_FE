'use client';

import { ShoppingCart, Heart } from 'lucide-react';

const mockProducts = [
  {
    id: 1,
    brand: '이케아',
    name: '무타공 벽선반 (화이트)',
    price: 29900,
    tag: '무타공',
    emoji: '📚',
  },
  {
    id: 2,
    brand: '한샘',
    name: '모던 3단 수납장',
    price: 89000,
    tag: '월세추천',
    emoji: '🗄️',
  },
  {
    id: 3,
    brand: '다이소',
    name: '접착식 후크 세트',
    price: 5000,
    tag: '무타공',
    emoji: '🪝',
  },
  {
    id: 4,
    brand: '무인양품',
    name: '미니멀 책상 정리함',
    price: 12000,
    tag: '베스트',
    emoji: '📦',
  },
];

export default function ProductsSection() {
  return (
    <section id="products" className="py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          <span className="text-blue-600">월세 거주자</span>를 위한 맞춤 상품
        </h2>
        <p className="text-gray-600">
          무타공 제품 위주로 구성되었습니다
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {mockProducts.map((product) => (
          <div key={product.id} className="cmp_prd">
            <div className="block">
              {/* Product Image */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center overflow-hidden group">
                <span className="text-6xl">{product.emoji}</span>

                {/* Tag Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                    {product.tag}
                  </span>
                </div>

                {/* Hover Actions */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                    <Heart size={16} className="text-gray-700" />
                  </button>
                  <button className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700">
                    <ShoppingCart size={16} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="link_info">
                <span className="txt_brand">{product.brand}</span>
                <span className="txt_prdname">{product.name}</span>
                <div className="price_info">
                  <span className="num_price">
                    {product.price.toLocaleString()}
                    <span className="txt_won">원</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
