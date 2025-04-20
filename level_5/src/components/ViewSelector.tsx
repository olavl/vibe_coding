import React from 'react';
import './ViewSelector.css';
import { useUIState, ViewDirection } from '../store/uiState';

const ViewSelector: React.FC = () => {
  const { viewDirection, setViewDirection } = useUIState();
  
  const directions: { value: ViewDirection; label: string; symbol: string }[] = [
    { value: 'N', label: 'North', symbol: '↑' },
    { value: 'E', label: 'East', symbol: '→' },
    { value: 'S', label: 'South', symbol: '↓' },
    { value: 'W', label: 'West', symbol: '←' },
  ];
  
  return (
    <div className="view-selector">
      <h3>View Direction</h3>
      <div className="direction-buttons">
        {directions.map((dir) => (
          <button
            key={dir.value}
            className={viewDirection === dir.value ? 'active' : ''}
            onClick={() => setViewDirection(dir.value)}
            title={dir.label}
          >
            <span className="dir-symbol">{dir.symbol}</span>
            <span className="dir-label">{dir.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewSelector;