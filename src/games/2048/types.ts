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
  isRemoved?: boolean;
  mergeWith?: string;
}

/**
 * Game board represented as a 2D array of Tile objects
 * 0 represents an empty cell
 */
export type Board = (Tile | null)[][];

/**
 * Available movement directions
 */
export type Direction = 'up' | 'down' | 'left' | 'right';
