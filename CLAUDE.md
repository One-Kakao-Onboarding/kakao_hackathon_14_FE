# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kakao Homes (카카오 홈즈)** - "상상을 확신으로, 1인 가구를 위한 초개인화 AI 인테리어"

An AI-powered interior design platform for single-person households that combines room photos with user preferences to generate personalized, budget-conscious furniture recommendations with social voting features and unified delivery scheduling.

**Current Status**: PRD phase - source code implementation pending.

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React Icons
- **State Management**: Zustand (global store in `store/useUserStore.ts`)
- **Animation**: Framer Motion (funnel transition effects)
- **Design Constraint**: Desktop-First Responsive (Sidebar 280px + Main Content)
- **Design Style**: Figma/Notion 스타일 다크 테마 SaaS UI

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with DesktopLayout
│   ├── globals.css             # Design tokens & dark theme
│   ├── home/                   # Home screen (MyroomContainer, MychatList)
│   ├── canvas/                 # AI Canvas (3-step funnel: upload → settings → results)
│   ├── social/                 # Social feed (sharing, voting, community)
│   └── my/                     # My Room (profile, delivery, checklist)
├── features/
│   ├── ai-engine/              # Image upload, analysis, rendering
│   ├── constraint-filter/      # Budget & housing-type filtering
│   └── kakao-bridge/           # Kakao SDK integration
├── components/
│   └── ui/                     # shadcn/ui components
└── store/
    └── useUserStore.ts         # Zustand global state
```

### State Management (Zustand)

`store/useUserStore.ts` manages the complete user journey state:

```typescript
interface UserState {
  // Onboarding & Persona
  nickname: string;
  moods: string[];              // User preferences (modern, wood, etc.)
  residenceType: string;        // 월세, 전세, 자가
  budget: number;               // Budget range
  moveInDate: Date | null;      // Moving date

  // AI Canvas
  uploadedRoomImg: string | null;
  aiResultImg: string | null;

  // Actions
  setPersona: (data: Partial<UserState>) => void;
  setAiResult: (img: string) => void;
}
```

### Feature Modules

**ai-engine/**
- Image-to-Image rendering that maintains room composition while applying style transformations
- Fallback: 5 preset style templates if real-time AI unavailable
- Mood extraction from reference images (color palette, furniture materials)

**constraint-filter/**
- Housing type filtering: '월세' (monthly rental) → prioritizes removable, adhesive furniture
- Budget-based automatic furniture recommendations
- Rules-based filtering for room constraints

**kakao-bridge/**
- Kakao Talk API message template integration
- Social voting mechanism (Design A vs B)
- Desktop mockup of Kakao Talk chat UI

## App Structure (Sidebar Navigation)

### Sidebar Components
- **User Profile**: Avatar, displayName, email
- **Navigation**: 홈, AI 캔버스, 소셜, 마이 페이지
- **D-Day Widget**: 이사 예정일 카운트다운
- **AI CTA Button**: AI 인테리어 시작하기
- **Logout**: 로그아웃 버튼

### 1. Home (`/home`)
- **MyroomContainer**: 방 도면/이미지 + AI 캔버스 CTA
- **MychatList**: 최근 프로젝트 그리드 (MychatItem 카드)

### 2. AI Canvas (`/canvas`) - Core Wow Point
- **3-Step Funnel** (use Steppers/Tabs):
  1. **Upload**: User uploads room image → stored in `uploadedRoomImg`
  2. **Settings**: Style chips (moods from onboarding), constraint reflection
  3. **Results**: Before/After slider UI comparing original vs AI-generated images
- **Constraint Display**: Show "월세 거주자를 위한 무타공 상품 위주로 구성" for monthly rental users

### 3. Social Feed (`/social`)
- **Sharing Status**: List of designs shared via Kakao Talk
- **Voting System**: Visualize friend votes (Design A vs B) in charts
- **Community**: Feed of successful interior cases from other users

### 4. My Room (`/my`)
- **Profile Settings**: Edit residence type (월세/전세/자가), budget, moving date
- **Unified Delivery**: Manage bulk furniture delivery scheduled for moving day
- **Moving Checklist**: Single-person household customized to-do list

## Development Workflow

### Initial Setup
1. Implement `store/useUserStore.ts` with the UserState interface
2. Create `app/layout.tsx` with bottom navigation (Home, Canvas, Social, My)
3. Build AI Canvas page (`/canvas`) with 3-step funnel UI using shadcn/ui

### Development Team Structure

This project is optimized for **2-person collaboration**:

- **Developer A (Flow & Social)**: Home screen, Social feed, My Room page, Kakao API integration
- **Developer B (Core AI & Visualization)**: AI Canvas 3-step funnel, image upload handling, Before/After slider

## Key Integration Points

- **AI Engine**: Reads `uploadedRoomImg` and `moods` from store → returns `aiResultImg`
- **Kakao API**: Handles social sharing and voting collection from `/social`
- **Constraint Filter**: Applies rules based on `residenceType` (월세 → 무타공 products) and `budget` from store
- **D-Day Calculator**: Uses `moveInDate` from store to display countdown on home screen

## Hackathon Demonstration Strategy

- **Visual Impact**: Before/After slider for immediate comparison
- **Social Proof**: Kakao Talk mockup UI in desktop view for chat simulation
- **Personalization**: Display "무타공 제품" (removable furniture) tags for monthly rental users
- **Data Flow**: Show complete journey from input → AI generation → social validation → checkout