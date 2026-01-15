# 🚀 프로젝트 가이드: 카카오 홈즈 (Kakao Homes)

**"초개인화 AI 인테리어 서비스를 위한 24시간 해커톤 개발 명세서"**

## 1. 핵심 기술 스택 (Tech Stack)

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (Lucide React Icons)
- **State Management**: **Zustand** (Onboarding 데이터 및 AI 결과 전역 관리)
- **Animation**: Framer Motion (퍼널 전환 효과용)
- **Layout Strategy**: Desktop-First Responsive (Sidebar 280px + Main Content)
- **Design Style**: Figma/Notion 스타일 다크 테마 SaaS UI

## 2. 프로젝트 아키텍처 (Feature-based Slice)

기능별로 폴더를 격리하여 동료와의 협업 충돌을 방지합니다.

- `src/app`: 파일 기반 라우팅 및 레이아웃 정의
- `src/features`: 핵심 비즈니스 로직 (Onboarding, AI Canvas, Social Voting)
- `src/store`: 전역 상태 관리 (`useUserStore.ts`)
- `src/components/ui`: shadcn/ui 컴포넌트

## 3. 사이드바 네비게이션 및 화면별 기능 상세

### 📌 Sidebar 구조

- **User Profile**: 아바타, displayName, email
- **Navigation**: 홈, AI 캔버스, 소셜, 마이 페이지
- **D-Day Widget**: 이사 예정일 카운트다운 (glass 스타일)
- **AI CTA**: AI 인테리어 시작하기 버튼 (gradient-primary)
- **Logout**: 로그아웃

### 🏠 1. 홈 (Home)

- **위치**: `/home`
- **핵심 요소**:
- **MyroomContainer**: 방 도면/이미지 + AI 캔버스 CTA 텍스트 + 시작 버튼
- **MychatList**: 최근 프로젝트 그리드 (MychatItem 카드)
- **MychatItem**: 썸네일 + Title + Date + Tags

### 🎨 2. AI 캔버스 (AI Canvas) - **Core Wow Point**

- **위치**: `/canvas`
- **핵심 요소**:
- **Steppers/Tabs**: [내 방 업로드] -> [무드/제약 설정] -> [AI 결과 확인] 3단계.
- **이미지 업로드**: `uploadedRoomImg`를 Store에 저장.
- **스타일 칩(Choice)**: 온보딩에서 선택한 취향을 기본값으로 노출.
- **AI 시각화**: 원본과 결과 이미지를 비교하는 `Before/After` 슬라이더 UI.
- **조건 반영 안내**: "월세 거주자를 위한 무타공 상품 위주로 구성되었습니다" 문구 강조.

### 👥 3. 소셜 피드 (Social)

- **위치**: `/social`
- **핵심 요소**:
- **공유 현황**: 카카오톡으로 공유된 시안들의 리스트.
- **투표 시스템**: 친구들이 클릭한 투표 결과(A안 vs B안)를 차트로 시각화.
- **커뮤니티**: 다른 유저들이 AI로 성공시킨 인테리어 사례 공유 피드.

### 📦 4. 마이 룸 (My)

- **위치**: `/my`
- **핵심 요소**:
- **프로필 설정**: 주거 형태(월세/전세/자가), 예산, 이사일 상시 수정 가능.
- **통합 배송 관리**: 장바구니에 담긴 가구들의 이사일 일괄 배송 예약 현황.
- **이사 체크리스트**: 1인 가구 맞춤형 투두리스트.

## 4. 핵심 상태 관리 (Zustand Store)

Claude에게 이 인터페이스를 참조하여 로직을 짜달라고 하세요.

```typescript
interface UserState {
  // Onboarding & Persona
  nickname: string;
  moods: string[]; // 취향 (modern, wood 등)
  residenceType: string; // 월세, 전세, 자가
  budget: number; // 예산 범위
  moveInDate: Date | null; // 이사 예정일

  // AI Canvas
  uploadedRoomImg: string | null;
  aiResultImg: string | null;

  // Actions
  setPersona: (data: Partial<UserState>) => void;
  setAiResult: (img: string) => void;
}
```

## 5. Claude를 위한 지시사항 (Prompting)

"위의 아키텍처와 기능을 바탕으로, `next.js 14 app router`를 사용하여 `shadcn/ui`로 디자인된 **모바일 퍼스트 인테리어 서비스**를 만들 거야. 먼저 `useUserStore.ts`를 작성하고, 바텀 네비게이션이 포함된 `RootLayout`을 짜줘. 그 후 `AI Canvas` 페이지의 3단계 퍼널 UI를 구현해줘."
