import React from 'react';
import type { Tile as TileType } from '../types';
import { cn } from '@/lib/utils'; // Utility for conditionally joining class names
import { ANIMATION_DURATION } from '@/utils/2048_const'; // Constant for animation duration

/**
 * Props for the Tile component.
 * @interface TileProps
 * @property {TileType} tile - The tile data object, containing its value, position, and animation states.
 */
interface TileProps {
  tile: TileType;
}

/**
 * React functional component for a single 2048 game tile.
 * It visually represents a tile on the game board, with dynamic styling based on its value
 * and animation effects for new, merged, and moving tiles.
 *
 * @param {TileProps} { tile } - Props passed to the component.
 * @returns {JSX.Element} The rendered tile.
 */
// Helper function to get tile color based on value
const getTileColor = (value: number): string => {
  const colorMap: { [key: number]: string } = {
    2: "bg-gray-300 text-gray-700",
    4: "bg-gray-400 text-gray-800",
    8: "bg-yellow-300 text-gray-900",
    16: "bg-yellow-400 text-gray-900",
    32: "bg-orange-400 text-white",
    64: "bg-orange-500 text-white",
    128: "bg-red-400 text-white",
    256: "bg-red-500 text-white",
    512: "bg-purple-400 text-white",
    1024: "bg-purple-500 text-white",
    2048: "bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/50",
  };
  
  if (colorMap[value]) {
    return colorMap[value];
  }
  
  // Dynamic gradient generator for values > 2048
  // Cycle through hues based on the power of 2
  const power = Math.log2(value);
  const hue = ((power - 11) * 25) % 360; // Start cycling after 2048 (2^11)
  const hue2 = (hue + 40) % 360;
  
  return `bg-gradient-to-br from-[hsl(${hue},80%,55%)] to-[hsl(${hue2},90%,45%)] text-white shadow-lg`;
};

// Helper function to get font size based on value
const getFontSize = (value: number): string => {
  if (value >= 10000) return "text-sm";
  if (value >= 1000) return "text-lg";
  if (value >= 100) return "text-xl";
  return "text-2xl";
};

export const Tile: React.FC<TileProps> = ({ tile }) => {
  // Get dynamic color and font size
  const colorClass = getTileColor(tile.value);
  const fontSizeClass = getFontSize(tile.value);
  
  // Dynamically generate CSS classes based on tile properties using `cn` utility.
  const tileClasses = cn(
    "absolute rounded-lg flex items-center justify-center font-bold",
    colorClass,
    fontSizeClass,
    `transition-all duration-${ANIMATION_DURATION} ease-out`, // Apply transition for smooth movement
    {
      // Animation classes for different tile states
      "scale-0 animate-scale-in": tile.isNew, // Scale-in animation for newly created tiles
      "animate-pop": tile.isMerged, // Pop animation for tiles that have just merged
      "z-10": tile.isMerged, // Ensure merged tiles are visually on top during animation
      "opacity-0 scale-0": tile.isRemoved, // Animate out removed tiles (e.g., tiles that merged into another)
    }
  );

  // Calculate inline styles for positioning and size.
  // These calculations ensure tiles fit correctly within the 4x4 grid with gaps.
  const style: React.CSSProperties = {
    width: 'calc(25% - 0.1875rem)', // Width of each tile (25% of parent minus gap adjustment)
    height: 'calc(25% - 0.1875rem)', // Height of each tile
    left: `calc(${tile.col} * (25% + 0.0625rem))`, // Horizontal position based on column
    top: `calc(${tile.row} * (25% + 0.0625rem))`, // Vertical position based on row
    zIndex: tile.isMerged ? 20 : 10, // Higher z-index for merged tiles during animation
  };

  // If the tile has a previous position, apply a transform to animate its movement.
  if (tile.previousPosition) {
    const deltaX = tile.previousPosition.col - tile.col; // Horizontal distance moved
    const deltaY = tile.previousPosition.row - tile.row; // Vertical distance moved
    style.transform = `translate(calc(${deltaX} * (100% + 0.25rem)), calc(${deltaY} * (100% + 0.25rem)))`;
  }

  return (
    <div
      className={cn(tileClasses)} // Apply combined CSS classes
      style={style} // Apply calculated inline styles
    >
      {tile.value} {/* Display the tile's numerical value */}
    </div>
  );
};