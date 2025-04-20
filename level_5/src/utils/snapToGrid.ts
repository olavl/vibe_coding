import { Point } from '../store/roomState';

// Grid size as specified in the design doc (LLD 7)
const GRID_SIZE = 50; // 0.5m at 100px=1m scale

export function snapToGrid(point: Point): Point {
  return {
    x: Math.round(point.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(point.y / GRID_SIZE) * GRID_SIZE
  };
}