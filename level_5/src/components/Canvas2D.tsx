import React, { useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useRoomState, Point } from '../store/roomState';
import { useFurnitureState, FurnitureObject } from '../store/furnitureState';
import { useUIState } from '../store/uiState';
import { snapToGrid } from '../utils/snapToGrid';
import { FurnitureItem } from './FurnitureObject';

// Constants based on LLD 7 - Visual Standards
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;
const GRID_SIZE = 50; // 0.5m at 100px=1m scale
const GRID_COLOR = '#DDDDDD';
const POLYGON_COLOR = '#333333';
const HOVER_LINE_COLOR = '#888888';
const CLOSE_THRESHOLD = 20; // Pixels to consider polygon closing

const Canvas2D: React.FC = () => {
  const stageRef = useRef<any>(null);
  const { mode } = useUIState();
  
  // Room state from Zustand
  const {
    points: roomPoints,
    isClosed,
    addPoint,
    closePolygon,
  } = useRoomState();
  
  // Furniture state from Zustand
  const {
    objects: furnitureObjects,
    add: addFurniture,
    update: updateFurniture,
    selectedId,
    setSelectedId,
  } = useFurnitureState();
  
  // Local component state
  const [drawPoints, setDrawPoints] = useState<Point[]>([]);
  const [hoverPoint, setHoverPoint] = useState<Point | null>(null);
  
  // Draw the grid lines
  const renderGrid = () => {
    const lines = [];
    
    // Vertical lines
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, CANVAS_HEIGHT]}
          stroke={GRID_COLOR}
          strokeWidth={1}
        />
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, CANVAS_WIDTH, y]}
          stroke={GRID_COLOR}
          strokeWidth={1}
        />
      );
    }
    
    return lines;
  };
  
  // Handle mouse click in sketch mode
  const handleDrawClick = (pos: Point) => {
    if (isClosed || mode !== 'sketch') return;
    
    const snappedPos = snapToGrid(pos);
    
    // If we have points and the click is close to the first point, close the polygon
    if (
      drawPoints.length >= 3 &&
      Math.hypot(
        snappedPos.x - drawPoints[0].x,
        snappedPos.y - drawPoints[0].y
      ) < CLOSE_THRESHOLD
    ) {
      // Save all points to the global state
      drawPoints.forEach(p => addPoint(p));
      closePolygon();
      // Clear local drawing points
      setDrawPoints([]);
    } else {
      // Add point to the drawing
      setDrawPoints([...drawPoints, snappedPos]);
    }
  };
  
  // Handle mouse move to show hover line
  const handleMouseMove = (pos: Point) => {
    if (isClosed || mode !== 'sketch' || drawPoints.length === 0) {
      setHoverPoint(null);
      return;
    }
    
    setHoverPoint(snapToGrid(pos));
  };
  
  // Handle dropping a furniture item
  const handleFurnitureDrop = (e: any) => {
    if (mode !== 'object' || !isClosed) return;
    
    e.preventDefault();
    
    // Get drop data
    const data = JSON.parse(e.dataTransfer.getData('furniture'));
    
    // Calculate position relative to stage
    const stageRect = stageRef.current.container().getBoundingClientRect();
    const x = e.clientX - stageRect.left;
    const y = e.clientY - stageRect.top;
    
    // Create a new furniture object
    const snappedPos = snapToGrid({ x, y });
    const newObject: FurnitureObject = {
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
      type: data.type,
      position: [snappedPos.x, snappedPos.y],
      rotation: 0,
      color: '#cccccc',
      variant: data.variant || 'default',
    };
    
    // Add to the state
    addFurniture(newObject);
  };
  
  // Render the canvas
  return (
    <div
      onDrop={handleFurnitureDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ border: '1px solid #ccc' }}
    >
      <Stage
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        ref={stageRef}
        onClick={(e) => {
          const pos = e.target.getStage()?.getPointerPosition();
          if (pos) handleDrawClick(pos);
        }}
        onMouseMove={(e) => {
          const pos = e.target.getStage()?.getPointerPosition();
          if (pos) handleMouseMove(pos);
        }}
      >
        <Layer>
          {/* Grid */}
          {renderGrid()}
          
          {/* Room polygon - from global state */}
          {isClosed && (
            <Line
              points={roomPoints.flatMap(p => [p.x, p.y])}
              closed
              stroke={POLYGON_COLOR}
              strokeWidth={2}
              fill={'rgba(200, 200, 200, 0.2)'}
            />
          )}
          
          {/* Current drawing - from local state */}
          {drawPoints.length > 0 && (
            <Line
              points={drawPoints.flatMap(p => [p.x, p.y])}
              stroke={POLYGON_COLOR}
              strokeWidth={2}
            />
          )}
          
          {/* Hover preview line */}
          {hoverPoint && drawPoints.length > 0 && (
            <Line
              points={[
                drawPoints[drawPoints.length - 1].x,
                drawPoints[drawPoints.length - 1].y,
                hoverPoint.x,
                hoverPoint.y,
              ]}
              stroke={HOVER_LINE_COLOR}
              strokeWidth={1}
              dash={[5, 5]}
            />
          )}
          
          {/* Furniture objects */}
          {Object.values(furnitureObjects).map((obj) => (
            <FurnitureItem
              key={obj.id}
              furniture={obj}
              isSelected={selectedId === obj.id}
              onSelect={() => setSelectedId(obj.id)}
              onUpdate={(delta) => updateFurniture(obj.id, delta)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas2D;