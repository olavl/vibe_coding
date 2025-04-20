import { create } from 'zustand';

export type AppMode = 'sketch' | 'object' | '3d';
export type ViewDirection = 'N' | 'E' | 'S' | 'W';

interface UIState {
  mode: AppMode;
  viewDirection: ViewDirection;
  setMode: (mode: AppMode) => void;
  setViewDirection: (direction: ViewDirection) => void;
}

export const useUIState = create<UIState>((set) => ({
  mode: 'sketch',
  viewDirection: 'N',
  setMode: (mode) => set({ mode }),
  setViewDirection: (direction) => set({ viewDirection: direction }),
}));