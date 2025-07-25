import React from 'react';
import { cn } from '@/lib/utils';
import type { CellValue } from '../types';

/**
 * Props for individual game cell component
 */
interface GameCellProps {
  value: CellValue;
  onClick: () => void;
  isWinningCell: boolean;
  isDisabled: boolean;
}

/**
 * Individual cell component for the Tic Tac Toe board
 * Displays the cell value and handles click interactions
 */
const GameCell: React.FC<GameCellProps> = ({ 
  value, 
  onClick, 
  isWinningCell, 
  isDisabled 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        // Base styles
        "aspect-square flex items-center justify-center text-4xl font-bold rounded-lg transition-all duration-200",
        "bg-card border-2 border-border hover:border-primary",
        
        // Interactive states
        "hover:bg-muted hover:scale-105 active:scale-95",
        "disabled:cursor-not-allowed disabled:hover:scale-100",
        
        // Winning cell highlighting
        isWinningCell && "bg-primary/20 border-primary shadow-lg",
        
        // Player-specific colors
        value === 'X' && "text-game-info",
        value === 'O' && "text-game-danger"
      )}
      aria-label={`Cell ${value || 'empty'}`}
    >
      {value}
    </button>
  );
};

/**
 * Props for the main game board component
 */
interface GameBoardProps {
  onCellClick: (row: number, col: number) => void;
  getCellValue: (row: number, col: number) => CellValue;
  isCellInWinningLine: (row: number, col: number) => boolean;
  isGameActive: boolean;
}

/**
 * Main game board component for Tic Tac Toe
 * Renders a 3x3 grid of interactive cells
 */
const GameBoard: React.FC<GameBoardProps> = ({
  onCellClick,
  getCellValue,
  isCellInWinningLine,
  isGameActive
}) => {
  /**
   * Handles cell click with row and column validation
   */
  const handleCellClick = (row: number, col: number) => {
    // Only allow clicks if game is active and cell is empty
    if (isGameActive && !getCellValue(row, col)) {
      onCellClick(row, col);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="grid grid-cols-3 gap-2 p-4 bg-muted/30 rounded-xl border border-border">
        {/* Generate 3x3 grid of cells */}
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 3 }, (_, col) => {
            const cellValue = getCellValue(row, col);
            const isWinningCell = isCellInWinningLine(row, col);
            const isDisabled = !isGameActive || !!cellValue;

            return (
              <GameCell
                key={`${row}-${col}`}
                value={cellValue}
                onClick={() => handleCellClick(row, col)}
                isWinningCell={isWinningCell}
                isDisabled={isDisabled}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default GameBoard;