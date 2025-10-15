/**
 * Type definitions for 2048 Game
 * Contains all game-specific types and interfaces
 */

/**
 * Represents a single tile on the game board
 */
export interface Tile {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
  previousPosition?: { row: number; col: number };
  mergedFrom?: string[]; // IDs of tiles that merged into this one
}

/**
 * Game board represented as a 2D array of Tile objects
 * null represents an empty cell
 */
export type Board = (Tile | null)[][];

/**
 * Available movement directions
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Game state interface for 2048
 */
export interface Game2048State {
  board: Board;
  score: number;
  bestScore: number;
  isGameOver: boolean;
  isWon: boolean;
  canUndo: boolean;
  moveCount: number;
  animations: TileAnimation[];
}

/**
 * Move result containing the new board state and metadata
 */
export interface MoveResult {
  board: Board;
  score: number;
  moved: boolean;
  hasWon?: boolean;
  animations: TileAnimation[];
}

/**
 * Animation data for tile movements
 */
export interface TileAnimation {
  from: { row: number; col: number };
  to: { row: number; col: number };
  value: number;
  isMerged?: boolean;
}