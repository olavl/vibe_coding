import * as THREE from 'three';
import { ViewDirection, Point } from '../../models/types';

// Maps 2D viewpoints to 3D camera configurations
export class ViewpointMapper {
  // Calculate camera position based on viewpoint
  static getCameraConfig(
    viewpoint: { position: Point; direction: ViewDirection },
    roomHeight: number = 2.5, // Default room height in meters
    distanceFromWall: number = 1.5 // Camera distance from viewpoint in meters
  ): {
    cameraPosition: THREE.Vector3;
    lookAtPosition: THREE.Vector3;
  } {
    // Scale factors (pixel to meter conversion)
    const scale = 0.02; // 50 pixels = 1 meter
    
    // Create the base position
    const position = new THREE.Vector3(
      viewpoint.position.x * scale,
      roomHeight / 2, // Position camera at half the room height
      viewpoint.position.y * scale
    );
    
    // Direction vectors based on compass directions
    const directionVectors = {
      N: new THREE.Vector3(0, 0, -1),
      S: new THREE.Vector3(0, 0, 1),
      E: new THREE.Vector3(1, 0, 0),
      W: new THREE.Vector3(-1, 0, 0)
    };
    
    // Get the look direction
    const lookDirection = directionVectors[viewpoint.direction];
    
    // Calculate camera position by moving back from viewpoint
    const cameraPosition = position.clone().sub(
      lookDirection.clone().multiplyScalar(distanceFromWall)
    );
    
    // Calculate look at position by moving forward from viewpoint
    const lookAtPosition = position.clone().add(
      lookDirection.clone().multiplyScalar(1) // Look 1 meter ahead
    );
    
    return {
      cameraPosition,
      lookAtPosition
    };
  }
  
  // Get lighting setup based on viewpoint
  static getLighting(
    viewpoint: { position: Point; direction: ViewDirection },
    roomHeight: number = 2.5 // Default room height in meters
  ): Array<{
    type: 'ambient' | 'directional' | 'point';
    color: number;
    intensity: number;
    position?: THREE.Vector3;
  }> {
    // Scale factors
    const scale = 0.02; // 50 pixels = 1 meter
    
    // Calculate room center in 3D space
    const roomCenter = new THREE.Vector3(
      viewpoint.position.x * scale,
      roomHeight / 2,
      viewpoint.position.y * scale
    );
    
    return [
      // Main ambient light
      {
        type: 'ambient',
        color: 0xffffff,
        intensity: 0.6
      },
      // Key light
      {
        type: 'directional',
        color: 0xffffff,
        intensity: 0.8,
        position: new THREE.Vector3(
          roomCenter.x + 5,
          roomCenter.y + 3,
          roomCenter.z - 5
        )
      },
      // Fill light
      {
        type: 'point',
        color: 0xf5e3c0, // Warm light
        intensity: 0.4,
        position: new THREE.Vector3(
          roomCenter.x - 3,
          roomCenter.y + 2,
          roomCenter.z + 3
        )
      }
    ];
  }
}