import { describe, it, expect } from 'vitest';
import { processMove } from './moveProcessor';
import type { Board, Tile } from '@/games/2048/types';

const tile = (value: number, id: string, row: number, col: number): Tile => ({
  id, value, row, col,
});

const emptyBoard = (): Board => Array(4).fill(null).map(() => Array(4).fill(null));

describe('processMove', () => {
  describe('move left', () => {
    it('shifts tiles left', () => {
      const board = emptyBoard();
      board[0][2] = tile(2, 'a', 0, 2);
      board[0][3] = tile(4, 'b', 0, 3);
      const result = processMove(board, 'left');
      expect(result.board[0][0]?.value).toBe(2);
      expect(result.board[0][1]?.value).toBe(4);
      expect(result.board[0][2]).toBeNull();
      expect(result.moved).toBe(true);
    });

    it('merges equal tiles when moving left', () => {
      const board = emptyBoard();
      board[0][0] = tile(2, 'a', 0, 0);
      board[0][1] = tile(2, 'b', 0, 1);
      const result = processMove(board, 'left');
      expect(result.board[0][0]?.value).toBe(4);
      expect(result.board[0][0]?.isMerged).toBe(true);
      expect(result.score).toBe(4);
      expect(result.moved).toBe(true);
    });

    it('does not move when already compacted left', () => {
      const board = emptyBoard();
      board[0][0] = tile(2, 'a', 0, 0);
      board[0][1] = tile(4, 'b', 0, 1);
      const result = processMove(board, 'left');
      expect(result.moved).toBe(false);
    });
  });

  describe('move right', () => {
    it('shifts tiles right', () => {
      const board = emptyBoard();
      board[0][0] = tile(2, 'a', 0, 0);
      board[0][1] = tile(4, 'b', 0, 1);
      const result = processMove(board, 'right');
      expect(result.board[0][2]?.value).toBe(2);
      expect(result.board[0][3]?.value).toBe(4);
      expect(result.moved).toBe(true);
    });

    it('merges equal tiles when moving right', () => {
      const board = emptyBoard();
      board[0][2] = tile(2, 'a', 0, 2);
      board[0][3] = tile(2, 'b', 0, 3);
      const result = processMove(board, 'right');
      expect(result.board[0][3]?.value).toBe(4);
      expect(result.board[0][3]?.isMerged).toBe(true);
      expect(result.score).toBe(4);
    });
  });

  describe('move up', () => {
    it('shifts tiles up', () => {
      const board = emptyBoard();
      board[2][0] = tile(2, 'a', 2, 0);
      board[3][0] = tile(4, 'b', 3, 0);
      const result = processMove(board, 'up');
      expect(result.board[0][0]?.value).toBe(2);
      expect(result.board[1][0]?.value).toBe(4);
      expect(result.moved).toBe(true);
    });

    it('merges equal tiles when moving up', () => {
      const board = emptyBoard();
      board[0][0] = tile(2, 'a', 0, 0);
      board[1][0] = tile(2, 'b', 1, 0);
      const result = processMove(board, 'up');
      expect(result.board[0][0]?.value).toBe(4);
      expect(result.score).toBe(4);
    });
  });

  describe('move down', () => {
    it('shifts tiles down', () => {
      const board = emptyBoard();
      board[0][0] = tile(2, 'a', 0, 0);
      board[1][0] = tile(4, 'b', 1, 0);
      const result = processMove(board, 'down');
      expect(result.board[2][0]?.value).toBe(2);
      expect(result.board[3][0]?.value).toBe(4);
      expect(result.moved).toBe(true);
    });

    it('merges equal tiles when moving down', () => {
      const board = emptyBoard();
      board[2][0] = tile(2, 'a', 2, 0);
      board[3][0] = tile(2, 'b', 3, 0);
      const result = processMove(board, 'down');
      expect(result.board[3][0]?.value).toBe(4);
      expect(result.score).toBe(4);
    });
  });

  describe('win detection', () => {
    it('detects a 2048 tile on the board', () => {
      const board = emptyBoard();
      board[0][0] = tile(2048, 'win', 0, 0);
      const result = processMove(board, 'left');
      expect(result.hasWon).toBe(true);
    });

    it('does not set hasWon without a 2048 tile', () => {
      const board = emptyBoard();
      board[0][0] = tile(1024, 'a', 0, 0);
      const result = processMove(board, 'left');
      expect(result.hasWon).toBe(false);
    });
  });

  describe('animatedTiles', () => {
    it('marks merged tiles as removed', () => {
      const board = emptyBoard();
      board[0][0] = tile(2, 'a', 0, 0);
      board[0][1] = tile(2, 'b', 0, 1);
      const result = processMove(board, 'left');
      const removed = result.animatedTiles.filter(t => t.isRemoved);
      expect(removed.length).toBeGreaterThanOrEqual(1);
    });

    it('tracks previous positions for animated tiles', () => {
      const board = emptyBoard();
      board[0][2] = tile(2, 'a', 0, 2);
      const result = processMove(board, 'left');
      const movedTiles = result.animatedTiles.filter(t => t.previousPosition);
      expect(movedTiles.length).toBeGreaterThan(0);
    });
  });
});
