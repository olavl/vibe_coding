import { FurnitureObject } from '../store/furnitureState';
import { Point } from '../store/roomState';

/**
 * Exports room and furniture data as a JSON file
 */
export function exportJSON(roomPoints: Point[], isClosed: boolean, furniture: Record<string, FurnitureObject>): void {
  const data = {
    version: '1.0',
    room: {
      points: roomPoints,
      isClosed
    },
    furniture: Object.values(furniture)
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `blockplan-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports the 3D rendering as a PNG screenshot
 */
export function exportScreenshot(canvasElement: HTMLCanvasElement): void {
  const url = canvasElement.toDataURL('image/png');
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `blockplan-3d-${new Date().toISOString().slice(0, 10)}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}