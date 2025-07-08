// decorPositionsMap.ts
// This file defines the position of each decor item in the game screen

// Define the type for position data
export interface DecorPosition {
  top: string;
  left: string;
  zIndex: number;
  scale: number;
  rotation?: number; // Optional rotation in degrees
}

// Map each decor item ID to its position on screen
export const decorPositionsMap: Record<string, DecorPosition> = {
  // Wall decorations (upper part of the screen)
  decor1: { top: "20%", left: "20%", zIndex: 15, scale: 0.7 },
  decor2: { top: "15%", left: "70%", zIndex: 15, scale: 0.8 },
  decor3: { top: "25%", left: "85%", zIndex: 15, scale: 0.6 },

  // Floor decorations (lower part of the screen)
  decor4: { top: "75%", left: "12%", zIndex: 25, scale: 0.65 },
  decor5: { top: "70%", left: "80%", zIndex: 25, scale: 0.7 },

  // Table decorations (middle of the screen)
  decor6: { top: "50%", left: "50%", zIndex: 30, scale: 0.5, rotation: 15 },
  decor7: { top: "45%", left: "30%", zIndex: 30, scale: 0.5 },

  // Add more positions as needed for your specific decor items
};

// Function to get position for a decor item, with default fallback
export const getDecorPosition = (decorId: string): DecorPosition => {
  return (
    decorPositionsMap[decorId] || {
      top: "50%",
      left: "50%",
      zIndex: 20,
      scale: 0.7,
    }
  );
};
