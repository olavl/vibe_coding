import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { DesignState, Direction, Point } from '../models/types';

interface ThreeRendererProps {
  design: DesignState;
  width: number;
  height: number;
}

const ThreeRenderer: React.FC<ThreeRendererProps> = ({ design, width, height }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene if it doesn't exist
    if (!sceneRef.current) {
      sceneRef.current = new THREE.Scene();
      sceneRef.current.background = new THREE.Color(0xf0f0f0);

      // Create renderer
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setSize(width, height);
      mountRef.current.appendChild(rendererRef.current.domElement);

      // Create camera
      cameraRef.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      cameraRef.current.position.set(0, 3, 5);
      cameraRef.current.lookAt(0, 0, 0);

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      sceneRef.current.add(ambientLight);

      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(2, 4, 3);
      sceneRef.current.add(directionalLight);
    }

    // Clear scene for re-rendering
    while (sceneRef.current.children.length > 0) {
      const object = sceneRef.current.children[0];
      if (object instanceof THREE.Light) {
        // Skip removing lights
        sceneRef.current.remove(sceneRef.current.children[1]);
      } else {
        sceneRef.current.remove(object);
      }
    }

    // Create room walls
    createRoom(design);

    // Add furniture
    design.furniture.forEach(item => {
      createFurniture(item);
    });

    // Position camera based on viewpoint and direction
    positionCamera(design.viewPoint, design.viewDirection);

    // Render scene
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    // Cleanup function
    return () => {
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [design, width, height]);

  const createRoom = (design: DesignState) => {
    if (!sceneRef.current) return;

    const { roomOutline } = design;
    const points = roomOutline.points;

    if (points.length < 3) return;

    // Create shape from points
    const shape = new THREE.Shape();
    shape.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
    }
    shape.lineTo(points[0].x, points[0].y);

    // Create floor
    const floorGeometry = new THREE.ShapeGeometry(shape);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee, 
      side: THREE.DoubleSide 
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = 0;
    sceneRef.current.add(floor);

    // Create walls
    const wallHeight = 2.5;
    const extrudeSettings = {
      steps: 1,
      depth: wallHeight,
      bevelEnabled: false
    };

    const wallGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      side: THREE.BackSide 
    });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.y = 0;
    sceneRef.current.add(walls);
  };

  const createFurniture = (item: any) => {
    if (!sceneRef.current) return;

    // Create furniture based on type
    const geometry = new THREE.BoxGeometry(item.width, item.height, item.depth);
    const material = new THREE.MeshStandardMaterial({ color: item.color });
    const mesh = new THREE.Mesh(geometry, material);

    // Position furniture
    mesh.position.set(
      item.position.x + item.width / 2, 
      item.height / 2,  // Half height up from the floor
      item.position.y + item.depth / 2
    );

    // Apply rotation
    mesh.rotation.y = (item.rotation * Math.PI) / 180;

    sceneRef.current.add(mesh);
  };

  const positionCamera = (viewPoint: Point, direction: Direction) => {
    if (!cameraRef.current) return;

    // Position camera 2 meters high
    const cameraHeight = 1.7;

    // Position based on view direction
    switch (direction) {
      case Direction.North:
        cameraRef.current.position.set(viewPoint.x, cameraHeight, viewPoint.y + 5);
        cameraRef.current.lookAt(viewPoint.x, cameraHeight, viewPoint.y);
        break;
      case Direction.South:
        cameraRef.current.position.set(viewPoint.x, cameraHeight, viewPoint.y - 5);
        cameraRef.current.lookAt(viewPoint.x, cameraHeight, viewPoint.y);
        break;
      case Direction.East:
        cameraRef.current.position.set(viewPoint.x - 5, cameraHeight, viewPoint.y);
        cameraRef.current.lookAt(viewPoint.x, cameraHeight, viewPoint.y);
        break;
      case Direction.West:
        cameraRef.current.position.set(viewPoint.x + 5, cameraHeight, viewPoint.y);
        cameraRef.current.lookAt(viewPoint.x, cameraHeight, viewPoint.y);
        break;
    }
  };

  const captureScreenshot = () => {
    if (!rendererRef.current) return null;
    return rendererRef.current.domElement.toDataURL('image/png');
  };

  return (
    <div className="three-renderer">
      <div ref={mountRef} style={{ width: `${width}px`, height: `${height}px` }} />
    </div>
  );
};

export default ThreeRenderer;