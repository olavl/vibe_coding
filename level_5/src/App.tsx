import { useRef } from 'react';
import './App.css';
import Canvas2D from './components/Canvas2D';
import Canvas3D from './components/Canvas3D';
import ObjectPalette from './components/ObjectPalette';
import PropertiesPanel from './components/PropertiesPanel';
import Toolbar from './components/Toolbar';
import ViewSelector from './components/ViewSelector';
import { useUIState } from './store/uiState';

function App() {
  const { mode } = useUIState();
  const canvas3DRef = useRef<HTMLCanvasElement>(null);
  
  const handleRender3D = () => {
    if (canvas3DRef.current && 'render' in canvas3DRef.current) {
      (canvas3DRef.current as any).render();
    }
  };
  
  return (
    <div className="app">
      <h1>BlockPlan - Living Room Edition</h1>
      
      <Toolbar on3DRender={handleRender3D} canvasRef={canvas3DRef} />
      
      <div className="main-content">
        <div className="sidebar left">
          <ObjectPalette />
          {mode === '3d' && <ViewSelector />}
        </div>
        
        <div className="canvas-container">
          <Canvas2D />
          <Canvas3D canvasRef={canvas3DRef} />
        </div>
        
        <div className="sidebar right">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}

export default App;