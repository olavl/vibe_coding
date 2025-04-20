import React from 'react';
import { useAppStore } from '../store/appStore';
import { useRoomStore } from '../store/roomStore';
import { AppMode } from '../types';
import { exportJSON, exportScreenshot } from '../utils/exportUtils';

interface ToolButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, onClick, isActive = false }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '8px 12px',
      margin: '0 5px',
      backgroundColor: isActive ? '#3498db' : '#fff',
      color: isActive ? '#fff' : '#333',
      border: '1px solid #ddd',
      borderRadius: '4px',
      cursor: 'pointer',
    }}
  >
    <span style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</span>
    <span style={{ fontSize: '12px' }}>{label}</span>
  </button>
);

const ToolBar: React.FC = () => {
  const { mode, setMode } = useAppStore();
  const { reset, isClosed } = useRoomStore();

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the design? This will clear all your work.')) {
      reset();
      setMode('sketch');
    }
  };

  const handleExportJSON = () => {
    const jsonString = exportJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'floorplan.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportScreenshot = () => {
    const canvasRef = document.querySelector('canvas');
    if (!canvasRef) return;
    
    const dataURL = exportScreenshot(canvasRef as HTMLCanvasElement);
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'floorplan-3d.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{
      padding: '10px',
      borderBottom: '1px solid #ddd',
      backgroundColor: '#f9f9f9',
      display: 'flex',
    }}>
      <div style={{ display: 'flex', marginRight: 'auto' }}>
        <ToolButton
          icon="✏️"
          label="Draw"
          onClick={() => handleModeChange('sketch')}
          isActive={mode === 'sketch'}
        />
        <ToolButton
          icon="🪑"
          label="Furniture"
          onClick={() => handleModeChange('object')}
          isActive={mode === 'object'}
        />
        <ToolButton
          icon="🏠"
          label="3D View"
          onClick={() => handleModeChange('3d')}
          isActive={mode === '3d'}
        />
      </div>
      
      <div style={{ display: 'flex' }}>
        <ToolButton
          icon="🔄"
          label="Reset"
          onClick={handleReset}
        />
        <ToolButton
          icon="💾"
          label="Export JSON"
          onClick={handleExportJSON}
        />
        {isClosed && (
          <ToolButton
            icon="📷"
            label="Screenshot"
            onClick={handleExportScreenshot}
          />
        )}
      </div>
    </div>
  );
};

export default ToolBar;