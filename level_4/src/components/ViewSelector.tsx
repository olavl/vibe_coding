import React from 'react';
import { useAppStore } from '../store/appStore';
import { ViewDirection } from '../types';

interface DirectionButtonProps {
  direction: ViewDirection;
  label: string;
  isActive: boolean;
  onClick: (dir: ViewDirection) => void;
}

const DirectionButton: React.FC<DirectionButtonProps> = ({ direction, label, isActive, onClick }) => (
  <button
    onClick={() => onClick(direction)}
    style={{
      width: '40px',
      height: '40px',
      margin: '4px',
      backgroundColor: isActive ? '#3498db' : '#eee',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      color: isActive ? 'white' : 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    }}
  >
    {label}
  </button>
);

const ViewSelector: React.FC = () => {
  const { viewDirection, setViewDirection } = useAppStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
      <h3>View Direction</h3>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <DirectionButton 
          direction="N" 
          label="N" 
          isActive={viewDirection === 'N'} 
          onClick={setViewDirection} 
        />
        <div style={{ display: 'flex' }}>
          <DirectionButton 
            direction="W" 
            label="W" 
            isActive={viewDirection === 'W'} 
            onClick={setViewDirection} 
          />
          <div style={{ width: '40px', height: '40px', margin: '4px' }} />
          <DirectionButton 
            direction="E" 
            label="E" 
            isActive={viewDirection === 'E'} 
            onClick={setViewDirection} 
          />
        </div>
        <DirectionButton 
          direction="S" 
          label="S" 
          isActive={viewDirection === 'S'} 
          onClick={setViewDirection} 
        />
      </div>
    </div>
  );
};

export default ViewSelector;