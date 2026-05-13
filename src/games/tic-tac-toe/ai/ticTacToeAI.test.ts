import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getEmptyCells,
  checkWinner,
  isBoardFull,
  makeMove,
  getAIMove,
  randomMove,
  blockOrWinMove,
  minimaxShallow,
  minimaxFull,
} from './ticTacToeAI';
import type { Board, Position, Player } from '../types';

const createEmptyBoard = (): Board => [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const createBoardWithMoves = (moves: Array<{ row: number; col: number; player: Player }>): Board => {
  const board = createEmptyBoard();
  for (const { row, col, player } of moves) {
    board[row][col] = player;
  }
  return board;
};

describe('TicTacToe AI - Utility Functions', () => {
  describe('getEmptyCells', () => {
    it('should return all cells for empty board', () => {
      const board = createEmptyBoard();
      const emptyCells = getEmptyCells(board);
      expect(emptyCells).toHaveLength(9);
    });

    it('should return only empty cells when board has some moves', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' },
        { row: 1, col: 1, player: 'O' },
      ]);
      const emptyCells = getEmptyCells(board);
      expect(emptyCells).toHaveLength(7);
      expect(emptyCells).not.toContainEqual({ row: 0, col: 0 });
      expect(emptyCells).not.toContainEqual({ row: 1, col: 1 });
    });

    it('should return empty array for full board', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' }, { row: 0, col: 1, player: 'O' },
        { row: 0, col: 2, player: 'X' }, { row: 1, col: 0, player: 'O' },
        { row: 1, col: 1, player: 'X' }, { row: 1, col: 2, player: 'O' },
        { row: 2, col: 0, player: 'X' }, { row: 2, col: 1, player: 'O' },
        { row: 2, col: 2, player: 'X' },
      ]);
      const emptyCells = getEmptyCells(board);
      expect(emptyCells).toHaveLength(0);
    });
  });

  describe('checkWinner', () => {
    it('should return null for empty board', () => {
      const board = createEmptyBoard();
      const result = checkWinner(board);
      expect(result.winner).toBeNull();
      expect(result.line).toBeNull();
    });

    it('should detect horizontal win (top row)', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' },
        { row: 0, col: 1, player: 'X' },
        { row: 0, col: 2, player: 'X' },
      ]);
      const result = checkWinner(board);
      expect(result.winner).toBe('X');
      expect(result.line).toEqual([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ]);
    });

    it('should detect horizontal win (middle row)', () => {
      const board = createBoardWithMoves([
        { row: 1, col: 0, player: 'O' },
        { row: 1, col: 1, player: 'O' },
        { row: 1, col: 2, player: 'O' },
      ]);
      const result = checkWinner(board);
      expect(result.winner).toBe('O');
    });

    it('should detect vertical win (left column)', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' },
        { row: 1, col: 0, player: 'X' },
        { row: 2, col: 0, player: 'X' },
      ]);
      const result = checkWinner(board);
      expect(result.winner).toBe('X');
    });

    it('should detect vertical win (middle column)', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 1, player: 'O' },
        { row: 1, col: 1, player: 'O' },
        { row: 2, col: 1, player: 'O' },
      ]);
      const result = checkWinner(board);
      expect(result.winner).toBe('O');
    });

    it('should detect diagonal win (top-left to bottom-right)', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' },
        { row: 1, col: 1, player: 'X' },
        { row: 2, col: 2, player: 'X' },
      ]);
      const result = checkWinner(board);
      expect(result.winner).toBe('X');
    });

    it('should detect diagonal win (top-right to bottom-left)', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 2, player: 'O' },
        { row: 1, col: 1, player: 'O' },
        { row: 2, col: 0, player: 'O' },
      ]);
      const result = checkWinner(board);
      expect(result.winner).toBe('O');
    });

    it('should return null when no winner', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' },
        { row: 0, col: 1, player: 'O' },
        { row: 0, col: 2, player: 'X' },
        { row: 1, col: 0, player: 'X' },
        { row: 1, col: 1, player: 'O' },
      ]);
      const result = checkWinner(board);
      expect(result.winner).toBeNull();
    });

    it('should return first winner found (if multiple rows have same player)', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' },
        { row: 0, col: 1, player: 'X' },
        { row: 0, col: 2, player: 'X' },
        { row: 1, col: 0, player: 'X' },
        { row: 1, col: 1, player: 'X' },
        { row: 1, col: 2, player: 'X' },
      ]);
      const result = checkWinner(board);
      expect(result.winner).toBe('X');
    });
  });

  describe('isBoardFull', () => {
    it('should return false for empty board', () => {
      const board = createEmptyBoard();
      expect(isBoardFull(board)).toBe(false);
    });

    it('should return true for full board', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' }, { row: 0, col: 1, player: 'O' },
        { row: 0, col: 2, player: 'X' }, { row: 1, col: 0, player: 'O' },
        { row: 1, col: 1, player: 'X' }, { row: 1, col: 2, player: 'O' },
        { row: 2, col: 0, player: 'X' }, { row: 2, col: 1, player: 'O' },
        { row: 2, col: 2, player: 'X' },
      ]);
      expect(isBoardFull(board)).toBe(true);
    });

    it('should return false for partially filled board', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' },
        { row: 1, col: 1, player: 'O' },
      ]);
      expect(isBoardFull(board)).toBe(false);
    });
  });

  describe('makeMove', () => {
    it('should place player at specified position', () => {
      const board = createEmptyBoard();
      const newBoard = makeMove(board, { row: 1, col: 1 }, 'X');
      expect(newBoard[1][1]).toBe('X');
    });

    it('should not modify original board', () => {
      const board = createEmptyBoard();
      makeMove(board, { row: 0, col: 0 }, 'X');
      expect(board[0][0]).toBeNull();
    });

    it('should only modify specified cell', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' },
      ]);
      const newBoard = makeMove(board, { row: 1, col: 1 }, 'O');
      expect(newBoard[0][0]).toBe('X');
      expect(newBoard[1][1]).toBe('O');
      expect(newBoard[2][2]).toBeNull();
    });
  });
});

describe('TicTacToe AI - Algorithms', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('randomMove', () => {
    it('should return null for full board', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' }, { row: 0, col: 1, player: 'O' },
        { row: 0, col: 2, player: 'X' }, { row: 1, col: 0, player: 'O' },
        { row: 1, col: 1, player: 'X' }, { row: 1, col: 2, player: 'O' },
        { row: 2, col: 0, player: 'X' }, { row: 2, col: 1, player: 'O' },
        { row: 2, col: 2, player: 'X' },
      ]);
      const move = randomMove(board, 'X');
      expect(move).toBeNull();
    });

    it('should return a valid position from empty cells', () => {
      const board = createEmptyBoard();
      const move = randomMove(board, 'X');
      expect(move).not.toBeNull();
      expect(move!.row).toBeGreaterThanOrEqual(0);
      expect(move!.row).toBeLessThanOrEqual(2);
      expect(move!.col).toBeGreaterThanOrEqual(0);
      expect(move!.col).toBeLessThanOrEqual(2);
    });
  });

  describe('blockOrWinMove', () => {
    it('should take winning move when available', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' },
        { row: 0, col: 1, player: 'X' },
      ]);
      const move = blockOrWinMove(board, 'X');
      expect(move).toEqual({ row: 0, col: 2 });
    });

    it('should block opponent winning move', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'O' },
        { row: 0, col: 1, player: 'O' },
      ]);
      const move = blockOrWinMove(board, 'X');
      expect(move).toEqual({ row: 0, col: 2 });
    });

    it('should take center when available', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' },
      ]);
      vi.spyOn(Math, 'random').mockReturnValue(0.9);
      const move = blockOrWinMove(board, 'X');
      expect(move).toEqual({ row: 1, col: 1 });
    });

    it('should take corner when center is taken', () => {
      const board = createBoardWithMoves([
        { row: 1, col: 1, player: 'X' },
      ]);
      vi.spyOn(Math, 'random').mockReturnValue(0.9);
      const move = blockOrWinMove(board, 'O');
      const corners = [
        { row: 0, col: 0 }, { row: 0, col: 2 },
        { row: 2, col: 0 }, { row: 2, col: 2 },
      ];
      expect(corners).toContainEqual(move);
    });
  });

  describe('minimaxShallow', () => {
    it('should return null for full board', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' }, { row: 0, col: 1, player: 'O' },
        { row: 0, col: 2, player: 'X' }, { row: 1, col: 0, player: 'O' },
        { row: 1, col: 1, player: 'X' }, { row: 1, col: 2, player: 'O' },
        { row: 2, col: 0, player: 'X' }, { row: 2, col: 1, player: 'O' },
        { row: 2, col: 2, player: 'X' },
      ]);
      const move = minimaxShallow(board, 'X');
      expect(move).toBeNull();
    });

    it('should find winning move', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'O' },
        { row: 0, col: 1, player: 'O' },
        { row: 1, col: 1, player: 'X' },
      ]);
      const move = minimaxShallow(board, 'X');
      expect(move).toEqual({ row: 0, col: 2 });
    });

    it('should return a valid position', () => {
      const board = createEmptyBoard();
      const move = minimaxShallow(board, 'X');
      expect(move).not.toBeNull();
      expect(board[move!.row][move!.col]).toBeNull();
    });
  });

  describe('minimaxFull', () => {
    it('should prefer center on first move', () => {
      const board = createEmptyBoard();
      const move = minimaxFull(board, 'X');
      expect(move).toEqual({ row: 1, col: 1 });
    });

    it('should prefer corner on first move when center taken', () => {
      const board = createBoardWithMoves([
        { row: 1, col: 1, player: 'X' },
      ]);
      const move = minimaxFull(board, 'O');
      const corners = [
        { row: 0, col: 0 }, { row: 0, col: 2 },
        { row: 2, col: 0 }, { row: 2, col: 2 },
      ];
      expect(corners).toContainEqual(move);
    });

    it('should find optimal move in middle game', () => {
      const board = createBoardWithMoves([
        { row: 0, col: 0, player: 'X' },
        { row: 1, col: 1, player: 'O' },
        { row: 2, col: 2, player: 'X' },
      ]);
      const move = minimaxFull(board, 'O');
      expect(move).not.toBeNull();
    });
  });
});

describe('TicTacToe AI - getAIMove', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should use random algorithm for beginner', () => {
    const board = createEmptyBoard();
    const result = getAIMove(board, 'beginner', 'X');
    expect(result.algorithm).toBe('random');
    expect(result.position).not.toBeNull();
  });

  it('should use block-win algorithm for easy', () => {
    const board = createBoardWithMoves([
      { row: 0, col: 0, player: 'O' },
      { row: 0, col: 1, player: 'O' },
    ]);
    const result = getAIMove(board, 'easy', 'X');
    expect(result.algorithm).toBe('block-win');
    expect(result.position).toEqual({ row: 0, col: 2 });
  });

  it('should use minimax-3 algorithm for medium', () => {
    const board = createEmptyBoard();
    const result = getAIMove(board, 'medium', 'X');
    expect(result.algorithm).toBe('minimax-3');
  });

  it('should use minimax-full algorithm for hard', () => {
    const board = createEmptyBoard();
    const result = getAIMove(board, 'hard', 'X');
    expect(result.algorithm).toBe('minimax-full');
  });

  it('should use minimax-mistake algorithm for expert', () => {
    const board = createEmptyBoard();
    const result = getAIMove(board, 'expert', 'X');
    expect(result.algorithm).toBe('minimax-mistake');
  });

  it('should return invalid position for full board', () => {
    const board = createBoardWithMoves([
      { row: 0, col: 0, player: 'X' }, { row: 0, col: 1, player: 'O' },
      { row: 0, col: 2, player: 'X' }, { row: 1, col: 0, player: 'O' },
      { row: 1, col: 1, player: 'X' }, { row: 1, col: 2, player: 'O' },
      { row: 2, col: 0, player: 'X' }, { row: 2, col: 1, player: 'O' },
      { row: 2, col: 2, player: 'X' },
    ]);
    const result = getAIMove(board, 'hard', 'X');
    expect(result.position).toEqual({ row: -1, col: -1 });
  });
});