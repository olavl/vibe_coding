import { FurnitureObject } from '../types';
import { useRoomStore } from '../store/roomStore';
import { useFurnitureStore } from '../store/furnitureStore';

export function exportJSON(): string {
  const roomState = useRoomStore.getState();
  const furnitureState = useFurnitureStore.getState();
  
  const exportData = {
    room: {
      points: roomState.points,
      isClosed: roomState.isClosed,
    },
    furniture: Object.values(furnitureState.objects),
  };
  
  return JSON.stringify(exportData, null, 2);
}

export function exportScreenshot(canvasRef: HTMLCanvasElement): string {
  return canvasRef.toDataURL('image/png');
}
