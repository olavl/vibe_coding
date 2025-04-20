import { create } from 'zustand';

export type FurnitureObject = {
  id: string;
  type: 'couch' | 'lamp' | 'tv' | 'mirror' | 'carpet' | 'bench' | 'piano' | 'plant';
  position: [number, number];
  rotation: number; // in degrees
  color: string; // HEX
  variant: string; // e.g., 'classic', 'modern'
};

interface FurnitureState {
  objects: Record<string, FurnitureObject>;
  selectedId: string | null;
  add: (obj: FurnitureObject) => void;
  update: (id: string, delta: Partial<FurnitureObject>) => void;
  remove: (id: string) => void;
  setSelectedId: (id: string | null) => void;
}

export const useFurnitureState = create<FurnitureState>((set) => ({
  objects: {},
  selectedId: null,
  add: (obj) => 
    set((state) => ({
      objects: { ...state.objects, [obj.id]: obj }
    })),
  update: (id, delta) => 
    set((state) => ({
      objects: { 
        ...state.objects, 
        [id]: { ...state.objects[id], ...delta } 
      }
    })),
  remove: (id) => 
    set((state) => {
      const newObjects = { ...state.objects };
      delete newObjects[id];
      return { objects: newObjects };
    }),
  setSelectedId: (id) => set({ selectedId: id }),
}));