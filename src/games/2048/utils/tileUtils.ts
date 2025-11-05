import type { Board, Tile } from '../types';
import { getEmptyPositions } from './boardUtils';
import { TILE_COUNT_PER_ROW_OR_COLUMN } from '@/util_const';

/**
 * Adds a random tile (2 or 4) to an empty position on the board.
 * The new tile is marked as `isNew` for animation purposes.
 */
export const addRandomTile = (currentTiles: { [id: string]: Tile }, currentByIds: string[], nextId: string): Tile | null => {
  const board: Board = Array(TILE_COUNT_PER_ROW_OR_COLUMN).fill(null).map(() => Array(TILE_COUNT_PER_ROW_OR_COLUMN).fill(null));
  currentByIds.forEach(id => {
    const tile = currentTiles[id];
    if (tile) {
      board[tile.row][tile.col] = tile;
    }
  });

  const emptyPositions = getEmptyPositions(board);
  if (emptyPositions.length === 0) return null;

  const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const value = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2, 10% for 4
  
  return {
    id: nextId,
    value,
    row: randomPosition.row,
    col: randomPosition.col,
    isNew: true,
    isMerged: false,
  };
};