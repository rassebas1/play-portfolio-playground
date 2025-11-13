import React from 'react';
import { cn } from '@/lib/utils'; // Utility for conditionally joining class names
import type { CellValue } from '../types';

/**
 * Props for individual game cell component.
 * @interface GameCellProps
 * @property {CellValue} value - The value of the cell ('X', 'O', or null).
 * @property {() => void} onClick - Callback function to be executed when the cell is clicked.
 * @property {boolean} isWinningCell - True if this cell is part of the winning line, false otherwise.
 * @property {boolean} isDisabled - True if the cell should be disabled (e.g., game not active, cell already filled).
 */
interface GameCellProps {
  value: CellValue;
  onClick: () => void;
  isWinningCell: boolean;
  isDisabled: boolean;
}

/**
 * Individual cell component for the Tic Tac Toe board.
 * Displays the cell's value ('X', 'O', or empty) and handles click interactions.
 * Applies dynamic styling based on its state (value, winning cell, disabled).
 *
 * @param {GameCellProps} { value, onClick, isWinningCell, isDisabled } - Props passed to the component.
 * @returns {JSX.Element} The rendered game cell.
 */
const GameCell: React.FC<GameCellProps> = ({ 
  value, 
  onClick, 
  isWinningCell, 
  isDisabled 
}) => {
  return (
    <button
      onClick={onClick} // Attach click handler
      disabled={isDisabled} // Disable button based on isDisabled prop
      className={cn(
        // Base styles for a cell button
        "aspect-square flex items-center justify-center text-4xl font-bold rounded-lg transition-all duration-200",
        "bg-card border-2 border-border hover:border-primary",
        
        // Interactive states (hover, active, disabled)
        "hover:bg-muted hover:scale-105 active:scale-95",
        "disabled:cursor-not-allowed disabled:hover:scale-100",
        
        // Winning cell highlighting
        isWinningCell && "bg-primary/20 border-primary shadow-lg",
        
        // Player-specific colors for 'X' and 'O'
        value === 'X' && "text-game-info",
        value === 'O' && "text-game-danger"
      )}
      aria-label={`Cell ${value || 'empty'}`} // ARIA label for accessibility
    >
      {value} {/* Display 'X', 'O', or empty */}
    </button>
  );
};

/**
 * Props for the main game board component.
 * @interface GameBoardProps
 * @property {(row: number, col: number) => void} onCellClick - Callback function for when a cell is clicked.
 * @property {(row: number, col: number) => CellValue} getCellValue - Function to retrieve the value of a cell.
 * @property {(row: number, col: number) => boolean} isCellInWinningLine - Function to check if a cell is part of the winning line.
 * @property {boolean} isGameActive - True if the game is currently active and moves are allowed.
 */
interface GameBoardProps {
  onCellClick: (row: number, col: number) => void;
  getCellValue: (row: number, col: number) => CellValue;
  isCellInWinningLine: (row: number, col: number) => boolean;
  isGameActive: boolean;
}

/**
 * Main game board component for Tic Tac Toe.
 * Renders a 3x3 grid of interactive `GameCell` components.
 * It manages the logic for enabling/disabling cells and passing click events.
 *
 * @param {GameBoardProps} { onCellClick, getCellValue, isCellInWinningLine, isGameActive } - Props passed to the component.
 * @returns {JSX.Element} The rendered Tic Tac Toe game board.
 */
const GameBoard: React.FC<GameBoardProps> = ({
  onCellClick,
  getCellValue,
  isCellInWinningLine,
  isGameActive
}) => {
  /**
   * Handles a click event on an individual cell.
   * Validates the move before calling the `onCellClick` prop.
   * @param {number} row - The row index of the clicked cell.
   * @param {number} col - The column index of the clicked cell.
   * @returns {void}
   */
  const handleCellClick = (row: number, col: number) => {
    // Only allow clicks if the game is active and the cell is currently empty
    if (isGameActive && !getCellValue(row, col)) {
      onCellClick(row, col); // Call the parent's onCellClick handler
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="grid grid-cols-3 gap-2 p-4 bg-muted/30 rounded-xl border border-border">
        {/* Generate a 3x3 grid of GameCell components */}
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 3 }, (_, col) => {
            const cellValue = getCellValue(row, col); // Get current value of the cell
            const isWinningCell = isCellInWinningLine(row, col); // Check if it's a winning cell
            const isDisabled = !isGameActive || !!cellValue; // Disable if game not active or cell is filled

            return (
              <GameCell
                key={`${row}-${col}`} // Unique key for each cell
                value={cellValue} // Pass cell value
                onClick={() => handleCellClick(row, col)} // Pass click handler
                isWinningCell={isWinningCell} // Pass winning cell status
                isDisabled={isDisabled} // Pass disabled status
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default GameBoard;