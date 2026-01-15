'use client';

import { ShoppingCart, Heart, ExternalLink } from 'lucide-react';
import { MOCK_PRODUCTS, getRecommendedProducts } from '@/features/mock-products';
import { useUserStore } from '@/store/useUserStore';

export default function ProductsSection() {
  const { residenceType, moods } = useUserStore();

  // 사용자 맞춤 상품 추천
  const displayProducts = getRecommendedProducts(moods, residenceType === '월세' ? 'monthly' : 'owned').slice(0, 8);

  // 거주 형태에 따른 제목
  const getTitle = () => {
    if (residenceType === '월세') {
      return (
        <>
          <span className="text-blue-600">월세 거주자</span>를 위한 맞춤 상품
        </>
      );
    } else if (residenceType === '전세') {
      return (
        <>
          <span className="text-blue-600">전세</span> 거주자를 위한 추천 상품
        </>
      );
    } else {
      return (
        <>
          <span className="text-blue-600">내 집 마련</span>을 위한 인테리어 상품
        </>
      );
    }
  };

  // 거주 형태에 따른 설명
  const getDescription = () => {
    if (residenceType === '월세') {
      return '무타공 제품 위주로 구성되었습니다';
    } else if (residenceType === '전세') {
      return '이동 가능하고 실용적인 상품으로 구성되었습니다';
    } else {
      return '오래 사용할 수 있는 프리미엄 상품 위주입니다';
    }
  };

  return (
    <section id="products" className="py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {getTitle()}
        </h2>
        <p className="text-gray-600">
          {getDescription()}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {displayProducts.map((product) => (
          <div key={product.id} className="cmp_prd">
            <div className="block">
              {/* Product Image */}
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden group border border-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Tag Badge */}
                {product.features.length > 0 && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                      {product.features[0]}
                    </span>
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                    <Heart size={16} className="text-gray-700" />
                  </button>
                  <button className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700">
                    <ExternalLink size={16} className="text-white" />
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
