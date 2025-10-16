import type { Board } from './types';
import { getEmptyPositions } from './boardUtils';

/**
 * Checks if any moves are possible on the board.
 */
export const canMove = (board: Board): boolean => {
  if (getEmptyPositions(board).length > 0) return true;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const current = board[row][col];
      if (current) {
        if (col < 3 && board[row][col + 1]?.value === current.value) return true;
        if (row < 3 && board[row + 1][col]?.value === current.value) return true;
      }
    }
  }

  return false;
};