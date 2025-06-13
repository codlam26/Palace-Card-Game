// hooks/useTablePositions.ts

interface TablePosition {
  top: string;
  left: string;
  rotation: number; // degrees
}

export function useTablePositions(playerCount: number): TablePosition[] {
  const positionsMap: { [key: number]: TablePosition[] } = {
    1: [
      { top: '20%', left: '50%', rotation: 180 }, // Top
    ],
    2: [
      { top: '50%', left: '90%', rotation: -90 }, // Right
      { top: '20%', left: '50%', rotation: 180 }, // Top
    ],
    3: [
      { top: '20%', left: '50%', rotation: 180 }, // Top
      { top: '50%', left: '10%', rotation: 90 },  // Left
      { top: '50%', left: '90%', rotation: -90 }, // Right
    ],
    4: [
      { top: '20%', left: '50%', rotation: 180 }, // Top
      { top: '50%', left: '10%', rotation: 90 },  // Left
      { top: '50%', left: '90%', rotation: -90 }, // Right
      { top: '90%', left: '50%', rotation: 0 },   // Bottom (opposite of you, optional)
    ],
    5: [
      { top: '20%', left: '50%', rotation: 180 }, // Top
      { top: '25%', left: '15%', rotation: 90 },  // Upper Left
      { top: '25%', left: '85%', rotation: -90 }, // Upper Right
      { top: '70%', left: '15%', rotation: 90 },  // Lower Left
      { top: '70%', left: '85%', rotation: -90 }, // Lower Right
    ],
    6: [
      { top: '10%', left: '50%', rotation: 180 }, // Top
      { top: '25%', left: '15%', rotation: 90 },  // Upper Left
      { top: '25%', left: '85%', rotation: -90 }, // Upper Right
      { top: '75%', left: '15%', rotation: 90 },  // Lower Left
      { top: '75%', left: '85%', rotation: -90 }, // Lower Right
      { top: '90%', left: '50%', rotation: 0 },   // Bottom (opposite of you)
    ],
  };

  return positionsMap[playerCount] || [];
}
