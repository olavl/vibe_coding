import React, { useCallback } from 'react';
import { Rect, Group, Text } from 'react-konva';
import { useAppStore } from '../../models/store';
import { snapToGrid, isPointInPolygon } from '../../utils/geometryUtils';
import { Furniture } from '../../models/types';

interface FurnitureManagerProps {
  isActive: boolean;
}

const FurnitureManager: React.FC<FurnitureManagerProps> = ({ isActive }) => {
  const { 
    furniture, 
    updateFurniture, 
    removeFurniture, 
    room, 
    gridSize, 
    activeToolMode,
    selectedFurnitureId,
    setSelectedFurniture
  } = useAppStore();
  
  const handleFurnitureDrag = useCallback((id: string, x: number, y: number) => {
    const snappedPosition = snapToGrid({ x, y }, gridSize);
    
    // Ensure furniture stays within room boundaries
    if (isPointInPolygon(snappedPosition, room.vertices)) {
      updateFurniture(id, { position: snappedPosition });
    }
  }, [updateFurniture, gridSize, room.vertices]);
  
  const handleFurnitureRotate = useCallback((id: string, rotation: number) => {
    // Snap rotation to 15-degree increments
    const snappedRotation = Math.round(rotation / 15) * 15;
    updateFurniture(id, { rotation: snappedRotation });
  }, [updateFurniture]);
  
  const handleFurnitureClick = useCallback((id: string) => {
    if (activeToolMode === 'delete') {
      removeFurniture(id);
    } else {
      setSelectedFurniture(id);
    }
  }, [activeToolMode, removeFurniture, setSelectedFurniture]);
  
  const renderFurnitureItem = (item: Furniture) => {
    const isSelected = item.id === selectedFurnitureId;
    
    return (
      <Group
        key={item.id}
        x={item.position.x}
        y={item.position.y}
        rotation={item.rotation}
        draggable={isActive && activeToolMode === 'move'}
        onClick={() => handleFurnitureClick(item.id)}
        onDragMove={(e) => {
          handleFurnitureDrag(item.id, e.target.x(), e.target.y());
        }}
        onTransformEnd={(e) => {
          // Handle rotation from transform
          const node = e.target;
          handleFurnitureRotate(item.id, node.rotation());
        }}
      >
        <Rect
          width={item.width * gridSize / 5}
          height={item.depth * gridSize / 5}
          offsetX={(item.width * gridSize / 5) / 2}
          offsetY={(item.depth * gridSize / 5) / 2}
          fill={item.color}
          stroke={isSelected ? '#ffcc00' : '#666666'}
          strokeWidth={isSelected ? 2 : 1}
          cornerRadius={2}
        />
        <Text
          text={item.type}
          fontSize={12}
          fill="#ffffff"
          offsetX={-5}
          offsetY={-5}
          width={item.width * gridSize / 5}
          height={item.depth * gridSize / 5}
          align="center"
          verticalAlign="middle"
        />
      </Group>
    );
  };
  
  return (
    <Group>
      {furniture.map(renderFurnitureItem)}
    </Group>
  );
};

export default FurnitureManager;