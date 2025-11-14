/**
 * src/utils/snake_const.ts
 *
 * Defines constants used throughout the Snake game.
 * These constants configure the game board dimensions, initial snake properties,
 * game speed, and scoring mechanics.
 */

/**
 * The width of the game board in cells.
 * @constant {number}
 */
export const BOARD_WIDTH = 20;
/**
 * The height of the game board in cells.
 * @constant {number}
 */
export const BOARD_HEIGHT = 20;
/**
 * The initial length of the snake when the game starts.
 * @constant {number}
 */
export const INITIAL_SNAKE_LENGTH = 3;
/**
 * The initial speed of the game in milliseconds per game tick.
 * A lower value means the game runs faster.
 * @constant {number}
 */
export const INITIAL_GAME_SPEED = 200; // Milliseconds per game tick
/**
 * The amount by which the score increases when the snake eats food.
 * @constant {number}
 */
export const FOOD_SCORE_INCREMENT = 10;

/**
 * The initial coordinates of the snake's body segments.
 * The snake starts in the center of the board, moving upwards.
 * @constant {Array<{x: number, y: number}>}
 */
export const INITIAL_SNAKE = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
  x: Math.floor(BOARD_WIDTH / 2),
  y: Math.floor(BOARD_HEIGHT / 2) + i, // Snake segments stacked vertically
}));

/**
 * The initial position of the food item on the board.
 * This is a fixed placeholder; in actual gameplay, food is randomly generated.
 * @constant {{x: number, y: number}}
 */
export const INITIAL_FOOD = { x: 5, y: 5 };

/**
 * The initial direction of the snake when the game starts.
 * @constant {'UP'}
 */
export const INITIAL_DIRECTION = 'UP';
