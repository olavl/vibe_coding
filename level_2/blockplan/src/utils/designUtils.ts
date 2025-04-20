import { Point, RoomOutline, FurnitureObject, DesignState } from '../models/types';
import { nanoid } from 'nanoid';

// Generate a unique ID for new furniture
export const generateId = (): string => nanoid(8);

// Snap point to grid
export const snapToGrid = (point: Point, gridSize: number): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

// Check if a point is inside the room outline
export const isPointInRoom = (point: Point, roomOutline: RoomOutline): boolean => {
  // Ray casting algorithm
  const { x, y } = point;
  const points = roomOutline.points;
  
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;
    
    const intersect = ((yi > y) !== (yj > y)) && 
                      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
};

// Export design as JSON
export const exportToJSON = (design: DesignState): string => {
  return JSON.stringify(design, null, 2);
};

// Load design from JSON
export const loadFromJSON = (json: string): DesignState => {
  return JSON.parse(json) as DesignState;
};

// Create a default room (simple rectangle)
export const createDefaultRoom = (): RoomOutline => {
  return {
    points: [
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 6, y: 4 },
      { x: 0, y: 4 }
    ]
  };
};