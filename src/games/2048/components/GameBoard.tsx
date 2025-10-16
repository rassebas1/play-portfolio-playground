import React from 'react';
import { cn } from '@/lib/utils';
import type { Tile } from '../types';
import { Tile } from './Tile';

/**
 * Props for the GameBoard component
 */
interface GameBoardProps {
  animatedTiles: Tile[];
  className?: string;
}

/**
 * GameBoard component for 2048
 * Renders the 4x4 grid with tiles and handles tile styling
 */
const GameBoard: React.FC<GameBoardProps> = ({ animatedTiles }) => {
  
  return (
    <div 
      className={cn(
        'relative w-full bg-muted/50 p-1 rounded-xl border-2 border-primary/20 shadow-elegant',
        'grid grid-cols-4 gap-1',
        'aspect-square max-w-xs mx-auto'
        
      )}
      role="grid"
      style={{ minWidth: 320, minHeight: 320 }}
      aria-label="2048 game board"
    >
      {/* Render empty cells as background */}
      {Array.from({ length: 4 }, (_, rowIndex) =>
        Array.from({ length: 4 }, (_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="relative bg-muted/20 rounded-lg"
            role="gridcell"
            aria-label={'Empty cell'}
          />
        ))
      )}

      {/* Render actual tiles */}
      {animatedTiles.map((tile) => (
        <Tile key={tile.id} tile={tile} />
      ))}
    </div>
  );
};

export default GameBoard;