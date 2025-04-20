import * as THREE from 'three';
import { ViewDirection } from '../types';

type CameraConfig = {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
};

export function getCameraConfig(view: ViewDirection, bbox: THREE.Box3): CameraConfig {
  const center = new THREE.Vector3();
  bbox.getCenter(center);
  
  const size = new THREE.Vector3();
  bbox.getSize(size);
  
  const maxDim = Math.max(size.x, size.z) * 1.5;
  const height = 1.7; // Eye level height in meters
  
  let position: THREE.Vector3;
  
  switch (view) {
    case 'N':
      position = new THREE.Vector3(center.x, height, center.z + maxDim);
      break;
    case 'E':
      position = new THREE.Vector3(center.x + maxDim, height, center.z);
      break;
    case 'S':
      position = new THREE.Vector3(center.x, height, center.z - maxDim);
      break;
    case 'W':
      position = new THREE.Vector3(center.x - maxDim, height, center.z);
      break;
  }
  
  return {
    position,
    target: new THREE.Vector3(center.x, height, center.z),
    fov: 60,
  };
}
