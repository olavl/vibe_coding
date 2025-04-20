import { Box3, Vector3 } from 'three';
import { ViewDirection } from '../store/uiState';

// Maps a view direction to a camera configuration
export function getCameraConfig(view: ViewDirection, bbox: Box3): {
  position: Vector3;
  target: Vector3;
  fov: number;
} {
  // Calculate center of the room
  const center = new Vector3();
  bbox.getCenter(center);
  
  // Calculate dimensions of the room
  const size = new Vector3();
  bbox.getSize(size);
  
  // Calculate distance based on room size to ensure room is visible
  const maxDim = Math.max(size.x, size.z);
  const distance = maxDim * 1.5;
  
  // Default FOV
  const fov = 60;
  
  // Set position based on view direction
  let position;
  switch(view) {
    case 'N':
      position = new Vector3(center.x, distance * 0.5, center.z + distance);
      break;
    case 'E':
      position = new Vector3(center.x + distance, distance * 0.5, center.z);
      break;
    case 'S':
      position = new Vector3(center.x, distance * 0.5, center.z - distance);
      break;
    case 'W':
      position = new Vector3(center.x - distance, distance * 0.5, center.z);
      break;
  }
  
  return {
    position,
    target: center,
    fov
  };
}