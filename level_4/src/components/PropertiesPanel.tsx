import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { useFurnitureStore } from '../store/furnitureStore';

const VARIANTS = {
  couch: ['modern', 'classic', 'sectional'],
  lamp: ['floor', 'table', 'pendant'],
  tv: ['flat', 'console'],
  mirror: ['round', 'square', 'full-length'],
  carpet: ['area', 'runner', 'shag'],
  bench: ['wood', 'upholstered', 'storage'],
  piano: ['grand', 'upright', 'digital'],
  plant: ['palm', 'ficus', 'succulent'],
};

const PropertiesPanel: React.FC = () => {
  const { objects, selectedId, update } = useFurnitureStore();
  
  if (!selectedId || !objects[selectedId]) {
    return (
      <div style={{ padding: '20px', width: '200px', backgroundColor: '#f5f5f5', borderLeft: '1px solid #ddd' }}>
        <p>Select an object to edit its properties</p>
      </div>
    );
  }
  
  const selectedObject = objects[selectedId];
  const variants = VARIANTS[selectedObject.type] || ['default'];
  
  const handleColorChange = (color: string) => {
    update(selectedId, { color });
  };
  
  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    update(selectedId, { variant: e.target.value });
  };
  
  const handleRotateClick = () => {
    update(selectedId, { rotation: (selectedObject.rotation + 90) % 360 });
  };
  
  const handleDeleteClick = () => {
    const { remove } = useFurnitureStore.getState();
    remove(selectedId);
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      width: '200px', 
      backgroundColor: '#f5f5f5', 
      borderLeft: '1px solid #ddd',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      <h3>Properties: {selectedObject.type}</h3>
      
      <div>
        <label>
          <div style={{ marginBottom: '5px' }}>Variant:</div>
          <select 
            value={selectedObject.variant} 
            onChange={handleVariantChange}
            style={{ width: '100%', padding: '5px' }}
          >
            {variants.map(variant => (
              <option key={variant} value={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>
      
      <div>
        <div style={{ marginBottom: '5px' }}>Color:</div>
        <HexColorPicker color={selectedObject.color} onChange={handleColorChange} style={{ width: '100%' }} />
      </div>
      
      <div>
        <button
          onClick={handleRotateClick}
          style={{
            padding: '8px 12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Rotate 90°
        </button>
      </div>
      
      <div>
        <button
          onClick={handleDeleteClick}
          style={{
            padding: '8px 12px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;