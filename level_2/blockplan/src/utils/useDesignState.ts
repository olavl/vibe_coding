import { useState, useCallback } from 'react';
import { 
  DesignState, 
  FurnitureObject, 
  Point, 
  RoomOutline, 
  Direction,
  FurnitureType
} from '../models/types';
import { 
  createDefaultRoom, 
  snapToGrid, 
  generateId, 
  isPointInRoom 
} from './designUtils';
import { FURNITURE_TEMPLATES } from '../models/furniture';

// Default grid size in meters
const DEFAULT_GRID_SIZE = 0.5;

// Custom hook for managing the design state
const useDesignState = () => {
  const [designState, setDesignState] = useState<DesignState>({
    roomOutline: createDefaultRoom(),
    furniture: [],
    viewPoint: { x: 3, y: 2 }, // Center of default room
    viewDirection: Direction.North,
    gridSize: DEFAULT_GRID_SIZE
  });
  
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#8B4513');
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  
  // Update room outline
  const updateRoomOutline = useCallback((outline: RoomOutline) => {
    setDesignState(prev => ({
      ...prev,
      roomOutline: outline
    }));
  }, []);
  
  // Add furniture
  const addFurniture = useCallback((type: FurnitureType) => {
    // Find template for this furniture type
    const template = FURNITURE_TEMPLATES.find(t => t.type === type);
    if (!template) return;
    
    // Create new furniture object
    const newFurniture: FurnitureObject = {
      id: generateId(),
      type,
      position: { x: 2, y: 2 }, // Default position
      rotation: 0,
      width: template.defaultWidth,
      height: template.defaultHeight,
      depth: template.defaultDepth,
      color: selectedColor,
      style: 0
    };
    
    setDesignState(prev => ({
      ...prev,
      furniture: [...prev.furniture, newFurniture]
    }));
    
    // Select the new furniture
    setSelectedFurnitureId(newFurniture.id);
  }, [selectedColor]);
  
  // Select furniture
  const selectFurniture = useCallback((id: string | null) => {
    setSelectedFurnitureId(id);
  }, []);
  
  // Move furniture
  const moveFurniture = useCallback((id: string, position: Point) => {
    const snappedPosition = snapToGrid(position, designState.gridSize);
    
    setDesignState(prev => ({
      ...prev,
      furniture: prev.furniture.map(item => 
        item.id === id 
          ? { ...item, position: snappedPosition } 
          : item
      )
    }));
  }, [designState.gridSize]);
  
  // Rotate furniture
  const rotateFurniture = useCallback((id: string, rotation: number) => {
    setDesignState(prev => ({
      ...prev,
      furniture: prev.furniture.map(item => 
        item.id === id 
          ? { ...item, rotation } 
          : item
      )
    }));
  }, []);
  
  // Delete furniture
  const deleteFurniture = useCallback((id: string) => {
    setDesignState(prev => ({
      ...prev,
      furniture: prev.furniture.filter(item => item.id !== id)
    }));
    
    // Deselect if the deleted item was selected
    if (selectedFurnitureId === id) {
      setSelectedFurnitureId(null);
    }
  }, [selectedFurnitureId]);
  
  // Change furniture color
  const changeFurnitureColor = useCallback((id: string, color: string) => {
    setDesignState(prev => ({
      ...prev,
      furniture: prev.furniture.map(item => 
        item.id === id 
          ? { ...item, color } 
          : item
      )
    }));
  }, []);
  
  // Update view point
  const updateViewPoint = useCallback((point: Point) => {
    // Check if the point is inside the room
    if (isPointInRoom(point, designState.roomOutline)) {
      setDesignState(prev => ({
        ...prev,
        viewPoint: point
      }));
    }
  }, [designState.roomOutline]);
  
  // Update view direction
  const updateViewDirection = useCallback((direction: Direction) => {
    setDesignState(prev => ({
      ...prev,
      viewDirection: direction
    }));
  }, []);
  
  // Change selected color
  const changeSelectedColor = useCallback((color: string) => {
    setSelectedColor(color);
    
    // If furniture is selected, update its color
    if (selectedFurnitureId) {
      changeFurnitureColor(selectedFurnitureId, color);
    }
  }, [selectedFurnitureId, changeFurnitureColor]);
  
  // Toggle drawing mode
  const toggleDrawingMode = useCallback(() => {
    setIsDrawingMode(prev => !prev);
    // Deselect furniture when entering drawing mode
    if (!isDrawingMode) {
      setSelectedFurnitureId(null);
    }
  }, [isDrawingMode]);
  
  // Reset to default room
  const resetRoom = useCallback(() => {
    setDesignState({
      roomOutline: createDefaultRoom(),
      furniture: [],
      viewPoint: { x: 3, y: 2 },
      viewDirection: Direction.North,
      gridSize: DEFAULT_GRID_SIZE
    });
    setSelectedFurnitureId(null);
    setIsDrawingMode(false);
  }, []);

  // Get selected furniture
  const selectedFurniture = designState.furniture.find(
    item => item.id === selectedFurnitureId
  );
  
  return {
    designState,
    selectedFurnitureId,
    selectedFurniture,
    selectedColor,
    isDrawingMode,
    updateRoomOutline,
    addFurniture,
    selectFurniture,
    moveFurniture,
    rotateFurniture,
    deleteFurniture,
    changeFurnitureColor,
    updateViewPoint,
    updateViewDirection,
    changeSelectedColor,
    toggleDrawingMode,
    resetRoom
  };
};

export default useDesignState;