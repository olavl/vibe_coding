import React, { useCallback } from 'react';
import { Circle, Line, Group } from 'react-konva';
import { useAppStore } from '../../models/store';
import { snapToGrid, isValidPolygon } from '../../utils/geometryUtils';
import { Point } from '../../models/types';

interface SketchEditorProps {
  isActive: boolean;
}

const SketchEditor: React.FC<SketchEditorProps> = ({ isActive }) => {
  const { room, addVertex, updateVertex, removeVertex, gridSize, activeToolMode } = useAppStore();
  
  const handleVertexDrag = useCallback((id: string, point: Point) => {
    const snappedPoint = snapToGrid(point, gridSize);
    updateVertex(id, snappedPoint);
  }, [updateVertex, gridSize]);
  
  const handleCanvasClick = useCallback((e: any) => {
    if (!isActive || activeToolMode !== 'draw') return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pos = stage.getPointerPosition();
    if (!pos) return;
    
    // Convert from stage coordinates to our coordinate system
    const point = { x: pos.x, y: pos.y };
    const snappedPoint = snapToGrid(point, gridSize);
    
    // Add vertex at snapped position
    addVertex(snappedPoint);
  }, [isActive, activeToolMode, addVertex, gridSize]);
  
  const handleVertexDelete = useCallback((id: string) => {
    if (activeToolMode === 'delete') {
      removeVertex(id);
    }
  }, [activeToolMode, removeVertex]);
  
  // Create the closed polygon lines
  const createPolygonLines = () => {
    const { vertices } = room;
    if (vertices.length < 2) return null;
    
    const points: number[] = vertices.flatMap(v => [v.x, v.y]);
    
    // Close the polygon if we have at least 3 points
    if (vertices.length >= 3) {
      points.push(vertices[0].x, vertices[0].y);
    }
    
    return (
      <Line
        points={points}
        stroke="#3399ff"
        strokeWidth={2}
        closed={vertices.length >= 3}
        fill={vertices.length >= 3 && isValidPolygon(vertices) ? 'rgba(51, 153, 255, 0.1)' : undefined}
      />
    );
  };
  
  return (
    <Group onClick={handleCanvasClick}>
      {createPolygonLines()}
      
      {/* Render all vertices */}
      {room.vertices.map((vertex) => (
        <Circle
          key={vertex.id}
          x={vertex.x}
          y={vertex.y}
          radius={6}
          fill="#3399ff"
          stroke="#ffffff"
          strokeWidth={1}
          draggable={isActive && activeToolMode === 'move'}
          onDragMove={(e) => {
            handleVertexDrag(vertex.id, { x: e.target.x(), y: e.target.y() });
          }}
          onClick={() => handleVertexDelete(vertex.id)}
        />
      ))}
    </Group>
  );
};

export default SketchEditor;