import React from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';
import { FurnitureObject as FurnitureObjectType } from '../types';
import { useFurnitureStore } from '../store/furnitureStore';
import { FURNITURE_SIZES, FURNITURE_COLORS } from '../utils/colors';

interface FurnitureObjectProps {
  object: FurnitureObjectType;
  isSelected: boolean;
  isActive: boolean;
}

const FurnitureObject: React.FC<FurnitureObjectProps> = ({ object, isSelected, isActive }) => {
  const { select, update } = useFurnitureStore();
  const [width, height] = FURNITURE_SIZES[object.type] || [50, 50]; // Default size
  const defaultColor = FURNITURE_COLORS[object.type] || '#888';
  const color = object.color || defaultColor;

  const handleDragEnd = (e: any) => {
    update(object.id, {
      position: [e.target.x(), e.target.y()],
    });
  };

  const handleRotate = () => {
    update(object.id, {
      rotation: (object.rotation + 90) % 360,
    });
  };

  const handleClick = (e: any) => {
    e.cancelBubble = true;
    if (isActive) {
      select(object.id);
    }
  };

  return (
    <Group
      x={object.position[0]}
      y={object.position[1]}
      rotation={object.rotation}
      draggable={isActive}
      onClick={handleClick}
      onTap={handleClick}
      onDragEnd={handleDragEnd}
    >
      {/* Furniture shape */}
      <Rect
        width={width}
        height={height}
        fill={color}
        strokeWidth={isSelected ? 2 : 1}
        stroke={isSelected ? '#3498db' : '#000'}
        cornerRadius={object.type === 'lamp' || object.type === 'plant' ? 25 : 0}
        opacity={0.8}
        offsetX={width / 2}
        offsetY={height / 2}
      />
      
      {/* Furniture label */}
      <Text
        text={object.type}
        fontSize={14}
        fill="#000"
        offsetX={width / 4}
        offsetY={height / 4}
      />
      
      {/* Rotation handle - only visible when selected */}
      {isSelected && isActive && (
        <Circle
          x={0}
          y={-height / 2 - 20}
          radius={10}
          fill="#3498db"
          stroke="#fff"
          strokeWidth={1}
          onClick={handleRotate}
          onTap={handleRotate}
        />
      )}
    </Group>
  );
};

export default FurnitureObject;