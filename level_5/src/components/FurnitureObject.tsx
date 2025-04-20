import React from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';
import { FurnitureObject } from '../store/furnitureState';
import { snapToGrid } from '../utils/snapToGrid';

// Furniture dimensions and colors
const FURNITURE_CONFIG: Record<string, { width: number; height: number; label: string }> = {
  couch: { width: 200, height: 80, label: 'Couch' },
  lamp: { width: 40, height: 40, label: 'Lamp' },
  tv: { width: 120, height: 20, label: 'TV' },
  mirror: { width: 80, height: 10, label: 'Mirror' },
  carpet: { width: 200, height: 150, label: 'Carpet' },
  bench: { width: 120, height: 40, label: 'Bench' },
  piano: { width: 150, height: 80, label: 'Piano' },
  plant: { width: 50, height: 50, label: 'Plant' },
};

interface FurnitureItemProps {
  furniture: FurnitureObject;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (delta: Partial<FurnitureObject>) => void;
}

export const FurnitureItem: React.FC<FurnitureItemProps> = ({
  furniture,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const config = FURNITURE_CONFIG[furniture.type] || { width: 50, height: 50, label: 'Item' };
  
  // Handle furniture dragging
  const handleDragEnd = (e: any) => {
    const pos = snapToGrid({
      x: e.target.x(),
      y: e.target.y(),
    });
    
    onUpdate({
      position: [pos.x, pos.y],
    });
  };
  
  // Handle rotation from rotation handle
  const handleRotateEnd = (e: any) => {
    e.cancelBubble = true; // Stop event propagation
    
    // Increment rotation by 90 degrees
    const newRotation = (furniture.rotation + 90) % 360;
    onUpdate({ rotation: newRotation });
  };
  
  return (
    <Group
      x={furniture.position[0]}
      y={furniture.position[1]}
      rotation={furniture.rotation}
      draggable
      onDragEnd={handleDragEnd}
      onClick={() => onSelect()}
      onTap={() => onSelect()}
    >
      {/* Furniture shape */}
      <Rect
        width={config.width}
        height={config.height}
        fill={furniture.color}
        strokeWidth={isSelected ? 2 : 1}
        stroke={isSelected ? "#0088FF" : "#000000"}
        offsetX={config.width / 2}
        offsetY={config.height / 2}
      />
      
      {/* Label */}
      <Text
        text={config.label}
        fontSize={14}
        fill="#000"
        offsetX={config.width / 2}
        offsetY={config.height / 2}
        align="center"
        verticalAlign="middle"
        width={config.width}
        height={config.height}
      />
      
      {/* Rotation handle (only when selected) */}
      {isSelected && (
        <Circle
          x={0}
          y={-(config.height / 2 + 25)}
          radius={10}
          fill="#0088FF"
          draggable
          onDragEnd={handleRotateEnd}
          onClick={handleRotateEnd}
          onTap={handleRotateEnd}
        />
      )}
    </Group>
  );
};