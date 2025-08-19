import React from 'react';
import { cn } from '@/lib/utils';
import type { Board } from '../types';

/**
 * Props for the GameBoard component
 */
interface GameBoardProps {
  board: Board;
  className?: string;
}

/**
 * GameBoard component for 2048
 * Renders the 4x4 grid with tiles and handles tile styling
 */
const GameBoard: React.FC<GameBoardProps> = ({ board, className }) => {
  /**
   * Gets the appropriate styling classes for a tile based on its value
   */
  const getTileClasses = (value: number): string => {
    const baseClasses = 'absolute inset-1 rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-300 ease-in-out';
    
    if (value === 0) {
      return cn(baseClasses, 'bg-muted/30');
    }

    // Define colors for different tile values
    const tileStyles: Record<number, string> = {
      2: 'bg-background text-foreground border-2 border-primary/20',
      4: 'bg-primary/10 text-foreground border-2 border-primary/30',
      8: 'bg-primary/20 text-foreground border-2 border-primary/40',
      16: 'bg-primary/30 text-foreground border-2 border-primary/50',
      32: 'bg-primary/40 text-primary-foreground border-2 border-primary/60',
      64: 'bg-primary/60 text-primary-foreground border-2 border-primary/70',
      128: 'bg-primary/70 text-primary-foreground border-2 border-primary/80 text-xl',
      256: 'bg-primary/80 text-primary-foreground border-2 border-primary/90 text-xl',
      512: 'bg-primary text-primary-foreground border-2 border-primary text-xl',
      1024: 'bg-gradient-to-br from-primary to-primary-dark text-primary-foreground border-2 border-primary text-lg shadow-glow',
      2048: 'bg-gradient-to-br from-accent to-accent-glow text-accent-foreground border-2 border-accent text-lg shadow-elegant animate-pulse',
    };

    // For values higher than 2048, use the 2048 style
    const styleKey = value <= 2048 ? value : 2048;
    return cn(baseClasses, tileStyles[styleKey] || tileStyles[2048]);
  };

  /**
   * Formats large numbers for display (e.g., 1024 -> 1K)
   */
  const formatTileValue = (value: number): string => {
    if (value === 0) return '';
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div 
      className={cn(
        'relative bg-muted/50 p-2 rounded-xl border-2 border-primary/20 shadow-elegant',
        'grid grid-cols-4 gap-2',
        'w-80 h-80',
        className
      )}
      role="grid"
      aria-label="2048 game board"
    >
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="relative bg-muted/20 rounded-lg"
            role="gridcell"
            aria-label={value === 0 ? 'Empty cell' : `Tile with value ${value}`}
          >
            <div className={getTileClasses(value)}>
              {formatTileValue(value)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard;