import { Point, RoomVertex } from '../models/types';

// Snap a point to a grid
export const snapToGrid = (point: Point, gridSize: number): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

// Calculate distance between two points
export const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// Check if a point is inside a polygon
export const isPointInPolygon = (point: Point, vertices: RoomVertex[]): boolean => {
  // Ray casting algorithm
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const intersect = ((vertices[i].y > point.y) !== (vertices[j].y > point.y)) &&
      (point.x < (vertices[j].x - vertices[i].x) * (point.y - vertices[i].y) / (vertices[j].y - vertices[i].y) + vertices[i].x);
    if (intersect) inside = !inside;
  }
  return inside;
};

// Get room center point
export const getRoomCenter = (vertices: RoomVertex[]): Point => {
  const xSum = vertices.reduce((sum, v) => sum + v.x, 0);
  const ySum = vertices.reduce((sum, v) => sum + v.y, 0);
  return {
    x: xSum / vertices.length,
    y: ySum / vertices.length
  };
};

// Calculate bounding box of a polygon
export const getBoundingBox = (vertices: RoomVertex[]) => {
  const xs = vertices.map(v => v.x);
  const ys = vertices.map(v => v.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};

// Check if a polygon is valid (no self-intersections)
export const isValidPolygon = (vertices: RoomVertex[]): boolean => {
  if (vertices.length < 3) return false;
  
  // Check for self-intersections (simplified)
  // A proper implementation would be more involved
  // This is a basic check to prevent obvious issues
  const edges = vertices.map((_, i) => {
    const nextIdx = (i + 1) % vertices.length;
    return {
      p1: vertices[i],
      p2: vertices[nextIdx]
    };
  });
  
  // Simple check: no vertex should be too close to another non-adjacent edge
  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i];
    
    for (let j = 0; j < edges.length; j++) {
      // Skip edges connected to this vertex
      if (j === i || j === (i - 1 + vertices.length) % vertices.length) {
        continue;
      }
      
      const edge = edges[j];
      const distToEdge = distancePointToLine(vertex, edge.p1, edge.p2);
      
      if (distToEdge < 10) { // Too close, potential problem
        return false;
      }
    }
  }
  
  return true;
};

// Calculate distance from a point to a line segment
export const distancePointToLine = (p: Point, l1: Point, l2: Point): number => {
  const A = p.x - l1.x;
  const B = p.y - l1.y;
  const C = l2.x - l1.x;
  const D = l2.y - l1.y;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) {
    param = dot / lenSq;
  }
  
  let xx, yy;
  
  if (param < 0) {
    xx = l1.x;
    yy = l1.y;
  } else if (param > 1) {
    xx = l2.x;
    yy = l2.y;
  } else {
    xx = l1.x + param * C;
    yy = l1.y + param * D;
  }
  
  const dx = p.x - xx;
  const dy = p.y - yy;
  
  return Math.sqrt(dx * dx + dy * dy);
};