import kakaoProductsRaw from './kakao-products.json';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  category: string;
  brand: string;
}

// 카카오 상품 데이터를 Product 인터페이스에 맞게 변환
function convertKakaoProducts(): Product[] {
  return kakaoProductsRaw.map((item: any, index: number) => {
    // 상품명에서 카테고리 추출
    let category = '인테리어';
    if (item.name.includes('명태') || item.name.includes('액막이') || item.name.includes('소금')) {
      category = '집들이';
    } else if (item.name.includes('시계') || item.name.includes('알람')) {
      category = '시계';
    } else if (item.name.includes('조명') || item.name.includes('무드등') || item.name.includes('거울')) {
      category = '조명';
    } else if (item.name.includes('멀티탭') || item.name.includes('충전')) {
      category = '가전';
    }

    // features 생성 (무타공, 인기상품, 리뷰폭발 등)
    const features: string[] = [];

    // 무타공 관련
    if (item.name.includes('무타공') || item.name.includes('접착')) features.push('무타공');

    // 선물 관련
    if (item.name.includes('집들이') || item.name.includes('이사')) features.push('집들이 선물');
    if (item.name.includes('개업')) features.push('개업 선물');

    // 인기도 기반
    if (item.wish_count > 20000) {
      features.push('리뷰폭발');
    } else if (item.wish_count > 10000) {
      features.push('인기상품');
    } else if (item.wish_count > 5000) {
      features.push('HOT');
    }

    // 기능 관련
    if (item.name.includes('LED') || item.name.includes('무선')) features.push('스마트');
    if (item.name.includes('한정') || item.name.includes('단독')) features.push('한정수량');

    // 카테고리별 추가 태그
    if (category === '조명') features.push('무드 조명');
    if (category === '집들이' && item.name.includes('명태')) features.push('행운 UP');

    // 상품명 정리 (따옴표와 괄호 제거)
    let cleanName = item.name
      .replace(/^"[^"]*"\s*/g, '')
      .replace(/\[.*?\]/g, '')
      .trim();

    // 너무 길면 첫 부분만 사용
    if (cleanName.length > 50) {
      cleanName = cleanName.substring(0, 47) + '...';
    }

    return {
      id: `kakao-${index + 1}`,
      name: cleanName,
      price: item.price,
      image: item.image,
      description: cleanName,
      features: features.length > 0 ? features : ['카카오 선물하기'],
      category,
      brand: item.brand
    };
  });
}

export const MOCK_PRODUCTS: Product[] = convertKakaoProducts();

// AI 결과에 따라 랜덤으로 4개 상품 추천
export function getRecommendedProducts(mood: string[], residenceType: string): Product[] {
  // 월세면 '무타공' 특징이 있는 상품 우선
  let filtered = [...MOCK_PRODUCTS];

  if (residenceType === 'monthly') {
    const withNoHole = filtered.filter(p => p.features.some(f => f.includes('무타공')));
    const others = filtered.filter(p => !p.features.some(f => f.includes('무타공')));
    filtered = [...withNoHole, ...others];
  }

  // 랜덤으로 섞기
  const shuffled = filtered.sort(() => Math.random() - 0.5);

  // 상위 4개 반환
  return shuffled.slice(0, 4);
}
