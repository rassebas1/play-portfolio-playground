/**
 * Type definitions for 2048 Game.
 * Contains all game-specific types and interfaces used throughout the 2048 game.
 */

/**
 * Represents a single tile on the game board.
 * @interface Tile
 * @property {string} id - A unique identifier for the tile.
 * @property {number} value - The numerical value displayed on the tile (e.g., 2, 4, 8, ...).
 * @property {number} row - The current row index of the tile on the board.
 * @property {number} col - The current column index of the tile on the board.
 * @property {boolean} [isNew] - Optional: True if this tile was just created, used for entry animation.
 * @property {boolean} [isMerged] - Optional: True if this tile was just merged, used for merge animation.
 * @property {{ row: number; col: number }} [previousPosition] - Optional: The tile's position before the current move, used for movement animation.
 * @property {boolean} [isRemoved] - Optional: True if this tile is to be removed (e.g., after merging into another tile).
 * @property {string} [mergeWith] - Optional: The ID of the tile this tile is merging into.
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
 * Game board represented as a 2D array of Tile objects or null for empty cells.
 * @typedef {(Tile | null)[][]} Board
 */
export type Board = (Tile | null)[][];

/**
 * Available movement directions for tiles on the board.
 * @typedef {'up' | 'down' | 'left' | 'right'} Direction
 */
export type Direction = 'up' | 'down' | 'left' | 'right';
