import * as THREE from 'three';
import { Furniture, RoomVertex, FurnitureType } from '../../models/types';

// Maps 2D objects to 3D meshes
export class ObjectMapper {
  private static furnitureGeometries: Record<FurnitureType, (furniture: Furniture) => THREE.BufferGeometry> = {
    couch: (furniture) => {
      const { width, depth, height } = furniture;
      // Scale factor (pixel to meter conversion)
      const scale = 0.02; // 50 pixels = 1 meter
      
      // Create base
      const baseGeometry = new THREE.BoxGeometry(
        width * scale, 
        height * scale * 0.4, 
        depth * scale
      );
      
      // Create backrest
      const backGeometry = new THREE.BoxGeometry(
        width * scale,
        height * scale * 0.6,
        depth * scale * 0.3
      );
      
      // Position the backrest
      const backMatrix = new THREE.Matrix4().makeTranslation(
        0,
        height * scale * 0.2,
        -depth * scale * 0.35
      );
      backGeometry.applyMatrix4(backMatrix);
      
      // Merge geometries
      return mergeBufferGeometries([baseGeometry, backGeometry]);
    },
    
    bench: (furniture) => {
      const { width, depth, height } = furniture;
      const scale = 0.02;
      
      // Simple rectangular bench
      return new THREE.BoxGeometry(
        width * scale,
        height * scale * 0.4,
        depth * scale
      );
    },
    
    tv: (furniture) => {
      const { width, depth, height } = furniture;
      const scale = 0.02;
      
      // TV screen
      const screenGeometry = new THREE.BoxGeometry(
        width * scale,
        height * scale * 0.8,
        depth * scale * 0.2
      );
      
      // TV stand
      const standGeometry = new THREE.BoxGeometry(
        width * scale * 0.5,
        height * scale * 0.2,
        depth * scale
      );
      
      // Position the stand
      const standMatrix = new THREE.Matrix4().makeTranslation(
        0,
        -height * scale * 0.4,
        depth * scale * 0.4
      );
      standGeometry.applyMatrix4(standMatrix);
      
      return mergeBufferGeometries([screenGeometry, standGeometry]);
    },
    
    mirror: (furniture) => {
      const { width, height } = furniture;
      const scale = 0.02;
      
      // Flat mirror surface
      return new THREE.BoxGeometry(
        width * scale,
        height * scale,
        0.02 * 0.1 // Very thin depth
      );
    },
    
    plant: (furniture) => {
      const { width, height } = furniture;
      const scale = 0.02;
      
      // Pot geometry
      const potGeometry = new THREE.CylinderGeometry(
        width * scale * 0.5,
        width * scale * 0.3,
        height * scale * 0.2,
        8
      );
      
      // Base position adjustment
      const potMatrix = new THREE.Matrix4().makeTranslation(
        0,
        -height * scale * 0.4,
        0
      );
      potGeometry.applyMatrix4(potMatrix);
      
      // Plant foliage (simplified as a cone)
      const foliageGeometry = new THREE.ConeGeometry(
        width * scale * 0.7,
        height * scale * 0.8,
        8
      );
      
      // Position foliage
      const foliageMatrix = new THREE.Matrix4().makeTranslation(
        0,
        height * scale * 0.1,
        0
      );
      foliageGeometry.applyMatrix4(foliageMatrix);
      
      return mergeBufferGeometries([potGeometry, foliageGeometry]);
    },
    
    lamp: (furniture) => {
      const { width, height } = furniture;
      const scale = 0.02;
      
      // Lamp base
      const baseGeometry = new THREE.CylinderGeometry(
        width * scale * 0.3,
        width * scale * 0.4,
        height * scale * 0.1,
        8
      );
      
      // Lamp pole
      const poleGeometry = new THREE.CylinderGeometry(
        width * scale * 0.05,
        width * scale * 0.05,
        height * scale * 0.7,
        8
      );
      
      // Position pole
      const poleMatrix = new THREE.Matrix4().makeTranslation(
        0,
        height * scale * 0.35,
        0
      );
      poleGeometry.applyMatrix4(poleMatrix);
      
      // Lamp shade
      const shadeGeometry = new THREE.ConeGeometry(
        width * scale * 0.4,
        height * scale * 0.2,
        8,
        1,
        true
      );
      
      // Position shade
      const shadeMatrix = new THREE.Matrix4().makeTranslation(
        0,
        height * scale * 0.75,
        0
      );
      shadeGeometry.applyMatrix4(shadeMatrix);
      
      return mergeBufferGeometries([baseGeometry, poleGeometry, shadeGeometry]);
    },
    
    piano: (furniture) => {
      const { width, depth, height } = furniture;
      const scale = 0.02;
      
      // Piano base
      const baseGeometry = new THREE.BoxGeometry(
        width * scale,
        height * scale * 0.6,
        depth * scale
      );
      
      // Piano top (lid)
      const lidGeometry = new THREE.BoxGeometry(
        width * scale,
        height * scale * 0.1,
        depth * scale
      );
      
      // Position lid
      const lidMatrix = new THREE.Matrix4().makeTranslation(
        0,
        height * scale * 0.35,
        0
      );
      lidGeometry.applyMatrix4(lidMatrix);
      
      return mergeBufferGeometries([baseGeometry, lidGeometry]);
    },
    
    carpet: (furniture) => {
      const { width, height } = furniture;
      const scale = 0.02;
      
      // Simple flat rectangle
      return new THREE.BoxGeometry(
        width * scale,
        height * scale * 0.1,
        width * scale * 0.75 // Use width to calculate depth
      );
    }
  };
  
  // Create 3D mesh for furniture
  static createFurnitureMesh(furniture: Furniture): THREE.Mesh {
    const geometry = this.furnitureGeometries[furniture.type](furniture);
    
    // Create material
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(furniture.color),
      roughness: 0.7,
      metalness: 0.1
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    
    // Position in 3D space
    const scale = 0.02; // 50 pixels = 1 meter
    mesh.position.set(
      furniture.position.x * scale,
      (furniture.height * scale) / 2, // Position at half height
      furniture.position.y * scale // Y in 2D becomes Z in 3D
    );
    
    // Apply rotation (around Y axis in 3D)
    mesh.rotation.y = furniture.rotation * (Math.PI / 180);
    
    return mesh;
  }
  
  // Create room walls from vertices
  static createRoomMesh(vertices: RoomVertex[], roomHeight: number = 2.5): THREE.Mesh {
    if (vertices.length < 3) {
      return new THREE.Mesh(); // Return empty mesh
    }
    
    const scale = 0.02; // 50 pixels = 1 meter
    
    // Create wall geometry
    const shape = new THREE.Shape();
    shape.moveTo(vertices[0].x * scale, vertices[0].y * scale);
    
    for (let i = 1; i < vertices.length; i++) {
      shape.lineTo(vertices[i].x * scale, vertices[i].y * scale);
    }
    
    shape.lineTo(vertices[0].x * scale, vertices[0].y * scale); // Close the shape
    
    // Extrude the 2D shape to create walls
    const extrudeSettings = {
      steps: 1,
      depth: roomHeight,
      bevelEnabled: false
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Rotate to make Y up (instead of Z)
    geometry.rotateX(-Math.PI / 2);
    
    // Create material
    const material = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      side: THREE.BackSide, // Render inside of the walls
      roughness: 0.9,
      metalness: 0.1
    });
    
    return new THREE.Mesh(geometry, material);
  }
  
  // Create floor from vertices
  static createFloorMesh(vertices: RoomVertex[]): THREE.Mesh {
    if (vertices.length < 3) {
      return new THREE.Mesh(); // Return empty mesh
    }
    
    const scale = 0.02; // 50 pixels = 1 meter
    
    // Create floor shape
    const shape = new THREE.Shape();
    shape.moveTo(vertices[0].x * scale, vertices[0].y * scale);
    
    for (let i = 1; i < vertices.length; i++) {
      shape.lineTo(vertices[i].x * scale, vertices[i].y * scale);
    }
    
    const geometry = new THREE.ShapeGeometry(shape);
    
    // Rotate to make floor horizontal
    geometry.rotateX(-Math.PI / 2);
    
    // Create material with grid texture
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.9,
      metalness: 0.1
    });
    
    return new THREE.Mesh(geometry, material);
  }
}

// Helper function to merge geometries
function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  // Create a single buffer geometry
  const mergedGeometry = new THREE.BufferGeometry();
  
  // Collect all attributes
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  
  let indexOffset = 0;
  const indices: number[] = [];
  
  // Process each geometry
  geometries.forEach(geometry => {
    // Get position attribute
    const positionAttribute = geometry.getAttribute('position');
    for (let i = 0; i < positionAttribute.count; i++) {
      positions.push(
        positionAttribute.getX(i),
        positionAttribute.getY(i),
        positionAttribute.getZ(i)
      );
    }
    
    // Get normal attribute
    const normalAttribute = geometry.getAttribute('normal');
    if (normalAttribute) {
      for (let i = 0; i < normalAttribute.count; i++) {
        normals.push(
          normalAttribute.getX(i),
          normalAttribute.getY(i),
          normalAttribute.getZ(i)
        );
      }
    }
    
    // Get uv attribute
    const uvAttribute = geometry.getAttribute('uv');
    if (uvAttribute) {
      for (let i = 0; i < uvAttribute.count; i++) {
        uvs.push(
          uvAttribute.getX(i),
          uvAttribute.getY(i)
        );
      }
    }
    
    // Get indices
    if (geometry.index) {
      for (let i = 0; i < geometry.index.count; i++) {
        indices.push(geometry.index.getX(i) + indexOffset);
      }
    } else {
      // If no indices, create them
      for (let i = 0; i < positionAttribute.count; i++) {
        indices.push(i + indexOffset);
      }
    }
    
    indexOffset += positionAttribute.count;
  });
  
  // Set attributes
  mergedGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  
  if (normals.length > 0) {
    mergedGeometry.setAttribute(
      'normal',
      new THREE.Float32BufferAttribute(normals, 3)
    );
  }
  
  if (uvs.length > 0) {
    mergedGeometry.setAttribute(
      'uv',
      new THREE.Float32BufferAttribute(uvs, 2)
    );
  }
  
  // Set indices
  mergedGeometry.setIndex(indices);
  
  // Compute vertex normals if they don't exist
  if (normals.length === 0) {
    mergedGeometry.computeVertexNormals();
  }
  
  return mergedGeometry;
}