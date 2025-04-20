import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { 
  AppState, 
  Furniture, 
  Point, 
  RoomGeometry, 
  RoomVertex, 
  ViewPoint 
} from './types';

// Initial room shape as a simple rectangle
const initialRoom: RoomGeometry = {
  vertices: [
    { id: nanoid(), x: 100, y: 100 },
    { id: nanoid(), x: 500, y: 100 },
    { id: nanoid(), x: 500, y: 400 },
    { id: nanoid(), x: 100, y: 400 },
  ],
  dimensions: {
    width: 400,
    length: 300
  }
};

const initialViewpoint: ViewPoint = {
  position: { x: 300, y: 250 },
  direction: 'N'
};

// Create the store with actions
export const useAppStore = create<AppState & {
  addVertex: (point: Point) => void;
  updateVertex: (id: string, point: Point) => void;
  removeVertex: (id: string) => void;
  addFurniture: (furniture: Omit<Furniture, 'id'>) => void;
  updateFurniture: (id: string, updates: Partial<Omit<Furniture, 'id'>>) => void;
  removeFurniture: (id: string) => void;
  setViewpoint: (viewpoint: ViewPoint) => void;
  setActiveToolMode: (mode: 'draw' | 'move' | 'delete') => void;
  setSelectedFurniture: (id: string | null) => void;
  setGridSize: (size: number) => void;
  exportData: () => { room: RoomGeometry; furniture: Furniture[]; viewpoint: ViewPoint };
  importData: (data: { room: RoomGeometry; furniture: Furniture[]; viewpoint: ViewPoint }) => void;
}>((set, get) => ({
  // Initial state
  room: initialRoom,
  furniture: [],
  viewpoint: initialViewpoint,
  activeToolMode: 'draw',
  selectedFurnitureId: null,
  gridSize: 25, // 0.5m in pixels (assuming 50px = 1m)

  // Actions
  addVertex: (point) => set((state) => {
    const newVertex: RoomVertex = { ...point, id: nanoid() };
    return { 
      room: { 
        ...state.room, 
        vertices: [...state.room.vertices, newVertex] 
      } 
    };
  }),

  updateVertex: (id, point) => set((state) => {
    const updatedVertices = state.room.vertices.map(v => 
      v.id === id ? { ...v, ...point } : v
    );
    return { 
      room: { 
        ...state.room, 
        vertices: updatedVertices 
      } 
    };
  }),

  removeVertex: (id) => set((state) => {
    const filteredVertices = state.room.vertices.filter(v => v.id !== id);
    return { 
      room: { 
        ...state.room, 
        vertices: filteredVertices 
      } 
    };
  }),

  addFurniture: (furniture) => set((state) => {
    const newFurniture: Furniture = { ...furniture, id: nanoid() };
    return { furniture: [...state.furniture, newFurniture] };
  }),

  updateFurniture: (id, updates) => set((state) => {
    const updatedFurniture = state.furniture.map(f => 
      f.id === id ? { ...f, ...updates } : f
    );
    return { furniture: updatedFurniture };
  }),

  removeFurniture: (id) => set((state) => {
    const filteredFurniture = state.furniture.filter(f => f.id !== id);
    return { furniture: filteredFurniture };
  }),

  setViewpoint: (viewpoint) => set(() => ({ viewpoint })),

  setActiveToolMode: (mode) => set(() => ({ activeToolMode: mode })),

  setSelectedFurniture: (id) => set(() => ({ selectedFurnitureId: id })),

  setGridSize: (size) => set(() => ({ gridSize: size })),

  exportData: () => {
    const { room, furniture, viewpoint } = get();
    return { room, furniture, viewpoint };
  },

  importData: (data) => set(() => ({
    room: data.room,
    furniture: data.furniture,
    viewpoint: data.viewpoint
  }))
}));