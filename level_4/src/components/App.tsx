import React from 'react';
import ToolBar from './ToolBar';
import Canvas2D from './Canvas2D';
import Canvas3D from './Canvas3D';
import ObjectPalette from './ObjectPalette';
import PropertiesPanel from './PropertiesPanel';
import ViewSelector from './ViewSelector';
import { useAppStore } from '../store/appStore';

const App: React.FC = () => {
  const { mode } = useAppStore();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ToolBar />
      
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {mode !== '3d' && <ObjectPalette />}
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexGrow: 1,
          padding: '20px',
          overflow: 'auto'
        }}>
          {mode !== '3d' ? <Canvas2D /> : <Canvas3D />}
          
          {mode === '3d' && <ViewSelector />}
        </div>
        
        {mode === 'object' && <PropertiesPanel />}
      </div>
    </div>
  );
};

export default App;