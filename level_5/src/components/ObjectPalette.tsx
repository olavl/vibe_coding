import React from 'react';
import './ObjectPalette.css';
import { useUIState } from '../store/uiState';

// Furniture types available in the palette
const FURNITURE_ITEMS = [
  { type: 'couch', label: 'Couch', variants: ['classic', 'modern'] },
  { type: 'lamp', label: 'Lamp', variants: ['floor', 'table'] },
  { type: 'tv', label: 'TV', variants: ['flat', 'console'] },
  { type: 'mirror', label: 'Mirror', variants: ['wall', 'standing'] },
  { type: 'carpet', label: 'Carpet', variants: ['round', 'rectangular'] },
  { type: 'bench', label: 'Bench', variants: ['wooden', 'metal'] },
  { type: 'piano', label: 'Piano', variants: ['grand', 'upright'] },
  { type: 'plant', label: 'Plant', variants: ['small', 'large'] },
];

const ObjectPalette: React.FC = () => {
  const { mode } = useUIState();
  
  // Drag start handler
  const handleDragStart = (e: React.DragEvent, type: string, variant: string) => {
    // Set the drag data - will be used in Canvas2D's drop handler
    e.dataTransfer.setData(
      'furniture',
      JSON.stringify({
        type,
        variant,
      })
    );
  };
  
  return (
    <div className="object-palette">
      <h3>Furniture Palette</h3>
      <div className="palette-items">
        {FURNITURE_ITEMS.map((item) => (
          <div 
            key={item.type}
            className={`palette-item ${mode !== 'object' ? 'disabled' : ''}`}
            draggable={mode === 'object'}
            onDragStart={(e) => handleDragStart(e, item.type, item.variants[0])}
          >
            <div className="item-preview" style={{ backgroundColor: '#cccccc' }}>
              {item.type.charAt(0).toUpperCase()}
            </div>
            <div className="item-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjectPalette;