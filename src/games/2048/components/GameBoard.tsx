import React from 'react';
import { cn } from '@/lib/utils';
import { Tile } from './Tile';
import { Tile as TileType } from '../types'; // Import TileType for clarity

/**
 * Props for the GameBoard component.
 * @interface GameBoardProps
 * @property {TileType[]} animatedTiles - An array of Tile objects, including animation-related data.
 * @property {string} [className] - Optional additional CSS classes to apply to the game board container.
 */
interface GameBoardProps {
  animatedTiles: TileType[]; // Use TileType for clarity
  className?: string;
}

/**
 * GameBoard component for 2048.
 * Renders the 4x4 grid, including both empty background cells and the dynamic, animated tiles.
 * It uses CSS Grid for layout and `cn` utility for conditional class merging.
 *
 * @param {GameBoardProps} { animatedTiles, className } - Props passed to the component.
 * @returns {JSX.Element} The rendered 2048 game board.
 */
const GameBoard: React.FC<GameBoardProps> = ({ animatedTiles }) => {
  
  return (
    <div 
      className={cn(
        'relative w-full bg-muted/50 p-1 rounded-xl border-2 border-primary/20 shadow-elegant',
        'grid grid-cols-4 gap-1',
        'aspect-square max-w-xs mx-auto'
        
      )}
      role="grid" // ARIA role for accessibility
      style={{ minWidth: 320, minHeight: 320 }} // Ensure a minimum size for the board
      aria-label="2048 game board" // ARIA label for accessibility
    >
      {/* Render empty cells as background placeholders.
          These provide the visual grid structure even when no tiles are present. */}
      {Array.from({ length: 4 }, (_, rowIndex) =>
        Array.from({ length: 4 }, (_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`} // Unique key for each cell
            className="relative bg-muted/20 rounded-lg"
            role="gridcell" // ARIA role for accessibility
            aria-label={'Empty cell'} // ARIA label for accessibility
          />
        ))
      )}

      {/* Render actual tiles on top of the empty cells.
          These tiles are animated and represent the game's dynamic elements. */}
      {animatedTiles.map((tile) => (
        <Tile key={tile.id} tile={tile} /> // Render each animated tile
      ))}
    </div>
  );
};

export default GameBoard;