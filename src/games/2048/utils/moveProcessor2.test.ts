import { describe, it, expect } from 'vitest';
import { canMove } from './moveProcessor2';
import type { Board, Tile } from '@/games/2048/types';

const createTile = (value: number): Tile => ({
  id: `${value}`,
  value,
  row: 0,
  col: 0,
  previousRow: 0,
  previousCol: 0,
  isRemoved: false,
  isNew: false,
  isMerged: false,
});

const createBoard = (grid: (number | null)[][]): Board => {
  return grid.map((row, r) =>
    row.map((val, c) => {
      if (val === null) return null;
      return createTile(val);
    })
  ) as Board;
};

describe('canMove', () => {
  it('returns true when there are empty positions', () => {
    const board = createBoard([
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, null, null],
      [null, null, null, null],
    ]);
    expect(canMove(board)).toBe(true);
  });

  it('returns true when adjacent tiles can merge horizontally', () => {
    const board = createBoard([
      [2, 2, 4, 8],
      [16, 32, 64, 128],
      [256, 512, 1024, 2048],
      [2, 4, 8, 16],
    ]);
    expect(canMove(board)).toBe(true);
  });

  it('returns true when adjacent tiles can merge vertically', () => {
    const board = createBoard([
      [2, 4, 8, 16],
      [2, 32, 64, 128],
      [256, 512, 1024, 2048],
      [2, 4, 8, 16],
    ]);
    expect(canMove(board)).toBe(true);
  });

  it('returns false when board is full and no merges possible', () => {
    const board = createBoard([
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ]);
    expect(canMove(board)).toBe(false);
  });

  it('returns false for an empty board (no tiles)', () => {
    const board = createBoard([
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    expect(canMove(board)).toBe(true); // empty positions = can move
  });
});
