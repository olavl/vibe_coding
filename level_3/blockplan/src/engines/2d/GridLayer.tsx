import React from 'react';
import { Line, Group } from 'react-konva';
import { useAppStore } from '../../models/store';

interface GridLayerProps {
  width: number;
  height: number;
}

const GridLayer: React.FC<GridLayerProps> = ({ width, height }) => {
  const { gridSize } = useAppStore();
  
  const renderGrid = () => {
    const lines = [];
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, height]}
          stroke="#555555"
          strokeWidth={x % (gridSize * 2) === 0 ? 0.5 : 0.2}
          opacity={0.3}
        />
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, width, y]}
          stroke="#555555"
          strokeWidth={y % (gridSize * 2) === 0 ? 0.5 : 0.2}
          opacity={0.3}
        />
      );
    }
    
    return lines;
  };
  
  return <Group>{renderGrid()}</Group>;
};

export default GridLayer;