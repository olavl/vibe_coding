import { create } from 'zustand';

export type Point = { x: number; y: number };
export type Polygon = Point[];

interface RoomState {
  points: Point[];
  isClosed: boolean;
  addPoint: (p: Point) => void;
  closePolygon: () => void;
  reset: () => void;
}

export const useRoomState = create<RoomState>((set) => ({
  points: [],
  isClosed: false,
  addPoint: (p) => set((state) => ({ points: [...state.points, p] })),
  closePolygon: () => set({ isClosed: true }),
  reset: () => set({ points: [], isClosed: false }),
}));