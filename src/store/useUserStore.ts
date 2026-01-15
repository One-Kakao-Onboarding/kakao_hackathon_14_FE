import { create } from 'zustand';

interface Circle {
  x: number;
  y: number;
  radius: number;
}

interface UserState {
  // Onboarding & Persona
  nickname: string;
  moods: string[]; // 취향 (modern, wood 등)
  residenceType: string; // 월세, 전세, 자가
  budget: number; // 예산 범위
  moveInDate: Date | null; // 이사 예정일

  // AI Canvas
  uploadedRoomImg: string | null;
  editedImage: string | null;
  aiResultImg: string | null;
  circles: Circle[];
  canvasSize: { width: number; height: number } | null;

  // Actions
  setPersona: (data: Partial<UserState>) => void;
  setUploadedRoomImg: (img: string | null) => void;
  setEditedImage: (img: string | null) => void;
  setCircles: (circles: Circle[]) => void;
  setCanvasSize: (size: { width: number; height: number } | null) => void;
  setAiResult: (img: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  // Initial state
  nickname: '조성훈',
  moods: ['modern', 'minimal'],
  residenceType: 'monthly',
  budget: 3000000,
  moveInDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후

  uploadedRoomImg: null,
  editedImage: null,
  aiResultImg: null,
  circles: [],
  canvasSize: null,

  // Actions
  setPersona: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  setUploadedRoomImg: (img) =>
    set({ uploadedRoomImg: img }),

  setEditedImage: (img) =>
    set({ editedImage: img }),

  setCircles: (circles) =>
    set({ circles }),

  setCanvasSize: (size) =>
    set({ canvasSize: size }),

  setAiResult: (img) =>
    set({ aiResultImg: img }),
}));
