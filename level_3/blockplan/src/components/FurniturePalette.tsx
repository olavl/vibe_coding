import React from 'react';
import { useAppStore } from '../models/store';
import { FurnitureType, Furniture, FurnitureStyle } from '../models/types';
import { furnitureTemplates } from '../models/furnitureData';

const FurniturePalette: React.FC = () => {
  const { addFurniture, selectedFurnitureId, updateFurniture } = useAppStore();
  
  // Add a new furniture item
  const handleAddFurniture = (type: FurnitureType) => {
    const template = furnitureTemplates[type];
    
    const newFurniture: Omit<Furniture, 'id'> = {
      type,
      position: { x: 250, y: 250 }, // Default position in center
      rotation: 0,
      width: template.width,
      depth: template.depth,
      height: template.height,
      color: template.defaultColor,
      style: template.styles[0]
    };
    
    addFurniture(newFurniture);
  };
  
  // Change color of selected furniture
  const handleColorChange = (color: string) => {
    if (selectedFurnitureId) {
      updateFurniture(selectedFurnitureId, { color });
    }
  };
  
  // Change style of selected furniture
  const handleStyleChange = (style: FurnitureStyle) => {
    if (selectedFurnitureId) {
      updateFurniture(selectedFurnitureId, { style });
    }
  };
  
  const availableFurnitureTypes = Object.keys(furnitureTemplates) as FurnitureType[];
  
  return (
    <div className="furniture-palette" style={{ padding: '10px', backgroundColor: '#333', borderRight: '1px solid #555' }}>
      <h3 style={{ marginBottom: '10px', color: '#fff' }}>Furniture</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {availableFurnitureTypes.map(type => (
          <div 
            key={type}
            className="furniture-item"
            onClick={() => handleAddFurniture(type)}
            style={{ 
              padding: '10px', 
              backgroundColor: '#444', 
              borderRadius: '4px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {type}
          </div>
        ))}
      </div>
      
      {selectedFurnitureId && (
        <div className="furniture-controls" style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '10px', color: '#fff' }}>Customize</h4>
          
          <div style={{ marginBottom: '10px' }}>
            <div style={{ color: '#ddd', marginBottom: '5px' }}>Color:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {['#8B4513', '#A0522D', '#CD853F', '#000000', '#696969', '#C0C0C0', 
                '#228B22', '#006400', '#F5DEB3', '#FFD700', '#B22222', '#4682B4'].map(color => (
                <div 
                  key={color}
                  onClick={() => handleColorChange(color)}
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    backgroundColor: color, 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: '1px solid #fff'
                  }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <div style={{ color: '#ddd', marginBottom: '5px' }}>Style:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {['classic', 'modern', 'minimal'].map(style => (
                <button 
                  key={style}
                  onClick={() => handleStyleChange(style as FurnitureStyle)}
                  style={{ 
                    padding: '5px', 
                    backgroundColor: '#444',
                    textTransform: 'capitalize'
                  }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FurniturePalette;