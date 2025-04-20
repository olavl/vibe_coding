import { create } from 'zustand';
import { AppMode, AppState, ViewDirection } from '../types';

export const useAppStore = create<AppState>((set) => ({
  mode: 'sketch' as AppMode,
  viewDirection: 'N' as ViewDirection,
  setMode: (mode) => set({ mode }),
  setViewDirection: (viewDirection) => set({ viewDirection }),
}));
