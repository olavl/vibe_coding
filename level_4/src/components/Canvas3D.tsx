import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useRoomStore } from '../store/roomStore';
import { useFurnitureStore } from '../store/furnitureStore';
import { useAppStore } from '../store/appStore';
import { FURNITURE_SIZES, FURNITURE_COLORS } from '../utils/colors';
import { getCameraConfig } from '../utils/viewpointMapper';
import { Point } from '../types';

const ROOM_HEIGHT = 2.5; // 2.5 meters
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const Canvas3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { points, isClosed } = useRoomStore();
  const { objects } = useFurnitureStore();
  const { viewDirection } = useAppStore();
  
  // Create a THREE.js vector from a 2D point
  const pointToVector = (point: Point): THREE.Vector2 => {
    return new THREE.Vector2(point.x / 100, -point.y / 100);
  };
  
  // Function to convert 2D points to 3D shape
  const createRoomShape = (points: Point[]): THREE.Shape => {
    const shape = new THREE.Shape();
    
    if (points.length > 0) {
      shape.moveTo(points[0].x / 100, -points[0].y / 100); // Convert pixels to meters
      
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i].x / 100, -points[i].y / 100);
      }
      
      shape.closePath();
    }
    
    return shape;
  };
  
  useEffect(() => {
    if (!canvasRef.current || !isClosed || points.length < 3) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Create room
    const roomShape = createRoomShape(points);
    const extrudeSettings = {
      depth: ROOM_HEIGHT,
      bevelEnabled: false,
    };
    
    const roomGeometry = new THREE.ExtrudeGeometry(roomShape, extrudeSettings);
    const roomMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
      roughness: 0.8,
    });
    
    const room = new THREE.Mesh(roomGeometry, roomMaterial);
    scene.add(room);
    
    // Create floor
    const floorShape = createRoomShape(points);
    const floorGeometry = new THREE.ShapeGeometry(floorShape);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      side: THREE.DoubleSide,
      roughness: 0.9,
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);
    
    // Add furniture
    Object.values(objects).forEach((obj) => {
      const [width, height] = FURNITURE_SIZES[obj.type] || [0.5, 0.5];
      const color = obj.color || FURNITURE_COLORS[obj.type] || '#888';
      
      // Convert to meters from pixel coordinates
      const x = obj.position[0] / 100;
      const z = -obj.position[1] / 100;
      
      let geometry;
      
      // Different shapes based on furniture type
      if (obj.type === 'lamp' || obj.type === 'plant') {
        geometry = new THREE.CylinderGeometry(
          width / 200, // top radius in meters
          width / 200, // bottom radius
          height / 100, // height in meters
          32
        );
      } else {
        geometry = new THREE.BoxGeometry(
          width / 100, // width in meters
          height / 100, // height in meters
          width / 100 // depth in meters
        );
      }
      
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.7,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position furniture
      mesh.position.set(x, height / 200, z); // Slightly raise off the floor
      mesh.rotation.y = THREE.MathUtils.degToRad(obj.rotation);
      
      scene.add(mesh);
    });
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Calculate room bounds for camera positioning
    const boundingBox = new THREE.Box3().setFromObject(room);
    
    // Configure camera based on selected view direction
    const { position, target, fov } = getCameraConfig(viewDirection, boundingBox);
    
    const camera = new THREE.PerspectiveCamera(
      fov,
      CANVAS_WIDTH / CANVAS_HEIGHT,
      0.1,
      1000
    );
    
    camera.position.copy(position);
    camera.lookAt(target);
    
    // Render the scene
    renderer.render(scene, camera);
    
    // Clean up
    return () => {
      renderer.dispose();
    };
  }, [points, isClosed, objects, viewDirection]);
  
  return (
    <div style={{ border: '1px solid #ccc', marginTop: '20px', backgroundColor: '#f0f0f0' }}>
      {(isClosed && points.length >= 3) ? (
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      ) : (
        <div 
          style={{ 
            width: CANVAS_WIDTH, 
            height: CANVAS_HEIGHT, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: '#f9f9f9'
          }}
        >
          <p>Complete the room layout to generate a 3D view</p>
        </div>
      )}
    </div>
  );
};

export default Canvas3D;