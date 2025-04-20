import React from 'react';
import './PropertiesPanel.css';
import { useFurnitureState } from '../store/furnitureState';
import { useUIState } from '../store/uiState';

// Furniture variants
const FURNITURE_VARIANTS: Record<string, string[]> = {
  couch: ['classic', 'modern'],
  lamp: ['floor', 'table'],
  tv: ['flat', 'console'],
  mirror: ['wall', 'standing'],
  carpet: ['round', 'rectangular'],
  bench: ['wooden', 'metal'],
  piano: ['grand', 'upright'],
  plant: ['small', 'large'],
};

const PropertiesPanel: React.FC = () => {
  const { mode } = useUIState();
  const { objects, selectedId, update, remove } = useFurnitureState();
  
  // If no furniture is selected or not in object mode, show empty panel
  if (!selectedId || mode !== 'object' || !objects[selectedId]) {
    return (
      <div className="properties-panel">
        <h3>Properties</h3>
        <p className="empty-message">Select an object to edit its properties</p>
      </div>
    );
  }
  
  const selectedObject = objects[selectedId];
  const variants = FURNITURE_VARIANTS[selectedObject.type] || ['default'];
  
  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      
      <div className="property">
        <label>Type</label>
        <div>{selectedObject.type.charAt(0).toUpperCase() + selectedObject.type.slice(1)}</div>
      </div>
      
      <div className="property">
        <label>Variant</label>
        <select
          value={selectedObject.variant}
          onChange={(e) => update(selectedId, { variant: e.target.value })}
        >
          {variants.map((variant) => (
            <option key={variant} value={variant}>
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div className="property">
        <label>Color</label>
        <input
          type="color"
          value={selectedObject.color}
          onChange={(e) => update(selectedId, { color: e.target.value })}
        />
      </div>
      
      <div className="property">
        <label>Rotation</label>
        <div className="rotation-buttons">
          <button
            onClick={() => {
              const newRotation = (selectedObject.rotation - 90 + 360) % 360;
              update(selectedId, { rotation: newRotation });
            }}
          >
            ↺
          </button>
          <span>{selectedObject.rotation}°</span>
          <button
            onClick={() => {
              const newRotation = (selectedObject.rotation + 90) % 360;
              update(selectedId, { rotation: newRotation });
            }}
          >
            ↻
          </button>
        </div>
      </div>
      
      <button 
        className="delete-button"
        onClick={() => remove(selectedId)}
      >
        Delete Object
      </button>
    </div>
  );
};

export default PropertiesPanel;