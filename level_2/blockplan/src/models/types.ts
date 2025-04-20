export interface Point {
  x: number;
  y: number;
}

export interface RoomOutline {
  points: Point[];
}

export enum Direction {
  North = 'N',
  South = 'S',
  East = 'E',
  West = 'W'
}

export enum FurnitureType {
  Couch = 'couch',
  Bench = 'bench',
  TV = 'tv',
  Mirror = 'mirror',
  Plant = 'plant',
  Lamp = 'lamp',
  Piano = 'piano',
  Carpet = 'carpet'
}

export interface FurnitureObject {
  id: string;
  type: FurnitureType;
  position: Point;
  rotation: number;
  width: number;
  height: number;
  depth: number;
  color: string;
  style: number; // 0, 1, or 2 for different style variations
}

export interface DesignState {
  roomOutline: RoomOutline;
  furniture: FurnitureObject[];
  viewPoint: Point;
  viewDirection: Direction;
  gridSize: number;
}