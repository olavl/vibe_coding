import React from 'react';
import { Rect, Group, Text } from 'react-konva';
import { FurnitureObject } from '../models/types';

interface FurnitureItemProps {
  furniture: FurnitureObject;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, position: { x: number; y: number }) => void;
  onRotate: (id: string, rotation: number) => void;
  scale: number;
}

const FurnitureItem: React.FC<FurnitureItemProps> = ({
  furniture,
  isSelected,
  onSelect,
  onDragEnd,
  onRotate,
  scale
}) => {
  const { id, position, rotation, width, height, color, type } = furniture;
  
  // Scale from meters to pixels
  const pixelWidth = width * scale;
  const pixelHeight = height * scale;
  
  const handleDragEnd = (e: any) => {
    onDragEnd(id, { x: e.target.x(), y: e.target.y() });
  };
  
  const handleRotate = () => {
    // Rotate by 90 degrees
    const newRotation = (rotation + 90) % 360;
    onRotate(id, newRotation);
  };
  
  return (
    <Group
      x={position.x}
      y={position.y}
      rotation={rotation}
      draggable
      onDragEnd={handleDragEnd}
      onMouseDown={() => onSelect(id)}
      onTap={() => onSelect(id)}
      onDblClick={handleRotate}
      onDblTap={handleRotate}
    >
      <Rect
        width={pixelWidth}
        height={pixelHeight}
        fill={color}
        stroke={isSelected ? '#0000FF' : '#000000'}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={3}
      />
      <Text
        text={type}
        fontSize={12}
        fill="#000"
        width={pixelWidth}
        height={pixelHeight}
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
};

export default FurnitureItem;