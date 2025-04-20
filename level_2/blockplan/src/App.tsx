import React, { useState } from 'react';
import RoomCanvas from './components/RoomCanvas';
import FurnitureItem from './components/FurnitureItem';
import FurniturePalette from './components/FurniturePalette';
import ThreeRenderer from './components/ThreeRenderer';
import useDesignState from './utils/useDesignState';
import { Direction, Point } from './models/types';
import { exportDesignAsJSON, exportViewAsImage } from './utils/exportUtils';
import { Layer, Circle, Stage } from 'react-konva';
import Konva from 'konva';

const App: React.FC = () => {
  const {
    designState,
    selectedFurnitureId,
    selectedColor,
    isDrawingMode,
    updateRoomOutline,
    addFurniture,
    selectFurniture,
    moveFurniture,
    rotateFurniture,
    deleteFurniture,
    updateViewPoint,
    updateViewDirection,
    changeSelectedColor,
    toggleDrawingMode,
    resetRoom
  } = useDesignState();

  const [showControls, setShowControls] = useState<boolean>(true);

  // Canvas dimensions
  const canvasWidth = 600;
  const canvasHeight = 400;
  const rendererWidth = 600;
  const rendererHeight = 400;
  const pixelsPerMeter = 50; // 1 meter = 50 pixels

  // Handle keydown events (for delete)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && selectedFurnitureId) {
      deleteFurniture(selectedFurnitureId);
    }
  };

  // Handle view point selection
  const handleViewPointSelect = (e: any) => {
    if (isDrawingMode) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    // Convert to design coordinates
    const designPoint: Point = {
      x: point.x / pixelsPerMeter,
      y: point.y / pixelsPerMeter
    };
    
    updateViewPoint(designPoint);
  };

  return (
    <div 
      className="app" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      <header style={{ marginBottom: '20px' }}>
        <h1>BlockPlan - Living Room Designer</h1>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '10px' 
        }}>
          <div>
            <button 
              onClick={toggleDrawingMode}
              style={{
                backgroundColor: isDrawingMode ? '#4CAF50' : '#f0f0f0',
                padding: '8px 16px',
                marginRight: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {isDrawingMode ? 'Exit Drawing Mode' : 'Draw Room'}
            </button>
            
            <button 
              onClick={resetRoom}
              style={{
                padding: '8px 16px',
                marginRight: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reset Room
            </button>
          </div>
          
          <div>
            <button 
              onClick={() => exportDesignAsJSON(designState)}
              style={{
                padding: '8px 16px',
                marginRight: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Export JSON
            </button>
            
            <button 
              onClick={() => exportViewAsImage('three-view')}
              style={{
                padding: '8px 16px',
                marginRight: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Export 3D View
            </button>
          </div>
        </div>
      </header>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        gap: '20px',
        alignItems: 'flex-start'
      }}>
        {/* Left sidebar */}
        <div style={{ 
          width: '250px', 
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <FurniturePalette
            onAddFurniture={addFurniture}
            selectedColor={selectedColor}
            onColorChange={changeSelectedColor}
          />
          
          <h3>View Direction</h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr',
            gap: '5px',
            marginTop: '10px'
          }}>
            <div></div>
            <button 
              onClick={() => updateViewDirection(Direction.North)}
              style={{
                padding: '8px',
                backgroundColor: designState.viewDirection === Direction.North 
                  ? '#4CAF50' : '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              N
            </button>
            <div></div>
            <button 
              onClick={() => updateViewDirection(Direction.West)}
              style={{
                padding: '8px',
                backgroundColor: designState.viewDirection === Direction.West 
                  ? '#4CAF50' : '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              W
            </button>
            <div></div>
            <button 
              onClick={() => updateViewDirection(Direction.East)}
              style={{
                padding: '8px',
                backgroundColor: designState.viewDirection === Direction.East 
                  ? '#4CAF50' : '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              E
            </button>
            <div></div>
            <button 
              onClick={() => updateViewDirection(Direction.South)}
              style={{
                padding: '8px',
                backgroundColor: designState.viewDirection === Direction.South 
                  ? '#4CAF50' : '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              S
            </button>
            <div></div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h3>Instructions</h3>
            <p style={{ fontSize: '14px' }}>
              • Draw room: Click "Draw Room" button and click to place points
              <br />
              • Add furniture: Click on an item in the palette
              <br />
              • Move furniture: Drag and drop
              <br />
              • Rotate furniture: Double-click on furniture
              <br />
              • Delete furniture: Select and press Delete key
              <br />
              • Set viewpoint: Click anywhere in the room
              <br />
              • Change view direction: Use the N,S,E,W buttons
            </p>
          </div>
        </div>
        
        {/* Main content area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 2D Plan View */}
          <div style={{ 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <h2 style={{ padding: '10px', margin: 0, backgroundColor: '#f0f0f0' }}>
              Floor Plan
            </h2>
            
            <div style={{ position: 'relative' }}>
              {/* Room Canvas */}
              <RoomCanvas
                roomOutline={designState.roomOutline}
                onRoomUpdate={updateRoomOutline}
                gridSize={designState.gridSize * pixelsPerMeter}
                width={canvasWidth}
                height={canvasHeight}
                isDrawingMode={isDrawingMode}
              />
              
              {/* Furniture Layer */}
              {!isDrawingMode && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0,
                    width: canvasWidth,
                    height: canvasHeight
                  }}
                  onClick={handleViewPointSelect}
                >
                  <Stage width={canvasWidth} height={canvasHeight}>
                    <Layer>
                      {/* Furniture items */}
                      {designState.furniture.map(item => (
                        <FurnitureItem
                          key={item.id}
                          furniture={{
                            ...item,
                            position: {
                              x: item.position.x * pixelsPerMeter,
                              y: item.position.y * pixelsPerMeter
                            }
                          }}
                          isSelected={item.id === selectedFurnitureId}
                          onSelect={selectFurniture}
                          onDragEnd={(id, position) => moveFurniture(id, {
                            x: position.x / pixelsPerMeter,
                            y: position.y / pixelsPerMeter
                          })}
                          onRotate={rotateFurniture}
                          scale={pixelsPerMeter}
                        />
                      ))}
                      
                      {/* View Point */}
                      <Circle
                        x={designState.viewPoint.x * pixelsPerMeter}
                        y={designState.viewPoint.y * pixelsPerMeter}
                        radius={8}
                        fill="red"
                      />
                    </Layer>
                  </Stage>
                </div>
              )}
            </div>
          </div>
          
          {/* 3D View */}
          <div 
            id="three-view" 
            style={{ 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <h2 style={{ padding: '10px', margin: 0, backgroundColor: '#f0f0f0' }}>
              3D View
            </h2>
            <ThreeRenderer
              design={designState}
              width={rendererWidth}
              height={rendererHeight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;