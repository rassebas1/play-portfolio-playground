/**
 * Tetris Game Types
 * TypeScript interfaces for the Tetris game state and logic
 */

import { TetrominoType, BOARD_WIDTH, BOARD_HEIGHT } from './constants';

// 2D matrix for tetromino shapes (0 = empty, 1 = filled)
// Board uses string colors instead of numbers
export type Matrix = (number | string)[][];

// Position on the board
export interface Position {
  x: number;
  y: number;
}

// Tetromino piece with its position and rotation state
export interface Piece {
  type: TetrominoType;
  shape: Matrix;
  position: Position;
  rotation: RotationState;
}

// Rotation states
export type RotationState = 0 | 1 | 2 | 3; // 0=original, R=90°, 2=180°, L=270°

// Direction for movement
export type MoveDirection = 'left' | 'right' | 'down';

// Direction for rotation
export type RotateDirection = 'clockwise' | 'counterclockwise';

// Game status
export type GameStatus = 'idle' | 'playing' | 'paused' | 'game_over';

// Tetris game state
export interface TetrisState {
  // Board state - 2D array where each cell contains color string or 0 for empty
  board: Matrix;
  
  // Current falling piece
  currentPiece: Piece | null;
  
  // Next piece to appear
  nextPiece: TetrominoType | null;
  
  // Hold piece (can be used once per drop)
  holdPiece: TetrominoType | null;
  canHold: boolean;
  
  // Score and stats
  score: number;
  level: number;
  lines: number;
  
  // Game status
  status: GameStatus;
  
  // Lines cleared in last drop (for animation)
  clearedLines: number[];
  
  // Ghost piece position (where piece will land)
  ghostPosition: Position | null;
}

// Action types for reducer
export type TetrisAction =
  | { type: 'NEW_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'MOVE_DOWN' }
  | { type: 'ROTATE'; direction: RotateDirection }
  | { type: 'HARD_DROP' }
  | { type: 'SOFT_DROP' }
  | { type: 'HOLD_PIECE' }
  | { type: 'TICK' }
  | { type: 'LINE_CLEAR'; lines: number[] }
  | { type: 'GAME_OVER' };

// Input keys
export interface TetrisControls {
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  rotateClockwise: () => void;
  rotateCounterclockwise: () => void;
  hardDrop: () => void;
  hold: () => void;
  pause: () => void;
  restart: () => void;
}

// Board cell type for rendering (string = color hex, 0 = empty)
export interface CellData {
  value: number | string;
  color: string;
}

// Animation data for pieces
export interface AnimatedPiece {
  type: TetrominoType;
  position: Position;
  shape: Matrix;
  color: string;
  isGhost?: boolean;
}
