import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CellValue, Player } from '../types';

/**
 * Hook to detect prefers-reduced-motion
 */
const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

/**
 * PlayerIcon component - Displays X or O icon with proper styling
 */
interface PlayerIconProps {
  player: Player;
  className?: string;
  isGhost?: boolean;
}

const PlayerIcon: React.FC<PlayerIconProps> = ({ player, className, isGhost = false }) => {
  const iconClass = cn(
    "w-12 h-12 transition-all duration-300",
    player === 'X' ? "text-blue-500" : "text-orange-500",
    isGhost && "opacity-30 scale-75",
    className
  );

  if (player === 'X') {
    return <X className={iconClass} strokeWidth={3} />;
  }
  return <Circle className={iconClass} strokeWidth={3} />;
};

/**
 * Props for individual game cell component.
 */
interface GameCellProps {
  value: CellValue;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isWinningCell: boolean;
  isDisabled: boolean;
  rowIndex: number;
  colIndex: number;
  currentPlayer: Player;
  isGameActive: boolean;
  winningLineIndex: number;
  prefersReducedMotion: boolean;
  tabIndex: number;
}

/**
 * Individual cell component for the Tic Tac Toe board.
 */
const GameCell: React.FC<GameCellProps> = ({ 
  value, 
  onClick, 
  onKeyDown,
  isWinningCell, 
  isDisabled,
  rowIndex,
  colIndex,
  currentPlayer,
  isGameActive,
  winningLineIndex,
  prefersReducedMotion,
  tabIndex
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showBounce, setShowBounce] = useState(false);
  
  // Trigger bounce animation when value changes
  useEffect(() => {
    if (value && !prefersReducedMotion) {
      setShowBounce(true);
      const timer = setTimeout(() => setShowBounce(false), 400);
      return () => clearTimeout(timer);
    }
  }, [value, prefersReducedMotion]);

  return (
    <button
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={isDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={tabIndex}
      data-row={rowIndex}
      data-col={colIndex}
      className={cn(
        // Base styles - explicit sizing added
        "w-full h-full min-h-[80px] sm:min-h-[100px] flex items-center justify-center rounded-xl transition-all duration-200",
        "bg-card border-2 border-border relative overflow-hidden",
        
        // Focus styles for keyboard navigation
        "focus:outline-none focus:ring-4 focus:ring-primary/50 focus:border-primary",
        
        // Interactive states
        !isDisabled && "hover:border-primary/70 hover:bg-muted/50 cursor-pointer",
        !isDisabled && !value && "hover:scale-[1.02]",
        "disabled:cursor-not-allowed",
        
        // Winning cell animation
        isWinningCell && !prefersReducedMotion && "animate-winning-cell",
        isWinningCell && prefersReducedMotion && "bg-primary/30 border-primary"
      )}
      style={isWinningCell && !prefersReducedMotion ? {
        animationDelay: `${winningLineIndex * 150}ms`
      } : undefined}
      aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}, ${value || 'empty'}`}
    >
      {/* Background glow for winning cells */}
      {isWinningCell && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent",
          !prefersReducedMotion && "animate-pulse"
        )} />
      )}
      
      {/* Actual value with bounce animation */}
      {value && (
        <div className={cn(
          !prefersReducedMotion && showBounce && "animate-cell-place"
        )}>
          <PlayerIcon player={value} />
        </div>
      )}
      
      {/* Ghost preview on hover */}
      {!value && isHovered && isGameActive && !isDisabled && (
        <div className="animate-ghost-fade">
          <PlayerIcon player={currentPlayer} isGhost />
        </div>
      )}
    </button>
  );
};

/**
 * Props for the main game board component.
 */
interface GameBoardProps {
  onCellClick: (row: number, col: number) => void;
  getCellValue: (row: number, col: number) => CellValue;
  isCellInWinningLine: (row: number, col: number) => boolean;
  isGameActive: boolean;
  currentPlayer: Player;
  winningLine: { positions: { row: number; col: number }[] } | null;
}

/**
 * Main game board component for Tic Tac Toe.
 */
const GameBoard: React.FC<GameBoardProps> = ({
  onCellClick,
  getCellValue,
  isCellInWinningLine,
  isGameActive,
  currentPlayer,
  winningLine
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const { t } = useTranslation('common');

  // Get winning line index for a cell (for stagger animation)
  const getWinningLineIndex = useCallback((row: number, col: number): number => {
    if (!winningLine) return -1;
    return winningLine.positions.findIndex(pos => pos.row === row && pos.col === col);
  }, [winningLine]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent, row: number, col: number) => {
    if (!isGameActive && e.key !== 'Tab') {
      e.preventDefault();
      return;
    }

    let newRow = row;
    let newCol = col;
    let shouldMove = false;

    switch (e.key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1);
        shouldMove = newRow !== row;
        break;
      case 'ArrowDown':
        newRow = Math.min(2, row + 1);
        shouldMove = newRow !== row;
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1);
        shouldMove = newCol !== col;
        break;
      case 'ArrowRight':
        newCol = Math.min(2, col + 1);
        shouldMove = newCol !== col;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!getCellValue(row, col)) {
          onCellClick(row, col);
        }
        return;
      default:
        return;
    }

    if (shouldMove) {
      e.preventDefault();
      setFocusedCell({ row: newRow, col: newCol });
      // Focus the new cell
      const cell = boardRef.current?.querySelector(
        `[data-row="${newRow}"][data-col="${newCol}"]`
      ) as HTMLElement;
      cell?.focus();
    }
  }, [isGameActive, getCellValue, onCellClick]);

  // Update focused cell when clicking
  const handleCellClick = useCallback((row: number, col: number) => {
    setFocusedCell({ row, col });
    if (isGameActive && !getCellValue(row, col)) {
      onCellClick(row, col);
    }
  }, [isGameActive, getCellValue, onCellClick]);

  return (
    <div className="w-full">
      <div 
        ref={boardRef}
        role="grid"
        aria-label="Tic Tac Toe game board"
        className="grid grid-cols-3 gap-3 p-5 bg-muted/30 rounded-2xl border border-border shadow-lg w-full max-w-[360px] mx-auto"
      >
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 3 }, (_, col) => {
            const cellValue = getCellValue(row, col);
            const isWinningCell = isCellInWinningLine(row, col);
            const isDisabled = !isGameActive || !!cellValue;
            const winningLineIndex = getWinningLineIndex(row, col);

            return (
              <div
                key={`${row}-${col}`}
                role="gridcell"
                aria-rowindex={row + 1}
                aria-colindex={col + 1}
                aria-selected={!!cellValue}
              >
                <GameCell
                  value={cellValue}
                  onClick={() => handleCellClick(row, col)}
                  onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, row, col)}
                  isWinningCell={isWinningCell}
                  isDisabled={isDisabled}
                  rowIndex={row}
                  colIndex={col}
                  currentPlayer={currentPlayer}
                  isGameActive={isGameActive}
                  winningLineIndex={winningLineIndex}
                  prefersReducedMotion={prefersReducedMotion}
                  tabIndex={focusedCell.row === row && focusedCell.col === col ? 0 : -1}
                />
              </div>
            );
          })
        )}
      </div>
      
      {/* Keyboard instructions */}
      <p className="text-center text-xs text-muted-foreground mt-3">
        {t('keyboard_instructions')}
      </p>
    </div>
  );
};

export default GameBoard;
