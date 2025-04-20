import React from 'react';
import './Toolbar.css';
import { useUIState, AppMode } from '../store/uiState';
import { useRoomState } from '../store/roomState';
import { useFurnitureState } from '../store/furnitureState';
import { exportJSON, exportScreenshot } from '../utils/ExportUtils';

interface ToolbarProps {
  on3DRender: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const Toolbar: React.FC<ToolbarProps> = ({ on3DRender, canvasRef }) => {
  const { mode, setMode } = useUIState();
  const { points, isClosed, reset: resetRoom } = useRoomState();
  const { objects: furniture, setSelectedId } = useFurnitureState();
  
  // Mode switching
  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setSelectedId(null);
  };
  
  // Export room as JSON
  const handleExportJSON = () => {
    if (!isClosed) {
      alert('Please complete the room outline before exporting.');
      return;
    }
    
    exportJSON(points, isClosed, furniture);
  };
  
  // Export 3D view as screenshot
  const handleExportScreenshot = () => {
    if (!canvasRef.current) {
      alert('Please render the 3D view first.');
      return;
    }
    
    exportScreenshot(canvasRef.current);
  };
  
  return (
    <div className="toolbar">
      <div className="mode-buttons">
        <button
          className={mode === 'sketch' ? 'active' : ''}
          onClick={() => handleModeChange('sketch')}
          disabled={isClosed}
          title={isClosed ? 'Room already completed' : 'Draw room outline'}
        >
          Sketch Room
        </button>
        
        <button
          className={mode === 'object' ? 'active' : ''}
          onClick={() => handleModeChange('object')}
          disabled={!isClosed}
          title={!isClosed ? 'Complete room outline first' : 'Place furniture'}
        >
          Place Objects
        </button>
        
        <button
          className={mode === '3d' ? 'active' : ''}
          onClick={() => handleModeChange('3d')}
          disabled={!isClosed}
          title={!isClosed ? 'Complete room outline first' : 'View in 3D'}
        >
          3D View
        </button>
      </div>
      
      <div className="action-buttons">
        <button
          onClick={resetRoom}
          title="Clear the room and start over"
        >
          Reset Room
        </button>
        
        <button
          onClick={on3DRender}
          disabled={!isClosed || mode !== '3d'}
          title={!isClosed ? 'Complete room outline first' : 'Render 3D view'}
        >
          Render View
        </button>
        
        <button
          onClick={handleExportJSON}
          disabled={!isClosed}
          title={!isClosed ? 'Complete room outline first' : 'Export as JSON'}
        >
          Export JSON
        </button>
        
        <button
          onClick={handleExportScreenshot}
          disabled={!canvasRef.current || mode !== '3d'}
          title="Export 3D view as image"
        >
          Export Image
        </button>
      </div>
    </div>
  );
};

export default Toolbar;