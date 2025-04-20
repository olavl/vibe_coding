import React from 'react';
import { useAppStore } from '../models/store';
import { exportToJson, exportToImage } from '../utils/exportUtils';

const Toolbar: React.FC = () => {
  const { 
    activeToolMode, 
    setActiveToolMode, 
    exportData, 
    importData 
  } = useAppStore();
  
  const handleToolChange = (mode: 'draw' | 'move' | 'delete') => {
    setActiveToolMode(mode);
  };
  
  const handleExportJson = () => {
    const data = exportData();
    exportToJson(data);
  };
  
  const handleExportImage = () => {
    exportToImage('scene-container');
  };
  
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        importData(data);
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Failed to import data. Invalid format.');
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="toolbar" style={{ 
      display: 'flex', 
      backgroundColor: '#333', 
      padding: '10px', 
      borderBottom: '1px solid #555',
      justifyContent: 'space-between'
    }}>
      <div className="tool-buttons">
        <button 
          onClick={() => handleToolChange('draw')} 
          style={{ 
            backgroundColor: activeToolMode === 'draw' ? '#4d4d4d' : '#333',
            marginRight: '5px'
          }}
        >
          Draw
        </button>
        <button 
          onClick={() => handleToolChange('move')} 
          style={{ 
            backgroundColor: activeToolMode === 'move' ? '#4d4d4d' : '#333',
            marginRight: '5px'
          }}
        >
          Move
        </button>
        <button 
          onClick={() => handleToolChange('delete')} 
          style={{ 
            backgroundColor: activeToolMode === 'delete' ? '#4d4d4d' : '#333'
          }}
        >
          Delete
        </button>
      </div>
      
      <div className="export-buttons">
        <button onClick={handleExportJson} style={{ marginRight: '5px' }}>
          Export JSON
        </button>
        <button onClick={handleExportImage} style={{ marginRight: '5px' }}>
          Export Image
        </button>
        <label style={{ 
          backgroundColor: '#333', 
          border: '1px solid #555',
          borderRadius: '4px',
          padding: '6px 12px',
          cursor: 'pointer'
        }}>
          Import JSON
          <input 
            type="file" 
            accept=".json" 
            onChange={handleImportJson} 
            style={{ display: 'none' }} 
          />
        </label>
      </div>
    </div>
  );
};

export default Toolbar;