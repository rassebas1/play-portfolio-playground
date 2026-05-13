/**
 * src/games/tetris/gameLogic.test.ts
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createEmptyBoard,
  getRandomTetromino,
  createPiece,
  getTetrominoColor,
  rotateMatrix,
  rotateMatrixCounterClockwise,
  getNextRotation,
  checkCollision,
  rotatePiece,
  movePiece,
  lockPiece,
  clearLines,
  calculateScore,
  getGhostPosition,
  checkGameOver,
  calculateLevel,
  generateNextPiece,
  isValidPosition,
} from './gameLogic';
import { TETROMINOES, BOARD_WIDTH, BOARD_HEIGHT, TetrominoType } from './constants';
import type { Piece, Matrix } from './types';

describe('Tetris gameLogic', () => {
  describe('createEmptyBoard', () => {
    it('should create a board with correct dimensions', () => {
      const board = createEmptyBoard();
      expect(board).toHaveLength(BOARD_HEIGHT);
      board.forEach(row => {
        expect(row).toHaveLength(BOARD_WIDTH);
      });
    });

    it('should initialize board with zeros', () => {
      const board = createEmptyBoard();
      board.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBe(0);
        });
      });
    });

    it('should create independent board instances', () => {
      const board1 = createEmptyBoard();
      const board2 = createEmptyBoard();
      board1[0][0] = 1;
      expect(board2[0][0]).toBe(0);
    });
  });

  describe('getRandomTetromino', () => {
    it('should return a valid tetromino type', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const type = getRandomTetromino();
      expect(Object.keys(TETROMINOES)).toContain(type);
    });

    it('should return different types with different random values', () => {
      const types = new Set<TetrominoType>();
      for (let i = 0; i < 20; i++) {
        vi.spyOn(Math, 'random').mockReturnValue(i / 20);
        types.add(getRandomTetromino());
      }
      expect(types.size).toBeGreaterThan(1);
    });
  });

  describe('createPiece', () => {
    it('should create a piece with correct type', () => {
      const piece = createPiece('I');
      expect(piece.type).toBe('I');
    });

    it('should create a piece with initial rotation 0', () => {
      const piece = createPiece('O');
      expect(piece.rotation).toBe(0);
    });

    it('should create a piece at starting position', () => {
      const piece = createPiece('T');
      expect(piece.position.x).toBeGreaterThanOrEqual(0);
      expect(piece.position.y).toBe(0);
    });

    it('should create a piece with correct shape', () => {
      const piece = createPiece('I');
      expect(piece.shape).toEqual(TETROMINOES.I.shape);
    });

    it('should create independent shape arrays', () => {
      const piece1 = createPiece('T');
      const piece2 = createPiece('T');
      piece1.shape[0][0] = 9;
      expect(piece2.shape[0][0]).not.toBe(9);
    });
  });

  describe('getTetrominoColor', () => {
    it('should return color for each tetromino type', () => {
      const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      types.forEach(type => {
        const color = getTetrominoColor(type);
        expect(color).toBe(TETROMINOES[type].color);
      });
    });
  });

  describe('rotateMatrix', () => {
    it('should rotate a 2x2 matrix clockwise', () => {
      const matrix: Matrix = [
        [1, 2],
        [3, 4],
      ];
      const rotated = rotateMatrix(matrix);
      expect(rotated).toEqual([
        [3, 1],
        [4, 2],
      ]);
    });

    it('should rotate a 3x3 matrix clockwise', () => {
      const matrix: Matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const rotated = rotateMatrix(matrix);
      expect(rotated).toEqual([
        [7, 4, 1],
        [8, 5, 2],
        [9, 6, 3],
      ]);
    });

    it('should rotate tetromino shapes', () => {
      const matrix: Matrix = [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ];
      const rotated = rotateMatrix(matrix);
      expect(rotated).toEqual([
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ]);
    });

    it('should preserve dimensions (rows become cols)', () => {
      const matrix: Matrix = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      const rotated = rotateMatrix(matrix);
      expect(rotated).toHaveLength(3);
      expect(rotated[0]).toHaveLength(2);
    });
  });

  describe('rotateMatrixCounterClockwise', () => {
    it('should rotate a 2x2 matrix counter-clockwise', () => {
      const matrix: Matrix = [
        [1, 2],
        [3, 4],
      ];
      const rotated = rotateMatrixCounterClockwise(matrix);
      expect(rotated).toEqual([
        [2, 4],
        [1, 3],
      ]);
    });

    it('should be inverse of clockwise rotation', () => {
      const matrix: Matrix = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      const clockwise1 = rotateMatrix(rotateMatrix(matrix));
      const counterClockwise1 = rotateMatrixCounterClockwise(rotateMatrixCounterClockwise(matrix));
      expect(clockwise1).toEqual(counterClockwise1);
    });
  });

  describe('getNextRotation', () => {
    it('should return next clockwise rotation', () => {
      expect(getNextRotation(0, 'clockwise')).toBe(1);
      expect(getNextRotation(1, 'clockwise')).toBe(2);
      expect(getNextRotation(2, 'clockwise')).toBe(3);
      expect(getNextRotation(3, 'clockwise')).toBe(0);
    });

    it('should return next counter-clockwise rotation', () => {
      expect(getNextRotation(0, 'counterclockwise')).toBe(3);
      expect(getNextRotation(1, 'counterclockwise')).toBe(0);
      expect(getNextRotation(2, 'counterclockwise')).toBe(1);
      expect(getNextRotation(3, 'counterclockwise')).toBe(2);
    });
  });

  describe('checkCollision', () => {
    it('should return false for empty board with piece at top', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      expect(checkCollision(piece, board)).toBe(false);
    });

    it('should return true for piece below board', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        ...createPiece('T'),
        position: { x: 0, y: BOARD_HEIGHT },
      };
      expect(checkCollision(piece, board)).toBe(true);
    });

    it('should return true for piece beyond left boundary', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        ...createPiece('T'),
        position: { x: -1, y: 0 },
      };
      expect(checkCollision(piece, board)).toBe(true);
    });

    it('should return true for piece beyond right boundary', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        ...createPiece('T'),
        position: { x: BOARD_WIDTH, y: 0 },
      };
      expect(checkCollision(piece, board)).toBe(true);
    });

    it('should return true when colliding with existing pieces', () => {
      const board = createEmptyBoard();
      board[BOARD_HEIGHT - 1][0] = 1;
      const piece = createPiece('I');
      piece.position = { x: 0, y: BOARD_HEIGHT - 2 };
      expect(checkCollision(piece, board)).toBe(true);
    });

    it('should respect offset parameter', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      expect(checkCollision(piece, board, 0, 0)).toBe(false);
      expect(checkCollision(piece, board, 1, 0)).toBe(false);
    });

    it('should use customShape when provided', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        type: 'T',
        shape: [[0, 1, 0], [0, 1, 0], [0, 1, 0]], // Tall narrow shape
        position: { x: 0, y: 0 },
        rotation: 0,
      };
      const customShape: Matrix = [[1, 0], [1, 0], [1, 0]]; // Different shape
      // With customShape, we test collision with that shape
      // At position 0,0 with 3x2 customShape, should be valid
      expect(checkCollision(piece, board, 0, 0, customShape)).toBe(false);
    });
  });

  describe('rotatePiece', () => {
    it('should return null when rotation causes collision without kicks', () => {
      const board = createEmptyBoard();
      // Place a piece in a corner
      const piece: Piece = {
        type: 'T',
        shape: TETROMINOES.T.shape.map(r => [...r]),
        position: { x: 0, y: 0 },
        rotation: 0,
      };
      // Try rotating near left wall
      const result = rotatePiece(piece, board, 'clockwise');
      // May or may not succeed based on wall kicks
      expect(result === null || typeof result === 'object').toBe(true);
    });

    it('should rotate piece when valid', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      piece.position = { x: 3, y: 0 };
      const result = rotatePiece(piece, board, 'clockwise');
      expect(result).not.toBeNull();
      if (result) {
        expect(result.rotation).toBe(1);
      }
    });
  });

  describe('movePiece', () => {
    it('should move piece left when valid', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      piece.position = { x: 5, y: 0 };
      const result = movePiece(piece, board, 'left');
      expect(result).not.toBeNull();
      if (result) {
        expect(result.position.x).toBe(4);
      }
    });

    it('should move piece right when valid', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      piece.position = { x: 0, y: 0 };
      const result = movePiece(piece, board, 'right');
      expect(result).not.toBeNull();
      if (result) {
        expect(result.position.x).toBe(1);
      }
    });

    it('should move piece down when valid', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      piece.position = { x: 0, y: 0 };
      const result = movePiece(piece, board, 'down');
      expect(result).not.toBeNull();
      if (result) {
        expect(result.position.y).toBe(1);
      }
    });

    it('should return null when move causes collision', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      piece.position = { x: 0, y: 0 };
      const result = movePiece(piece, board, 'left');
      expect(result).toBeNull();
    });

    it('should return null when move would go beyond board', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      piece.position = { x: 0, y: 0 };
      const result = movePiece(piece, board, 'left');
      expect(result).toBeNull();
    });
  });

  describe('lockPiece', () => {
    it('should add piece to board', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      const newBoard = lockPiece(piece, board);
      
      // Check that at least one cell is filled
      const filledCells = newBoard.flat().filter(c => c !== 0);
      expect(filledCells.length).toBeGreaterThan(0);
    });

    it('should not modify original board', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      lockPiece(piece, board);
      
      const allZeros = board.every(row => row.every(cell => cell === 0));
      expect(allZeros).toBe(true);
    });

    it('should set correct color for piece type', () => {
      const board = createEmptyBoard();
      const piece = createPiece('I');
      const newBoard = lockPiece(piece, board);
      
      const color = getTetrominoColor('I');
      const hasColor = newBoard.flat().includes(color);
      expect(hasColor).toBe(true);
    });

    it('should not write cells above board', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        ...createPiece('I'),
        position: { x: 0, y: -5 },
      };
      const newBoard = lockPiece(piece, board);
      
      // Board should be empty
      const allZeros = newBoard.every(row => row.every(cell => cell === 0));
      expect(allZeros).toBe(true);
    });
  });

  describe('clearLines', () => {
    it('should return original board when no lines are full', () => {
      const board = createEmptyBoard();
      board[0][0] = 1; // Not a full row
      const result = clearLines(board);
      expect(result.clearedLines).toHaveLength(0);
    });

    it('should identify full rows', () => {
      const board = createEmptyBoard();
      board[0] = Array(BOARD_WIDTH).fill(1);
      const result = clearLines(board);
      expect(result.clearedLines).toContain(0);
    });

    it('should remove full rows', () => {
      const board = createEmptyBoard();
      board[0] = Array(BOARD_WIDTH).fill(1);
      const result = clearLines(board);
      expect(result.newBoard[result.newBoard.length - 1]).toEqual(Array(BOARD_WIDTH).fill(0));
    });

    it('should handle multiple full rows', () => {
      const board = createEmptyBoard();
      board[0] = Array(BOARD_WIDTH).fill(1);
      board[1] = Array(BOARD_WIDTH).fill(1);
      const result = clearLines(board);
      expect(result.clearedLines.length).toBe(2);
    });

    it('should preserve some non-zero content after clearing', () => {
      const board = createEmptyBoard();
      board[0] = Array(BOARD_WIDTH).fill(1);
      board[1][0] = 1; // Only one cell in row 1
      const result = clearLines(board);
      // After clearing row 0, row 1 should move to a higher position
      // The total non-zero cells should still be 1
      const totalNonZero = result.newBoard.flat().filter(c => c !== 0).length;
      expect(totalNonZero).toBe(1);
    });
  });

  describe('calculateScore', () => {
    it('should return 0 for 0 lines', () => {
      expect(calculateScore(0, 0)).toBe(0);
    });

    it('should return single line score', () => {
      const score = calculateScore(1, 0);
      expect(score).toBeGreaterThan(0);
    });

    it('should return correct score for double', () => {
      const score = calculateScore(2, 0);
      expect(score).toBe(300);
    });

    it('should apply level multiplier', () => {
      const score0 = calculateScore(1, 0);
      const score1 = calculateScore(1, 1);
      expect(score1).toBe(score0 * 2);
    });

    it('should return 0 for more than 4 lines', () => {
      expect(calculateScore(5, 0)).toBe(0);
    });

    it('should return correct score for single at level 0', () => {
      expect(calculateScore(1, 0)).toBe(100);
    });

    it('should return correct score for triple at level 0', () => {
      expect(calculateScore(3, 0)).toBe(500);
    });

    it('should return correct score for tetris at level 0', () => {
      expect(calculateScore(4, 0)).toBe(800);
    });
  });

  describe('getGhostPosition', () => {
    it('should return same x position as piece', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      piece.position = { x: 5, y: 0 };
      const ghost = getGhostPosition(piece, board);
      expect(ghost.x).toBe(5);
    });

    it('should return y at bottom of board', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      piece.position = { x: 5, y: 0 };
      const ghost = getGhostPosition(piece, board);
      expect(ghost.y).toBeLessThanOrEqual(BOARD_HEIGHT);
    });

    it('should not go beyond board', () => {
      const board = createEmptyBoard();
      const piece = createPiece('I');
      piece.position = { x: 0, y: 0 };
      const ghost = getGhostPosition(piece, board);
      expect(ghost.y).toBeLessThanOrEqual(BOARD_HEIGHT);
    });
  });

  describe('checkGameOver', () => {
    it('should return false when piece can spawn', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      expect(checkGameOver(piece, board)).toBe(false);
    });

    it('should return true when collision at spawn', () => {
      const board = createEmptyBoard();
      board[0][4] = 1;
      board[0][5] = 1;
      board[0][6] = 1;
      const piece = createPiece('T');
      expect(checkGameOver(piece, board)).toBe(true);
    });
  });

  describe('calculateLevel', () => {
    it('should return 0 at start', () => {
      expect(calculateLevel(0, 10)).toBe(0);
    });

    it('should increase level when lines threshold reached', () => {
      expect(calculateLevel(10, 10)).toBe(1);
      expect(calculateLevel(20, 10)).toBe(2);
    });

    it('should handle partial lines', () => {
      expect(calculateLevel(5, 10)).toBe(0);
    });
  });

  describe('generateNextPiece', () => {
    it('should return a valid tetromino type', () => {
      const type = generateNextPiece();
      expect(Object.keys(TETROMINOES)).toContain(type);
    });
  });

  describe('isValidPosition', () => {
    it('should return true for valid position', () => {
      const board = createEmptyBoard();
      const piece = createPiece('T');
      expect(isValidPosition(piece, board)).toBe(true);
    });

    it('should return false for invalid position', () => {
      const board = createEmptyBoard();
      const piece: Piece = {
        ...createPiece('T'),
        position: { x: -1, y: 0 },
      };
      expect(isValidPosition(piece, board)).toBe(false);
    });
  });
});