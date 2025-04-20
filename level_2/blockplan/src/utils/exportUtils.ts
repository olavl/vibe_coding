import html2canvas from 'html2canvas';
import { DesignState } from '../models/types';

// Export the 3D view as an image
export const export3DView = async (elementId: string): Promise<string | null> => {
  const element = document.getElementById(elementId);
  if (!element) return null;
  
  try {
    const canvas = await html2canvas(element);
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error exporting 3D view:', error);
    return null;
  }
};

// Download data as a file
export const downloadFile = (data: string, filename: string, type: string): void => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to the document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  URL.revokeObjectURL(url);
};

// Export design as JSON
export const exportDesignAsJSON = (design: DesignState): void => {
  const data = JSON.stringify(design, null, 2);
  downloadFile(data, 'blockplan-design.json', 'application/json');
};

// Export 3D view as image
export const exportViewAsImage = async (elementId: string): Promise<void> => {
  const dataUrl = await export3DView(elementId);
  if (dataUrl) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'blockplan-3d-view.png';
    link.click();
  }
};