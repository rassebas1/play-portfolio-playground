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
}

/**
 * Game board represented as a 2D array of tile values
 * 0 represents an empty cell
 */
export type Board = number[][];

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
}

/**
 * Move result containing the new board state and metadata
 */
export interface MoveResult {
  board: Board;
  score: number;
  moved: boolean;
  hasWon?: boolean;
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