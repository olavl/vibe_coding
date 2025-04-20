import html2canvas from 'html2canvas';
import { ExportData } from '../models/types';

// Export room data as JSON
export const exportToJson = (data: ExportData): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.download = `blockplan_export_${new Date().toISOString().slice(0, 10)}.json`;
  a.href = url;
  a.click();
  
  URL.revokeObjectURL(url);
};

// Export 3D scene as an image
export const exportToImage = async (canvasId: string): Promise<void> => {
  const renderArea = document.getElementById(canvasId);
  if (!renderArea) return;
  
  try {
    const canvas = await html2canvas(renderArea);
    const url = canvas.toDataURL('image/png');
    
    const a = document.createElement('a');
    a.download = `blockplan_render_${new Date().toISOString().slice(0, 10)}.png`;
    a.href = url;
    a.click();
  } catch (error) {
    console.error('Error exporting as image:', error);
  }
};