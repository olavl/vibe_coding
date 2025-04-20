import { create } from 'zustand';
import { Point, RoomState } from '../types';

export const useRoomStore = create<RoomState>((set) => ({
  points: [],
  isClosed: false,
  addPoint: (point) => set((state) => ({ points: [...state.points, point] })),
  closePolygon: () => set({ isClosed: true }),
  reset: () => set({ points: [], isClosed: false }),
}));
