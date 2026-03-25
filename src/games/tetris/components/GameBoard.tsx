/**
 * Tetris Game Board Component
 * Renders the game board with retro-cyberpunk aesthetic
 */

import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Piece, Position, Matrix } from '../types';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../constants';

interface GameBoardProps {
  board: Matrix;
  currentPiece: Piece | null;
  ghostPosition: Position | null;
  clearedLines: number[];
  isMobile?: boolean;
  gameStatus?: string;
  className?: string;
}

// Individual cell component for better performance
const Cell = memo<{
  color: string | number;
  isGhost?: boolean;
  isCurrentPiece?: boolean;
  isClearing?: boolean;
}>(({ color, isGhost, isCurrentPiece, isClearing }) => {
  return (
    <div
      className={cn(
        'w-full h-full border border-white/10 transition-all duration-100',
        // Base style - empty cell
        color === 0 || color === '0'
          ? 'bg-black/40'
          : // Filled cell with neon glow
            'shadow-[inset_0_0_10px_rgba(255,255,255,0.3)]',
        // Ghost piece styling
        isGhost && 'opacity-30 bg-transparent border-dashed border-white/40',
        // Current piece glow effect
        isCurrentPiece && !isGhost && 'shadow-[0_0_15px_currentColor,inset_0_0_10px_rgba(255,255,255,0.5)]',
        // Line clearing animation
        isClearing && 'animate-pulse bg-white/80'
      )}
      style={{
        backgroundColor: (color !== 0 && color !== '0' ? String(color) : undefined) as string | undefined,
      }}
    />
  );
});

Cell.displayName = 'Cell';

export const GameBoard = memo(function GameBoard({
  board,
  currentPiece,
  ghostPosition,
  clearedLines,
  isMobile = false,
  gameStatus = 'idle',
  className,
}: GameBoardProps) {
  // Create a 2D array for rendering
  const renderGrid: (string | number)[][] = React.useMemo(() => {
    // Copy the board
    const grid = board.map((row) => [...row]);

    // Add ghost piece
    if (ghostPosition && currentPiece) {
      currentPiece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell !== 0) {
            const y = ghostPosition.y + rowIndex;
            const x = ghostPosition.x + colIndex;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              // Store as string with 'ghost' marker
              grid[y][x] = 'ghost';
            }
          }
        });
      });
    }

    // Add current piece
    if (currentPiece) {
      currentPiece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell !== 0) {
            const y = currentPiece.position.y + rowIndex;
            const x = currentPiece.position.x + colIndex;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              // Use color from tetromino definition
              const colorMap: Record<string, string> = {
                I: '#00f5ff',
                O: '#ffde00',
                T: '#bf00ff',
                S: '#00ff88',
                Z: '#ff3366',
                J: '#3366ff',
                L: '#ff9933',
              };
              grid[y][x] = colorMap[currentPiece.type] || cell;
            }
          }
        });
      });
    }

    return grid;
  }, [board, currentPiece, ghostPosition]);

  return (
    <div
      className={cn(
        'relative bg-black/80 rounded-lg overflow-hidden border-2',
        'shadow-[0_0_30px_rgba(0,245,255,0.2),inset_0_0_50px_rgba(0,0,0,0.8)]',
        className
      )}
      style={{
        // Retro scanline effect overlay
        backgroundImage: `
          linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
          linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))
        `,
        backgroundSize: '100% 4px, 3px 100%',
      }}
    >
      {/* Grid container */}
      <div
        className="grid gap-[1px] p-1"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, minmax(0, 1fr))`,
          width: 'min(85vw, 280px)',
          height: 'min(85vw * 2, 560px)',
          aspectRatio: `${BOARD_WIDTH}/${BOARD_HEIGHT}`,
        }}
      >
        {renderGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            // Determine cell type
            const isGhost = cell === 'ghost';
            const isCurrentPiece = !isGhost && cell !== 0 && cell !== '0';
            const isClearing = clearedLines.includes(rowIndex);

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                color={isGhost ? 0 : cell}
                isGhost={isGhost}
                isCurrentPiece={isCurrentPiece}
                isClearing={isClearing}
              />
            );
          })
        )}
      </div>

      {/* CRT glow effect at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,245,255,0.3), transparent)',
        }}
      />

      {/* Game status text overlay */}
      {(gameStatus === 'idle' || gameStatus === 'paused' || gameStatus === 'game_over') && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: gameStatus === 'idle' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.85)' }}
        >
          <div className="text-center">
            {gameStatus === 'idle' && (
              <p className="text-white text-lg font-bold animate-pulse">
                {isMobile ? 'Tap to Start' : 'Press SPACE to Start'}
              </p>
            )}
            {gameStatus === 'paused' && (
              <p className="text-white text-lg font-bold">
                {isMobile ? 'Tap to Resume' : 'Press P to Resume'}
              </p>
            )}
            {gameStatus === 'game_over' && (
              <p className="text-white text-lg font-bold">
                {isMobile ? 'Double-tap to Restart' : 'Press R to Restart'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default GameBoard;
