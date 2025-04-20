import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useRoomState, Point } from '../store/roomState';
import { useFurnitureState } from '../store/furnitureState';
import { useUIState } from '../store/uiState';
import { getCameraConfig } from '../utils/ViewpointMapper';
import './Canvas3D.css';

// Mapping furniture types to dimensions (in 3D world units)
const FURNITURE_3D_CONFIG: Record<string, { width: number; depth: number; height: number }> = {
  couch: { width: 2.0, depth: 0.8, height: 0.7 },
  lamp: { width: 0.4, depth: 0.4, height: 1.5 },
  tv: { width: 1.2, depth: 0.2, height: 0.7 },
  mirror: { width: 0.8, depth: 0.1, height: 1.0 },
  carpet: { width: 2.0, depth: 1.5, height: 0.05 },
  bench: { width: 1.2, depth: 0.4, height: 0.4 },
  piano: { width: 1.5, depth: 0.8, height: 1.0 },
  plant: { width: 0.5, depth: 0.5, height: 1.2 },
};

// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const ROOM_HEIGHT = 2.5; // 2.5 meters
const PIXEL_TO_METER = 0.01; // 100px = 1m

interface Canvas3DProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const Canvas3D: React.FC<Canvas3DProps> = ({ canvasRef }) => {
  const { points: roomPoints, isClosed } = useRoomState();
  const { objects: furnitureObjects } = useFurnitureState();
  const { viewDirection, mode } = useUIState();
  const [isRendering, setIsRendering] = useState(false);
  
  // Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(60, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000);
    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Clean up function
    return () => {
      if (rendererRef.current) {
        // Dispose resources
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            } else if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            }
          }
        });
        
        // Remove the canvas
        rendererRef.current.dispose();
      }
    };
  }, [canvasRef]);
  
  // Convert 2D points to 3D shape
  const buildRoom = (scene: THREE.Scene, points: Point[]) => {
    // Convert points to Vector2 for Three.js (and scale to meters)
    const shape = new THREE.Shape();
    
    if (points.length < 3) return;
    
    // First point
    shape.moveTo(
      points[0].x * PIXEL_TO_METER,
      -points[0].y * PIXEL_TO_METER // Negate Y for correct orientation
    );
    
    // Remaining points
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(
        points[i].x * PIXEL_TO_METER,
        -points[i].y * PIXEL_TO_METER // Negate Y for correct orientation
      );
    }
    
    // Create extrusion settings
    const extrudeSettings = {
      steps: 1,
      depth: ROOM_HEIGHT,
      bevelEnabled: false,
    };
    
    // Create geometry
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Create material
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.BackSide, // Render inside faces
      roughness: 0.8,
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    
    // Position the mesh so the floor is at y=0
    mesh.position.set(0, ROOM_HEIGHT, 0);
    
    // Add to scene
    scene.add(mesh);
    
    return mesh;
  };
  
  // Add furniture to the scene
  const addFurniture = (scene: THREE.Scene) => {
    Object.values(furnitureObjects).forEach((furniture) => {
      const config = FURNITURE_3D_CONFIG[furniture.type] || { width: 0.5, depth: 0.5, height: 0.5 };
      
      // Create geometry based on furniture type
      const geometry = new THREE.BoxGeometry(config.width, config.height, config.depth);
      
      // Create material with furniture color
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(furniture.color),
        roughness: 0.7,
      });
      
      // Create mesh
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position (convert from pixels to meters)
      const x = furniture.position[0] * PIXEL_TO_METER;
      const z = -furniture.position[1] * PIXEL_TO_METER; // Negate for correct orientation
      const y = config.height / 2; // Position on the floor
      
      mesh.position.set(x, y, z);
      
      // Apply rotation (convert from degrees to radians)
      mesh.rotation.y = -THREE.MathUtils.degToRad(furniture.rotation);
      
      // Add to scene
      scene.add(mesh);
    });
  };
  
  // Function to render the 3D view
  const render = () => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current || !isClosed) {
      return;
    }
    
    setIsRendering(true);
    
    // Clear the scene
    while (sceneRef.current.children.length > 0) {
      sceneRef.current.remove(sceneRef.current.children[0]);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    sceneRef.current.add(directionalLight);
    
    // Build the room
    const roomMesh = buildRoom(sceneRef.current, roomPoints);
    
    if (roomMesh) {
      // Add furniture
      addFurniture(sceneRef.current);
      
      // Calculate room bounds
      const bbox = new THREE.Box3().setFromObject(roomMesh);
      
      // Set up camera based on viewDirection
      const cameraConfig = getCameraConfig(viewDirection, bbox);
      
      if (cameraRef.current) {
        cameraRef.current.position.copy(cameraConfig.position);
        cameraRef.current.lookAt(cameraConfig.target);
        cameraRef.current.fov = cameraConfig.fov;
        cameraRef.current.updateProjectionMatrix();
      }
      
      // Render the scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
    
    setIsRendering(false);
  };
  
  // Re-render when viewDirection changes
  useEffect(() => {
    if (mode === '3d') {
      render();
    }
  }, [viewDirection, mode]);
  
  // Expose render function as a ref property
  useEffect(() => {
    if (canvasRef.current) {
      (canvasRef.current as any).render = render;
    }
  }, [canvasRef.current]);
  
  return (
    <div className={`canvas3d-container ${mode === '3d' ? 'visible' : 'hidden'}`}>
      {isRendering && <div className="rendering-indicator">Rendering...</div>}
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  );
};

export default Canvas3D;