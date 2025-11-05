// src/utils/snake_const.ts

/**
 * Constants for the Snake game.
 */

export const BOARD_WIDTH = 20;
export const BOARD_HEIGHT = 20;
export const INITIAL_SNAKE_LENGTH = 3;
export const INITIAL_GAME_SPEED = 200; // Milliseconds per game tick
export const FOOD_SCORE_INCREMENT = 10;

// Initial position for the snake (center of the board)
export const INITIAL_SNAKE = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
  x: Math.floor(BOARD_WIDTH / 2),
  y: Math.floor(BOARD_HEIGHT / 2) + i,
}));

// Initial food position (random, but for now a placeholder)
export const INITIAL_FOOD = { x: 5, y: 5 };

export const INITIAL_DIRECTION = 'UP';
