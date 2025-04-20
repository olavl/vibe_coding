import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Line, Circle } from 'react-konva';
import { useRoomStore } from '../store/roomStore';
import { useFurnitureStore } from '../store/furnitureStore';
import { useAppStore } from '../store/appStore';
import { Point } from '../types';
import { snapToGrid, GRID_SIZE, SCALE } from '../utils/grid';
import FurnitureObject from './FurnitureObject';

const GRID_COLOR = '#ddd';
const ROOM_COLOR = '#333';
const POINT_COLOR = '#666';
const PREVIEW_COLOR = '#999';
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const CLOSE_THRESHOLD = GRID_SIZE * SCALE * 0.5;

const Canvas2D: React.FC = () => {
  const stageRef = useRef<any>(null);
  const [hoverPoint, setHoverPoint] = useState<Point | null>(null);
  const { points, isClosed, addPoint, closePolygon } = useRoomStore();
  const { objects, selectedId, select } = useFurnitureStore();
  const { mode } = useAppStore();

  // Calculate grid lines
  const gridLines = [];
  const gridCells = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) / (GRID_SIZE * SCALE);
  
  // Horizontal lines
  for (let i = 0; i <= gridCells; i++) {
    gridLines.push(
      <Line
        key={`h-${i}`}
        points={[0, i * GRID_SIZE * SCALE, CANVAS_WIDTH, i * GRID_SIZE * SCALE]}
        stroke={GRID_COLOR}
        strokeWidth={1}
      />
    );
  }
  
  // Vertical lines
  for (let i = 0; i <= gridCells; i++) {
    gridLines.push(
      <Line
        key={`v-${i}`}
        points={[i * GRID_SIZE * SCALE, 0, i * GRID_SIZE * SCALE, CANVAS_HEIGHT]}
        stroke={GRID_COLOR}
        strokeWidth={1}
      />
    );
  }

  const handleCanvasClick = (e: any) => {
    if (mode !== 'sketch' || isClosed) return;
    
    const stage = stageRef.current;
    const pointerPosition = stage.getPointerPosition();
    
    const snappedPoint = snapToGrid({
      x: pointerPosition.x,
      y: pointerPosition.y,
    });
    
    // If we're close to the starting point and have at least 3 points, close the polygon
    if (points.length >= 3) {
      const startPoint = points[0];
      const distance = Math.sqrt(
        Math.pow(startPoint.x - snappedPoint.x, 2) + 
        Math.pow(startPoint.y - snappedPoint.y, 2)
      );
      
      if (distance < CLOSE_THRESHOLD) {
        closePolygon();
        return;
      }
    }
    
    addPoint(snappedPoint);
  };

  const handleMouseMove = (e: any) => {
    if (mode !== 'sketch' || isClosed) return;
    
    const stage = stageRef.current;
    const pointerPosition = stage.getPointerPosition();
    
    setHoverPoint(snapToGrid({
      x: pointerPosition.x,
      y: pointerPosition.y,
    }));
  };

  const handleCanvasObjectClick = (e: React.MouseEvent) => {
    if (mode !== 'object') return;

    // If we clicked the canvas (not a furniture object), deselect
    if (e.target === e.currentTarget) {
      select(null);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Stage
        ref={stageRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        style={{ 
          border: '1px solid #ccc',
          background: '#fff',
          cursor: mode === 'sketch' && !isClosed ? 'crosshair' : 'default'
        }}
      >
        <Layer>
          {/* Grid */}
          {gridLines}
          
          {/* Room Polygon */}
          {points.length > 0 && (
            <>
              <Line
                points={points.flatMap(p => [p.x, p.y]).concat(isClosed ? [points[0].x, points[0].y] : [])}
                stroke={ROOM_COLOR}
                strokeWidth={2}
                closed={isClosed}
              />
              
              {/* Points */}
              {points.map((point, index) => (
                <Circle
                  key={index}
                  x={point.x}
                  y={point.y}
                  radius={4}
                  fill={POINT_COLOR}
                />
              ))}
            </>
          )}
          
          {/* Preview Line */}
          {!isClosed && points.length > 0 && hoverPoint && (
            <Line
              points={[
                points[points.length - 1].x,
                points[points.length - 1].y,
                hoverPoint.x,
                hoverPoint.y,
              ]}
              stroke={PREVIEW_COLOR}
              strokeWidth={2}
              dash={[5, 5]}
            />
          )}
          
          {/* Furniture Objects */}
          {Object.values(objects).map((obj) => (
            <FurnitureObject
              key={obj.id}
              object={obj}
              isSelected={obj.id === selectedId}
              isActive={mode === 'object'}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas2D;