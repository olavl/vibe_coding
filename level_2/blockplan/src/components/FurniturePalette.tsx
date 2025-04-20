import React from 'react';
import { FURNITURE_TEMPLATES } from '../models/furniture';
import { FurnitureType } from '../models/types';
import { generateId } from '../utils/designUtils';

interface FurniturePaletteProps {
  onAddFurniture: (type: FurnitureType) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const FurniturePalette: React.FC<FurniturePaletteProps> = ({
  onAddFurniture,
  selectedColor,
  onColorChange
}) => {
  const colors = [
    '#8B4513', // Brown
    '#A0522D', // Sienna
    '#000000', // Black
    '#C0C0C0', // Silver
    '#228B22', // Forest Green
    '#FFD700', // Gold
    '#ADD8E6', // Light Blue
    '#800000', // Maroon
    '#FFC0CB', // Pink
    '#FFFFFF'  // White
  ];

  return (
    <div className="furniture-palette">
      <h3>Furniture</h3>
      <div className="furniture-grid">
        {FURNITURE_TEMPLATES.map((template) => (
          <div 
            key={template.type} 
            className="furniture-item"
            onClick={() => onAddFurniture(template.type)}
            style={{ 
              backgroundColor: template.defaultColor,
              cursor: 'pointer',
              padding: '10px',
              margin: '5px',
              borderRadius: '4px'
            }}
          >
            {template.name}
          </div>
        ))}
      </div>
      
      <h3>Colors</h3>
      <div className="color-grid">
        {colors.map((color) => (
          <div 
            key={color} 
            className={`color-swatch ${color === selectedColor ? 'selected' : ''}`}
            onClick={() => onColorChange(color)}
            style={{ 
              backgroundColor: color,
              width: '30px',
              height: '30px',
              margin: '5px',
              cursor: 'pointer',
              border: color === selectedColor ? '2px solid blue' : '1px solid #ccc',
              borderRadius: '50%',
              display: 'inline-block'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FurniturePalette;