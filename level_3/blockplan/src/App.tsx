import React, { useState, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import FurniturePalette from './components/FurniturePalette';
import ViewSelector from './components/ViewSelector';
import Canvas from './components/Canvas';
import Renderer from './engines/3d/Renderer';

const App: React.FC = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate layout dimensions
  const toolbarHeight = 60;
  const sidebarWidth = 220;
  const rendererHeight = Math.floor((dimensions.height - toolbarHeight) / 2);
  const canvasWidth = dimensions.width - sidebarWidth;
  const canvasHeight = dimensions.height - toolbarHeight - rendererHeight;
  
  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top toolbar */}
      <Toolbar />
      
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar with tools */}
        <div style={{ width: `${sidebarWidth}px`, display: 'flex', flexDirection: 'column' }}>
          <FurniturePalette />
          <ViewSelector />
        </div>
        
        {/* Main content area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 2D canvas */}
          <Canvas 
            width={canvasWidth} 
            height={canvasHeight} 
          />
          
          {/* 3D renderer */}
          <div style={{ height: `${rendererHeight}px` }}>
            <Renderer 
              width={canvasWidth} 
              height={rendererHeight} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;