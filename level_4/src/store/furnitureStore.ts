import { create } from 'zustand';
import { FurnitureObject, FurnitureState } from '../types';

export const useFurnitureStore = create<FurnitureState>((set) => ({
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
      const { [id]: removed, ...rest } = state.objects;
      return { objects: rest, selectedId: state.selectedId === id ? null : state.selectedId };
    }),
  select: (id) => set({ selectedId: id }),
}));
