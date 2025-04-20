// Color mappings for furniture types
export const FURNITURE_COLORS: Record<string, string> = {
  couch: '#8a9ea0',
  lamp: '#f1e3b5',
  tv: '#333333',
  mirror: '#a2c0d0',
  carpet: '#d8c0aa',
  bench: '#a68069',
  piano: '#1a1a1a',
  plant: '#567d46',
};

// Size mapping for different furniture types (in pixels)
export const FURNITURE_SIZES: Record<string, [number, number]> = {
  couch: [200, 80],
  lamp: [40, 40],
  tv: [120, 20],
  mirror: [60, 10],
  carpet: [200, 150],
  bench: [120, 40],
  piano: [150, 100],
  plant: [50, 50],
};
