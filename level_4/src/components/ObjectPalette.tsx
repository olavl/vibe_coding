import React from 'react';
import { FurnitureType } from '../types';
import { useFurnitureStore } from '../store/furnitureStore';
import { v4 as uuidv4 } from 'uuid';
import { FURNITURE_COLORS } from '../utils/colors';

const FURNITURE_TYPES: FurnitureType[] = [
  'couch',
  'lamp',
  'tv',
  'mirror',
  'carpet',
  'bench',
  'piano',
  'plant',
];

const ObjectPalette: React.FC = () => {
  const { add } = useFurnitureStore();

  const handleDragStart = (e: React.DragEvent, type: FurnitureType) => {
    e.dataTransfer.setData('furniture-type', type);
  };

  const handleAddFurniture = (type: FurnitureType, position: [number, number] = [400, 300]) => {
    add({
      id: uuidv4(),
      type,
      position,
      rotation: 0,
      color: FURNITURE_COLORS[type] || '#888',
      variant: 'default',
    });
  };

  return (
    <div 
      style={{ 
        width: '200px', 
        padding: '10px', 
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
        height: '100%'
      }}
    >
      <h3>Furniture</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {FURNITURE_TYPES.map((type) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            onClick={() => handleAddFurniture(type)}
            style={{
              backgroundColor: '#fff',
              padding: '10px',
              borderRadius: '4px',
              cursor: 'grab',
              border: '1px solid #ddd',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div 
              style={{ 
                width: '30px', 
                height: '30px', 
                backgroundColor: FURNITURE_COLORS[type] || '#888',
                borderRadius: type === 'lamp' || type === 'plant' ? '50%' : '4px'
              }} 
            />
            <span style={{ textTransform: 'capitalize' }}>{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjectPalette;