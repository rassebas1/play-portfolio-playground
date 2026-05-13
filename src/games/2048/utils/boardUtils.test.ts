import { describe, it, expect, vi } from 'vitest';
import { createEmptyBoard, getEmptyPositions, isBoardFull, initializeBoard } from './boardUtils';
import * as tileUtils from './tileUtils';
import type { Tile } from '@/games/2048/types';

const tile = (value: number, id: string): Tile => ({ id, value, row: 0, col: 0 });

describe('createEmptyBoard', () => {
  it('creates a 4x4 board with all null cells', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(4);
    board.forEach(row => {
      expect(row).toHaveLength(4);
      row.forEach(cell => expect(cell).toBeNull());
    });
  });
});

describe('getEmptyPositions', () => {
  it('returns all 16 positions on an empty board', () => {
    const board = createEmptyBoard();
    expect(getEmptyPositions(board)).toHaveLength(16);
  });

  it('returns correct count with some tiles placed', () => {
    const board = createEmptyBoard();
    board[0][0] = tile(2, 'a');
    board[2][3] = tile(4, 'b');
    expect(getEmptyPositions(board)).toHaveLength(14);
  });
});

describe('isBoardFull', () => {
  it('returns false for empty board', () => {
    expect(isBoardFull(createEmptyBoard())).toBe(false);
  });

  it('returns true when every cell is occupied', () => {
    const board = createEmptyBoard();
    let id = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        board[r][c] = tile(2, `t${id++}`);
      }
    }
    expect(isBoardFull(board)).toBe(true);
  });
});

describe('initializeBoard', () => {
  it('adds two random tiles to an empty board', () => {
    const addSpy = vi.spyOn(tileUtils, 'addRandomTile');
    const fakeTile1: Tile = { id: '1', value: 2, row: 0, col: 0, isNew: true, isMerged: false };
    const fakeTile2: Tile = { id: '2', value: 2, row: 1, col: 1, isNew: true, isMerged: false };
    addSpy.mockReturnValueOnce(fakeTile1).mockReturnValueOnce(fakeTile2);

    const state = initializeBoard(() => 'id');
    expect(state.tiles['1']).toEqual(fakeTile1);
    expect(state.tiles['2']).toEqual(fakeTile2);
    expect(state.byIds).toEqual(['1', '2']);
    expect(state.highScore).toBe(0);
    expect(addSpy).toHaveBeenCalledTimes(2);

    addSpy.mockRestore();
  });

  it('uses provided initialHighScore', () => {
    vi.spyOn(tileUtils, 'addRandomTile').mockReturnValue(null);
    const state = initializeBoard(() => 'id', 500);
    expect(state.highScore).toBe(500);
    vi.restoreAllMocks();
  });
});
