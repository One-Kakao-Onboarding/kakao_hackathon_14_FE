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

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: '모던 패브릭 소파',
    price: 289000,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    description: '편안한 착석감과 세련된 디자인의 2인용 패브릭 소파',
    features: ['무타공 설치', '이동 가능', '쿠션 분리 세탁'],
    category: '소파',
    brand: '홈즈퍼니처'
  },
  {
    id: 'prod-2',
    name: '원목 접이식 테이블',
    price: 159000,
    image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&h=400&fit=crop',
    description: '공간 활용도가 높은 접이식 원목 다이닝 테이블',
    features: ['접이식', '천연 원목', '1인 가구 최적'],
    category: '테이블',
    brand: '우드라이프'
  },
  {
    id: 'prod-3',
    name: '무선 LED 플로어 스탠드',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
    description: '밝기 조절 가능한 무선 충전식 플로어 조명',
    features: ['무선 충전', '밝기 3단 조절', '무타공'],
    category: '조명',
    brand: '라이팅플러스'
  },
  {
    id: 'prod-4',
    name: '오픈형 책장 겸 수납장',
    price: 135000,
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=400&fit=crop',
    description: '깔끔한 디자인의 다용도 오픈 수납장',
    features: ['조립식', '이동 가능', '5단 구성'],
    category: '수납',
    brand: '스토리지랩'
  },
  {
    id: 'prod-5',
    name: '프리미엄 메모리폼 매트리스',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop',
    description: '숙면을 위한 7존 독립 메모리폼 매트리스',
    features: ['롤팩 배송', '100일 무료 체험', '10년 품질 보증'],
    category: '침구',
    brand: '슬리핌'
  },
  {
    id: 'prod-6',
    name: '북유럽 스타일 사이드 테이블',
    price: 49000,
    image: 'https://images.unsplash.com/photo-1558211583-803e70ca2a46?w=400&h=400&fit=crop',
    description: '침대 옆이나 소파 옆에 두기 좋은 미니 테이블',
    features: ['경량 디자인', '이동 편리', '방수 코팅'],
    category: '테이블',
    brand: '노르딕홈'
  },
  {
    id: 'prod-7',
    name: '스마트 벽걸이 거울',
    price: 178000,
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=400&fit=crop',
    description: 'LED 조명이 내장된 터치 센서 벽걸이 거울',
    features: ['무타공 접착', 'LED 조명', '터치 밝기 조절'],
    category: '생활용품',
    brand: '스마트미러'
  },
  {
    id: 'prod-8',
    name: '컴팩트 행거 옷장',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',
    description: '좁은 공간에 최적화된 슬림 행거형 옷장',
    features: ['조립식', '이동 바퀴', '커버 분리 세탁'],
    category: '수납',
    brand: '클로젯랩'
  }
];

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
