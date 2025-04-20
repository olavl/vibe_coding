import { Point } from '../types';

export const GRID_SIZE = 0.5; // 0.5m
export const SCALE = 100; // 100px = 1m

export function snapToGrid(point: Point): Point {
  return {
    x: Math.round(point.x / (GRID_SIZE * SCALE)) * (GRID_SIZE * SCALE),
    y: Math.round(point.y / (GRID_SIZE * SCALE)) * (GRID_SIZE * SCALE),
  };
}

export function pixelsToMeters(pixels: number): number {
  return pixels / SCALE;
}

export function metersToPixels(meters: number): number {
  return meters * SCALE;
}
