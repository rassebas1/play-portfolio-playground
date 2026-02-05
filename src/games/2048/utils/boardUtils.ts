import type { Board, Tile } from '../types';
import { addRandomTile } from './tileUtils';
import { GameState, initialState } from '../GameReducer';

/**
 * Creates an empty 4x4 board.
 * The board is represented as a 2D array of Tile objects.
 */
export const createEmptyBoard = (): Board => {
  return Array(4).fill(null).map(() => Array(4).fill(null));
};

/**
 * Gets all empty positions on the board.
 * An empty position is one where the tile is null.
 */
export const getEmptyPositions = (board: Board): Array<{ row: number; col: number }> => {
  const empty: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === null) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
};

/**
 * Checks if the board is full (no empty positions).
 */
export const isBoardFull = (board: Board): boolean => {
  return getEmptyPositions(board).length === 0;
};

/**
 * Initializes the game board with two random tiles.
 */
export const initializeBoard = (getNextId: () => string, initialHighScore: number = 0): GameState => {
  let state: GameState = {
    ...initialState,
    tiles: { ...initialState.tiles },
    byIds: [...initialState.byIds],
    highScore: initialHighScore, // Set the initial high score
  };

  const tile1 = addRandomTile(state.tiles, state.byIds, getNextId());
  if (tile1) {
    state.tiles[tile1.id] = tile1;
    state.byIds.push(tile1.id);
  }

  const tile2 = addRandomTile(state.tiles, state.byIds, getNextId());
  if (tile2) {
    state.tiles[tile2.id] = tile2;
    state.byIds.push(tile2.id);
  }

  return state;
};