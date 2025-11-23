// Module 3: FDI Tooth Chart Data and Utilities
// Abdullah Dental Care Management System

import { Tooth, ToothType } from '../types/treatment';

// FDI Tooth Numbering System
// Adult: 11-18 (UR), 21-28 (UL), 31-38 (LL), 41-48 (LR)
// Primary: 51-55 (UR), 61-65 (UL), 71-75 (LL), 81-85 (LR)

export interface ToothPosition {
  x: number;
  y: number;
  number: number;
  name: string;
  quadrant: 1 | 2 | 3 | 4 | 5;
}

// Adult teeth positions for SVG rendering (Upper arch Y=50, Lower Y=150)
export const ADULT_TEETH_POSITIONS: ToothPosition[] = [
  // Upper Right (Quadrant 1)
  { x: 220, y: 50, number: 11, name: 'Central Incisor', quadrant: 1 },
  { x: 200, y: 45, number: 12, name: 'Lateral Incisor', quadrant: 1 },
  { x: 180, y: 42, number: 13, name: 'Canine', quadrant: 1 },
  { x: 160, y: 45, number: 14, name: '1st Premolar', quadrant: 1 },
  { x: 140, y: 50, number: 15, name: '2nd Premolar', quadrant: 1 },
  { x: 120, y: 58, number: 16, name: '1st Molar', quadrant: 1 },
  { x: 100, y: 68, number: 17, name: '2nd Molar', quadrant: 1 },
  { x: 80, y: 80, number: 18, name: '3rd Molar', quadrant: 1 },
  
  // Upper Left (Quadrant 2)
  { x: 240, y: 50, number: 21, name: 'Central Incisor', quadrant: 2 },
  { x: 260, y: 45, number: 22, name: 'Lateral Incisor', quadrant: 2 },
  { x: 280, y: 42, number: 23, name: 'Canine', quadrant: 2 },
  { x: 300, y: 45, number: 24, name: '1st Premolar', quadrant: 2 },
  { x: 320, y: 50, number: 25, name: '2nd Premolar', quadrant: 2 },
  { x: 340, y: 58, number: 26, name: '1st Molar', quadrant: 2 },
  { x: 360, y: 68, number: 27, name: '2nd Molar', quadrant: 2 },
  { x: 380, y: 80, number: 28, name: '3rd Molar', quadrant: 2 },
  
  // Lower Left (Quadrant 3)
  { x: 240, y: 150, number: 31, name: 'Central Incisor', quadrant: 3 },
  { x: 260, y: 155, number: 32, name: 'Lateral Incisor', quadrant: 3 },
  { x: 280, y: 158, number: 33, name: 'Canine', quadrant: 3 },
  { x: 300, y: 155, number: 34, name: '1st Premolar', quadrant: 3 },
  { x: 320, y: 150, number: 35, name: '2nd Premolar', quadrant: 3 },
  { x: 340, y: 142, number: 36, name: '1st Molar', quadrant: 3 },
  { x: 360, y: 132, number: 37, name: '2nd Molar', quadrant: 3 },
  { x: 380, y: 120, number: 38, name: '3rd Molar', quadrant: 3 },
  
  // Lower Right (Quadrant 4)
  { x: 220, y: 150, number: 41, name: 'Central Incisor', quadrant: 4 },
  { x: 200, y: 155, number: 42, name: 'Lateral Incisor', quadrant: 4 },
  { x: 180, y: 158, number: 43, name: 'Canine', quadrant: 4 },
  { x: 160, y: 155, number: 44, name: '1st Premolar', quadrant: 4 },
  { x: 140, y: 150, number: 45, name: '2nd Premolar', quadrant: 4 },
  { x: 120, y: 142, number: 46, name: '1st Molar', quadrant: 4 },
  { x: 100, y: 132, number: 47, name: '2nd Molar', quadrant: 4 },
  { x: 80, y: 120, number: 48, name: '3rd Molar', quadrant: 4 },
];

// Primary teeth positions for SVG rendering
export const PRIMARY_TEETH_POSITIONS: ToothPosition[] = [
  // Upper Right (Quadrant 5)
  { x: 210, y: 50, number: 51, name: 'Central Incisor', quadrant: 5 },
  { x: 190, y: 48, number: 52, name: 'Lateral Incisor', quadrant: 5 },
  { x: 170, y: 50, number: 53, name: 'Canine', quadrant: 5 },
  { x: 150, y: 55, number: 54, name: '1st Molar', quadrant: 5 },
  { x: 130, y: 62, number: 55, name: '2nd Molar', quadrant: 5 },
  
  // Upper Left (Quadrant 6)
  { x: 250, y: 50, number: 61, name: 'Central Incisor', quadrant: 5 },
  { x: 270, y: 48, number: 62, name: 'Lateral Incisor', quadrant: 5 },
  { x: 290, y: 50, number: 63, name: 'Canine', quadrant: 5 },
  { x: 310, y: 55, number: 64, name: '1st Molar', quadrant: 5 },
  { x: 330, y: 62, number: 65, name: '2nd Molar', quadrant: 5 },
  
  // Lower Left (Quadrant 7)
  { x: 250, y: 150, number: 71, name: 'Central Incisor', quadrant: 5 },
  { x: 270, y: 152, number: 72, name: 'Lateral Incisor', quadrant: 5 },
  { x: 290, y: 150, number: 73, name: 'Canine', quadrant: 5 },
  { x: 310, y: 145, number: 74, name: '1st Molar', quadrant: 5 },
  { x: 330, y: 138, number: 75, name: '2nd Molar', quadrant: 5 },
  
  // Lower Right (Quadrant 8)
  { x: 210, y: 150, number: 81, name: 'Central Incisor', quadrant: 5 },
  { x: 190, y: 152, number: 82, name: 'Lateral Incisor', quadrant: 5 },
  { x: 170, y: 150, number: 83, name: 'Canine', quadrant: 5 },
  { x: 150, y: 145, number: 84, name: '1st Molar', quadrant: 5 },
  { x: 130, y: 138, number: 85, name: '2nd Molar', quadrant: 5 },
];

// Initialize tooth chart with all teeth
export const initializeToothChart = (type: ToothType): Map<number, Tooth> => {
  const chart = new Map<number, Tooth>();
  const positions = type === 'adult' ? ADULT_TEETH_POSITIONS : PRIMARY_TEETH_POSITIONS;
  
  positions.forEach(pos => {
    chart.set(pos.number, {
      number: pos.number,
      type,
      status: 'healthy',
      position: {
        quadrant: pos.quadrant,
        index: pos.number % 10
      }
    });
  });
  
  return chart;
};

// Get tooth name from FDI number
export const getToothName = (number: number): string => {
  const adult = ADULT_TEETH_POSITIONS.find(t => t.number === number);
  if (adult) return `${adult.number} - ${adult.name}`;
  
  const primary = PRIMARY_TEETH_POSITIONS.find(t => t.number === number);
  if (primary) return `${primary.number} - ${primary.name}`;
  
  return `Tooth ${number}`;
};

// Get quadrant from tooth number
export const getQuadrant = (number: number): string => {
  const firstDigit = Math.floor(number / 10);
  switch(firstDigit) {
    case 1: return 'Upper Right';
    case 2: return 'Upper Left';
    case 3: return 'Lower Left';
    case 4: return 'Lower Right';
    case 5: return 'Upper Right (Primary)';
    case 6: return 'Upper Left (Primary)';
    case 7: return 'Lower Left (Primary)';
    case 8: return 'Lower Right (Primary)';
    default: return 'Unknown';
  }
};

// Format teeth list for display
export const formatTeethList = (teeth: number[]): string => {
  if (teeth.length === 0) return 'None';
  if (teeth.length === 1) return getToothName(teeth[0]);
  
  // Group by quadrant
  const byQuadrant: { [key: string]: number[] } = {};
  teeth.forEach(tooth => {
    const quadrant = getQuadrant(tooth);
    if (!byQuadrant[quadrant]) byQuadrant[quadrant] = [];
    byQuadrant[quadrant].push(tooth);
  });
  
  const parts: string[] = [];
  Object.entries(byQuadrant).forEach(([quadrant, nums]) => {
    nums.sort((a, b) => a - b);
    parts.push(`${quadrant}: ${nums.join(', ')}`);
  });
  
  return parts.join(' | ');
};

// Check if tooth number is valid
export const isValidToothNumber = (number: number): boolean => {
  return ADULT_TEETH_POSITIONS.some(t => t.number === number) ||
         PRIMARY_TEETH_POSITIONS.some(t => t.number === number);
};

// Get all teeth in a quadrant
export const getQuadrantTeeth = (quadrant: 1 | 2 | 3 | 4 | 5): number[] => {
  const adult = ADULT_TEETH_POSITIONS.filter(t => t.quadrant === quadrant).map(t => t.number);
  const primary = PRIMARY_TEETH_POSITIONS.filter(t => t.quadrant === quadrant).map(t => t.number);
  return [...adult, ...primary];
};
