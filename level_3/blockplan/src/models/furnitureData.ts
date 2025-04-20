import { FurnitureType } from './types';

interface FurnitureTemplate {
  type: FurnitureType;
  width: number;
  depth: number;
  height: number;
  defaultColor: string;
  styles: Array<'classic' | 'modern' | 'minimal'>;
}

// Dimensions are in "units" (1 unit = 20 pixels = 0.4 meters)
export const furnitureTemplates: Record<FurnitureType, FurnitureTemplate> = {
  couch: {
    type: 'couch',
    width: 5, // 2 meters
    depth: 2.5, // 1 meter
    height: 1.75, // 0.7 meters
    defaultColor: '#8B4513',
    styles: ['classic', 'modern', 'minimal']
  },
  bench: {
    type: 'bench',
    width: 3, // 1.2 meters
    depth: 1, // 0.4 meters
    height: 1.25, // 0.5 meters
    defaultColor: '#A0522D',
    styles: ['classic', 'minimal']
  },
  tv: {
    type: 'tv',
    width: 4, // 1.6 meters
    depth: 0.5, // 0.2 meters
    height: 2.25, // 0.9 meters
    defaultColor: '#000000',
    styles: ['modern', 'minimal']
  },
  mirror: {
    type: 'mirror',
    width: 2, // 0.8 meters
    depth: 0.25, // 0.1 meters
    height: 3, // 1.2 meters
    defaultColor: '#C0C0C0',
    styles: ['classic', 'modern']
  },
  plant: {
    type: 'plant',
    width: 1.5, // 0.6 meters
    depth: 1.5, // 0.6 meters
    height: 3.5, // 1.4 meters
    defaultColor: '#228B22',
    styles: ['classic', 'minimal']
  },
  lamp: {
    type: 'lamp',
    width: 1, // 0.4 meters
    depth: 1, // 0.4 meters
    height: 4, // 1.6 meters
    defaultColor: '#F5DEB3',
    styles: ['classic', 'modern', 'minimal']
  },
  piano: {
    type: 'piano',
    width: 5, // 2 meters
    depth: 2, // 0.8 meters
    height: 2.5, // 1 meter
    defaultColor: '#000000',
    styles: ['classic']
  },
  carpet: {
    type: 'carpet',
    width: 6, // 2.4 meters
    depth: 4, // 1.6 meters
    height: 0.25, // 0.1 meters (minimal height)
    defaultColor: '#B22222',
    styles: ['classic', 'modern', 'minimal']
  }
};