import { FurnitureType } from './types';

export interface FurnitureTemplate {
  type: FurnitureType;
  defaultWidth: number;
  defaultHeight: number;
  defaultDepth: number;
  defaultColor: string;
  styles: number;
  name: string;
}

export const FURNITURE_TEMPLATES: FurnitureTemplate[] = [
  {
    type: FurnitureType.Couch,
    defaultWidth: 2,
    defaultHeight: 0.8,
    defaultDepth: 0.8,
    defaultColor: '#8B4513',
    styles: 3,
    name: 'Couch'
  },
  {
    type: FurnitureType.Bench,
    defaultWidth: 1.2,
    defaultHeight: 0.4,
    defaultDepth: 0.4,
    defaultColor: '#A0522D',
    styles: 2,
    name: 'Bench'
  },
  {
    type: FurnitureType.TV,
    defaultWidth: 1.2,
    defaultHeight: 0.7,
    defaultDepth: 0.1,
    defaultColor: '#000000',
    styles: 2,
    name: 'TV'
  },
  {
    type: FurnitureType.Mirror,
    defaultWidth: 0.5,
    defaultHeight: 1.5,
    defaultDepth: 0.1,
    defaultColor: '#C0C0C0',
    styles: 2,
    name: 'Mirror'
  },
  {
    type: FurnitureType.Plant,
    defaultWidth: 0.5,
    defaultHeight: 1.2,
    defaultDepth: 0.5,
    defaultColor: '#228B22',
    styles: 3,
    name: 'Plant'
  },
  {
    type: FurnitureType.Lamp,
    defaultWidth: 0.4,
    defaultHeight: 1.5,
    defaultDepth: 0.4,
    defaultColor: '#FFD700',
    styles: 2,
    name: 'Lamp'
  },
  {
    type: FurnitureType.Piano,
    defaultWidth: 1.5,
    defaultHeight: 1.0,
    defaultDepth: 0.6,
    defaultColor: '#000000',
    styles: 2,
    name: 'Piano'
  },
  {
    type: FurnitureType.Carpet,
    defaultWidth: 2.0,
    defaultHeight: 0.05,
    defaultDepth: 3.0,
    defaultColor: '#ADD8E6',
    styles: 3,
    name: 'Carpet'
  }
];