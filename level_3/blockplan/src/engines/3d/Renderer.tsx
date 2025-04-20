import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../../models/store';
import { ViewpointMapper } from './ViewpointMapper';
import { ObjectMapper } from './ObjectMapper';

interface RendererProps {
  width: number;
  height: number;
}

const Renderer: React.FC<RendererProps> = ({ width, height }) => {
  const { room, furniture, viewpoint } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup scene if not already done
    if (!sceneRef.current) {
      sceneRef.current = new THREE.Scene();
      sceneRef.current.background = new THREE.Color(0xf0f0f0);
      
      // Create renderer
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setSize(width, height);
      rendererRef.current.shadowMap.enabled = true;
      
      // Add renderer to DOM
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(rendererRef.current.domElement);
    }
    
    // Setup camera and update scene
    updateScene();
    
    // Cleanup function
    return () => {
      if (rendererRef.current && rendererRef.current.domElement.parentElement) {
        rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
      }
    };
  }, [room, furniture, viewpoint, width, height]);
  
  const updateScene = () => {
    if (!sceneRef.current || !rendererRef.current) return;
    
    // Clear existing scene
    while (sceneRef.current.children.length > 0) {
      sceneRef.current.remove(sceneRef.current.children[0]);
    }
    
    // Get camera configuration
    const roomHeight = 2.5; // Meters
    const { cameraPosition, lookAtPosition } = ViewpointMapper.getCameraConfig(viewpoint, roomHeight);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.copy(cameraPosition);
    camera.lookAt(lookAtPosition);
    
    // Add lighting
    const lights = ViewpointMapper.getLighting(viewpoint, roomHeight);
    
    lights.forEach(light => {
      let threeLight: THREE.Light;
      
      switch (light.type) {
        case 'ambient':
          threeLight = new THREE.AmbientLight(light.color, light.intensity);
          break;
        case 'directional':
          threeLight = new THREE.DirectionalLight(light.color, light.intensity);
          if (light.position) {
            threeLight.position.copy(light.position);
          }
          (threeLight as THREE.DirectionalLight).castShadow = true;
          break;
        case 'point':
          threeLight = new THREE.PointLight(light.color, light.intensity);
          if (light.position) {
            threeLight.position.copy(light.position);
          }
          (threeLight as THREE.PointLight).castShadow = true;
          break;
        default:
          return;
      }
      
      sceneRef.current?.add(threeLight);
    });
    
    // Create room walls
    if (room.vertices.length >= 3) {
      const roomMesh = ObjectMapper.createRoomMesh(room.vertices, roomHeight);
      roomMesh.receiveShadow = true;
      sceneRef.current.add(roomMesh);
      
      // Create floor
      const floorMesh = ObjectMapper.createFloorMesh(room.vertices);
      floorMesh.receiveShadow = true;
      sceneRef.current.add(floorMesh);
    }
    
    // Add furniture objects
    furniture.forEach(item => {
      const mesh = ObjectMapper.createFurnitureMesh(item);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      sceneRef.current?.add(mesh);
    });
    
    // Render the scene
    rendererRef.current.render(sceneRef.current, camera);
  };
  
  return <div id="scene-container" ref={containerRef} style={{ width, height }} />;
};

export default Renderer;