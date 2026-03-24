/**
 * Tetris Game Logic
 * Pure functions for game mechanics - no React state
 */

import {
  TETROMINOES,
  TETROMINO_KEYS,
  WALL_KICKS,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  SCORING,
  TetrominoType,
} from './constants';
import {
  Matrix,
  Piece,
  Position,
  RotationState,
  RotateDirection,
} from './types';

/**
 * Creates an empty game board
 */
export const createEmptyBoard = (): Matrix => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(0)
  );
};

/**
 * Generates a random tetromino type
 */
export const getRandomTetromino = (): TetrominoType => {
  return TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
};

/**
 * Creates a new piece at the starting position
 */
export const createPiece = (type: TetrominoType): Piece => {
  const tetromino = TETROMINOES[type];
  return {
    type,
    shape: tetromino.shape.map((row) => [...row]),
    position: {
      x: Math.floor((BOARD_WIDTH - tetromino.shape[0].length) / 2),
      y: 0,
    },
    rotation: 0,
  };
};

/**
 * Gets the color for a tetromino type
 */
export const getTetrominoColor = (type: TetrominoType): string => {
  return TETROMINOES[type].color;
};

/**
 * Rotates a matrix 90 degrees clockwise
 */
export const rotateMatrix = (matrix: Matrix): Matrix => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: Matrix = [];

  for (let col = 0; col < cols; col++) {
    rotated[col] = [];
    for (let row = rows - 1; row >= 0; row--) {
      rotated[col].push(matrix[row][col]);
    }
  }

  return rotated;
};

/**
 * Rotates a matrix counter-clockwise
 */
export const rotateMatrixCounterClockwise = (matrix: Matrix): Matrix => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: Matrix = [];

  for (let col = cols - 1; col >= 0; col--) {
    rotated.push([]);
    for (let row = 0; row < rows; row++) {
      rotated[cols - 1 - col].push(matrix[row][col]);
    }
  }

  return rotated;
};

/**
 * Gets the next rotation state
 */
export const getNextRotation = (
  current: RotationState,
  direction: RotateDirection
): RotationState => {
  if (direction === 'clockwise') {
    return ((current + 1) % 4) as RotationState;
  }
  return ((current + 3) % 4) as RotationState;
};

/**
 * Checks if a piece collides with the board boundaries or other pieces
 */
export const checkCollision = (
  piece: Piece,
  board: Matrix,
  offsetX: number = 0,
  offsetY: number = 0,
  customShape?: Matrix
): boolean => {
  const shape = customShape || piece.shape;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        const newX = piece.position.x + col + offsetX;
        const newY = piece.position.y + row + offsetY;

        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return true;
        }

        // Check board collision (ignore cells above the board)
        if (newY >= 0 && board[newY][newX] !== 0) {
          return true;
        }
      }
    }
  }

  return false;
};

/**
 * Attempts to rotate a piece with wall kick support
 */
export const rotatePiece = (
  piece: Piece,
  board: Matrix,
  direction: RotateDirection
): Piece | null => {
  const nextRotation = getNextRotation(piece.rotation, direction);
  const rotatedShape =
    direction === 'clockwise'
      ? rotateMatrix(piece.shape)
      : rotateMatrixCounterClockwise(piece.shape);

  // Get wall kick data
  const kicks = piece.type === 'I' ? WALL_KICKS.I : WALL_KICKS.default;
  const kickList = kicks[piece.rotation as keyof typeof kicks] as [number, number][];

  // Try each kick offset
  for (const [dx, dy] of kickList) {
    const newPiece: Piece = {
      ...piece,
      shape: rotatedShape,
      position: { ...piece.position },
      rotation: nextRotation,
    };

    newPiece.position.x += dx;
    newPiece.position.y += dy;

    if (!checkCollision(newPiece, board, 0, 0, rotatedShape)) {
      return newPiece;
    }
  }

  return null;
};

/**
 * Moves a piece if no collision
 */
export const movePiece = (
  piece: Piece,
  board: Matrix,
  direction: 'left' | 'right' | 'down'
): Piece | null => {
  const offset = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 },
  };

  if (!checkCollision(piece, board, offset[direction].x, offset[direction].y)) {
    return {
      ...piece,
      position: {
        x: piece.position.x + offset[direction].x,
        y: piece.position.y + offset[direction].y,
      },
    };
  }

  return null;
};

/**
 * Locks a piece to the board
 */
export const lockPiece = (piece: Piece, board: Matrix): Matrix => {
  const newBoard = board.map((row) => [...row]);

  piece.shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell !== 0) {
        const boardY = piece.position.y + rowIndex;
        const boardX = piece.position.x + colIndex;

        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = getTetrominoColor(piece.type);
        }
      }
    });
  });

  return newBoard;
};

/**
 * Clears completed lines from the board
 */
export const clearLines = (board: Matrix): { newBoard: Matrix; clearedLines: number[] } => {
  const clearedLines: number[] = [];

  const newBoard = board.reduce<Matrix>((acc, row, rowIndex) => {
    // Check if row is full
    if (row.every((cell) => cell !== 0)) {
      clearedLines.push(rowIndex);
      // Add new empty row at the beginning
      acc.unshift(Array(BOARD_WIDTH).fill(0));
    } else {
      acc.push(row);
    }
    return acc;
  }, []);

  return { newBoard, clearedLines };
};

/**
 * Calculates score for clearing lines
 */
export const calculateScore = (linesCleared: number, level: number): number => {
  const baseScores = {
    0: 0,
    1: SCORING.single,
    2: SCORING.double,
    3: SCORING.triple,
    4: SCORING.tetris,
  };

  const baseScore = baseScores[linesCleared as keyof typeof baseScores] || 0;
  
  // Level multiplier
  return baseScore * (level + 1);
};

/**
 * Calculates the ghost piece position (where piece will land)
 */
export const getGhostPosition = (piece: Piece, board: Matrix): Position => {
  let ghostY = piece.position.y;

  while (!checkCollision(piece, board, 0, ghostY - piece.position.y + 1)) {
    ghostY++;
  }

  return {
    x: piece.position.x,
    y: ghostY,
  };
};

/**
 * Checks if the game is over (new piece cannot spawn)
 */
export const checkGameOver = (piece: Piece, board: Matrix): boolean => {
  return checkCollision(piece, board, 0, 0);
};

/**
 * Calculates the new level based on lines cleared
 */
export const calculateLevel = (totalLines: number, linesPerLevel: number): number => {
  return Math.floor(totalLines / linesPerLevel);
};

/**
 * Gets the next piece type without affecting state
 */
export const generateNextPiece = (): TetrominoType => {
  return getRandomTetromino();
};

/**
 * Validates if a position is valid for a piece
 */
export const isValidPosition = (
  piece: Piece,
  board: Matrix
): boolean => {
  return !checkCollision(piece, board);
};
