/**
 * Tetris Game Constants
 * Contains game configuration, tetromino definitions, and styling
 */

// Board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Tetromino shapes (SRS - Super Rotation System inspired)
// Each shape is defined as a matrix where 1 = filled cell
export const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f5ff', // Cyan - neon
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#ffde00', // Yellow - electric
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#bf00ff', // Magenta - purple neon
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00ff88', // Green neon
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#ff3366', // Red neon
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#3366ff', // Blue neon
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#ff9933', // Orange neon
  },
} as const;

export type TetrominoType = keyof typeof TETROMINOES;

// Tetromino type keys for iteration
export const TETROMINO_KEYS = Object.keys(TETROMINOES) as TetrominoType[];

// Wall kick data for rotation (SRS-inspired simplified)
// Format: [dx, dy] for each rotation state (0->1, 1->2, 2->3, 3->0)
export const WALL_KICKS = {
  I: {
    0: [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
    1: [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
    2: [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
    3: [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  },
  default: {
    0: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    1: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    2: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    3: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  },
};

// Scoring system (Nintendo Tetris guidelines inspired)
export const SCORING = {
  single: 100,
  double: 300,
  triple: 500,
  tetris: 800, // 4 lines at once
  softDrop: 1,
  hardDrop: 2,
};

// Speed curve (ms per frame based on level)
// Level 1 starts at 1000ms, decreases by ~8% per level
export const getSpeedForLevel = (level: number): number => {
  const baseSpeed = 1000;
  const decay = Math.pow(0.85, level - 1);
  return Math.max(50, Math.floor(baseSpeed * decay));
};

// Max level
export const MAX_LEVEL = 15;

// Lines per level up
export const LINES_PER_LEVEL = 10;

// Empty cell in the board
export const EMPTY_CELL = 0;

/**
 * Gets the color for a tetromino type
 */
export const getTetrominoColor = (type: TetrominoType): string => {
  return TETROMINOES[type].color;
};
