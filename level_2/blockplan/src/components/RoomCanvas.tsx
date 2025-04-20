import React, { useRef, useState } from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';
import { Point, RoomOutline } from '../models/types';
import { snapToGrid } from '../utils/designUtils';

interface RoomCanvasProps {
  roomOutline: RoomOutline;
  onRoomUpdate: (outline: RoomOutline) => void;
  gridSize: number;
  width: number;
  height: number;
  isDrawingMode: boolean;
}

const RoomCanvas: React.FC<RoomCanvasProps> = ({
  roomOutline,
  onRoomUpdate,
  gridSize,
  width,
  height,
  isDrawingMode
}) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [tempPoints, setTempPoints] = useState<Point[]>([]);
  const stageRef = useRef<any>(null);

  const handleMouseDown = (e: any) => {
    if (!isDrawingMode) return;
    
    // Get mouse position relative to stage
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const snappedPoint = snapToGrid({ x: point.x, y: point.y }, gridSize);
    
    // Start a new drawing
    setIsDrawing(true);
    setTempPoints([snappedPoint]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !isDrawingMode) return;
    
    // Get mouse position and update the temporary points
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const snappedPoint = snapToGrid({ x: point.x, y: point.y }, gridSize);
    
    // Update temporary points
    setTempPoints([...tempPoints.slice(0, -1), snappedPoint]);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !isDrawingMode) return;
    
    // Finish drawing
    if (tempPoints.length >= 3) {
      // Close the polygon by adding the first point again
      const closedPoints = [...tempPoints, tempPoints[0]];
      onRoomUpdate({ points: closedPoints });
    }
    
    setIsDrawing(false);
    setTempPoints([]);
  };

  const handleClick = (e: any) => {
    if (!isDrawingMode) return;
    
    // Get mouse position relative to stage
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const snappedPoint = snapToGrid({ x: point.x, y: point.y }, gridSize);
    
    // Add point to temporary points
    if (isDrawing) {
      setTempPoints([...tempPoints, snappedPoint]);
    } else {
      setIsDrawing(true);
      setTempPoints([snappedPoint]);
    }
  };

  // Draw grid
  const renderGrid = () => {
    const lines = [];
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, height]}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, width, y]}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }
    return lines;
  };

  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      ref={stageRef}
    >
      <Layer>
        {/* Grid */}
        {renderGrid()}
        
        {/* Room outline */}
        {roomOutline.points.length > 0 && (
          <Line
            points={roomOutline.points.flatMap(point => [point.x, point.y])}
            stroke="#333"
            strokeWidth={2}
            closed={true}
            fill="rgba(200, 200, 200, 0.3)"
          />
        )}
        
        {/* Temporary drawing */}
        {tempPoints.length > 0 && isDrawing && (
          <Line
            points={tempPoints.flatMap(point => [point.x, point.y])}
            stroke="#333"
            strokeWidth={2}
            dash={[5, 5]}
          />
        )}
        
        {/* Points of the room */}
        {roomOutline.points.map((point, index) => (
          <Circle
            key={index}
            x={point.x}
            y={point.y}
            radius={4}
            fill="#333"
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default RoomCanvas;