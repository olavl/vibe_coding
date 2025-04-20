import React from 'react';
import { useAppStore } from '../models/store';
import { ViewDirection } from '../models/types';

const ViewSelector: React.FC = () => {
  const { viewpoint, setViewpoint } = useAppStore();
  
  const handleDirectionChange = (direction: ViewDirection) => {
    setViewpoint({
      ...viewpoint,
      direction
    });
  };
  
  return (
    <div className="view-selector" style={{ padding: '10px', backgroundColor: '#333' }}>
      <h3 style={{ marginBottom: '10px', color: '#fff' }}>View Direction</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '5px',
        width: '120px',
        height: '120px'
      }}>
        {/* Empty top-left corner */}
        <div></div>
        
        {/* North button */}
        <button 
          onClick={() => handleDirectionChange('N')}
          style={{ 
            backgroundColor: viewpoint.direction === 'N' ? '#4d4d4d' : '#333'
          }}
        >
          N
        </button>
        
        {/* Empty top-right corner */}
        <div></div>
        
        {/* West button */}
        <button 
          onClick={() => handleDirectionChange('W')}
          style={{ 
            backgroundColor: viewpoint.direction === 'W' ? '#4d4d4d' : '#333'
          }}
        >
          W
        </button>
        
        {/* Center indicator */}
        <div style={{ 
          backgroundColor: '#555',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: '#ddd',
          borderRadius: '4px'
        }}>
          View
        </div>
        
        {/* East button */}
        <button 
          onClick={() => handleDirectionChange('E')}
          style={{ 
            backgroundColor: viewpoint.direction === 'E' ? '#4d4d4d' : '#333'
          }}
        >
          E
        </button>
        
        {/* Empty bottom-left corner */}
        <div></div>
        
        {/* South button */}
        <button 
          onClick={() => handleDirectionChange('S')}
          style={{ 
            backgroundColor: viewpoint.direction === 'S' ? '#4d4d4d' : '#333'
          }}
        >
          S
        </button>
        
        {/* Empty bottom-right corner */}
        <div></div>
      </div>
      
      <div style={{ marginTop: '10px', color: '#ddd' }}>
        <p>Click on room to set viewpoint location</p>
      </div>
    </div>
  );
};

export default ViewSelector;