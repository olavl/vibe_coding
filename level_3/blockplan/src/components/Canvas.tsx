import React, { useRef, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { useAppStore } from '../models/store';
import SketchEditor from '../engines/2d/SketchEditor';
import FurnitureManager from '../engines/2d/FurnitureManager';
import GridLayer from '../engines/2d/GridLayer';
import { isPointInPolygon } from '../utils/geometryUtils';

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const { 
    room, 
    activeToolMode, 
    setViewpoint, 
    viewpoint
  } = useAppStore();
  
  const stageRef = useRef<any>(null);
  
  const handleCanvasClick = useCallback(() => {
    // Only set viewpoint if not in drawing or moving mode
    if (activeToolMode !== 'draw' && activeToolMode !== 'move') {
      const stage = stageRef.current;
      const point = stage.getPointerPosition();
      
      // Check if point is inside room
      if (isPointInPolygon(point, room.vertices)) {
        setViewpoint({
          ...viewpoint,
          position: { x: point.x, y: point.y }
        });
      }
    }
  }, [activeToolMode, room.vertices, setViewpoint, viewpoint]);
  
  // Calculate scales to ensure the stage fits in the container
  const scale = 1;
  
  return (
    <div style={{ background: '#2a2a2a', flex: 1 }}>
      <Stage
        width={width}
        height={height}
        ref={stageRef}
        onClick={handleCanvasClick}
        scaleX={scale}
        scaleY={scale}
      >
        <Layer>
          {/* Grid background */}
          <GridLayer width={width} height={height} />
          
          {/* Room layout sketching */}
          <SketchEditor isActive={activeToolMode === 'draw' || activeToolMode === 'move' || activeToolMode === 'delete'} />
          
          {/* Furniture placement */}
          <FurnitureManager isActive={activeToolMode === 'move' || activeToolMode === 'delete'} />
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;