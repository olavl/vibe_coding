// Furniture item types
export type FurnitureType = 
  | 'couch' 
  | 'bench' 
  | 'tv' 
  | 'mirror' 
  | 'plant' 
  | 'lamp' 
  | 'piano' 
  | 'carpet';

export type FurnitureStyle = 'classic' | 'modern' | 'minimal';

export interface Point {
  x: number;
  y: number;
}

export interface RoomVertex extends Point {
  id: string;
}

export interface Furniture {
  id: string;
  type: FurnitureType;
  position: Point;
  rotation: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  style: FurnitureStyle;
}

export interface RoomGeometry {
  vertices: RoomVertex[];
  dimensions: {
    width: number;
    length: number;
  };
}

export type ViewDirection = 'N' | 'S' | 'E' | 'W';

export interface ViewPoint {
  position: Point;
  direction: ViewDirection;
}

export interface AppState {
  room: RoomGeometry;
  furniture: Furniture[];
  viewpoint: ViewPoint;
  activeToolMode: 'draw' | 'move' | 'delete';
  selectedFurnitureId: string | null;
  gridSize: number;
}

// For export functionality
export interface ExportData {
  room: RoomGeometry;
  furniture: Furniture[];
  viewpoint: ViewPoint;
}