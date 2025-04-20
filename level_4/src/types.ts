export type Point = { x: number; y: number };
export type Polygon = Point[];

export type FurnitureType = 'couch' | 'lamp' | 'tv' | 'mirror' | 'carpet' | 'bench' | 'piano' | 'plant';
export type ViewDirection = 'N' | 'E' | 'S' | 'W';

export type FurnitureObject = {
  id: string;
  type: FurnitureType;
  position: [number, number];
  rotation: number; // in degrees
  color: string; // HEX
  variant: string; // e.g., 'classic', 'modern'
};

export type AppMode = 'sketch' | 'object' | '3d';

export interface RoomState {
  points: Point[];
  isClosed: boolean;
  addPoint: (p: Point) => void;
  closePolygon: () => void;
  reset: () => void;
}

export interface FurnitureState {
  objects: Record<string, FurnitureObject>;
  selectedId: string | null;
  add: (obj: FurnitureObject) => void;
  update: (id: string, delta: Partial<FurnitureObject>) => void;
  remove: (id: string) => void;
  select: (id: string | null) => void;
}

export interface AppState {
  mode: AppMode;
  viewDirection: ViewDirection;
  setMode: (mode: AppMode) => void;
  setViewDirection: (direction: ViewDirection) => void;
}