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
export const Tile: React.FC<TileProps > = ({ tile }) => {
  // Dynamically generate CSS classes based on tile properties using `cn` utility.
  const tileClasses = cn(
    "absolute rounded-lg flex items-center justify-center text-2xl font-bold",
    `transition-all duration-${ANIMATION_DURATION} ease-out`, // Apply transition for smooth movement
    {
      // Background and text colors based on tile value
      "bg-gray-300 text-gray-700": tile.value === 2,
      "bg-gray-400 text-gray-800": tile.value === 4,
      "bg-yellow-300 text-gray-900": tile.value === 8,
      "bg-yellow-400 text-gray-900": tile.value === 16,
      "bg-orange-400 text-white": tile.value === 32,
      "bg-orange-500 text-white": tile.value === 64,
      "bg-red-400 text-white": tile.value === 128,
      "bg-red-500 text-white": tile.value === 256,
      "bg-purple-400 text-white": tile.value === 512,
      "bg-purple-500 text-white": tile.value === 1024,
      "bg-blue-500 text-white": tile.value === 2048,
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