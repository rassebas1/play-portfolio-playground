/**
 * src/utils/brick_breaker_const.ts
 *
 * Defines constants used throughout the Brick Breaker game.
 * These constants configure the game's canvas dimensions, properties of the paddle,
 * ball, and bricks, as well as general game settings like lives and score.
 */

// --- Canvas Dimensions ---
/**
 * The width of the game canvas in pixels.
 * @constant {number}
 */
export const CANVAS_WIDTH = 800;
/**
 * The height of the game canvas in pixels.
 * @constant {number}
 */
export const CANVAS_HEIGHT = 600;

// --- Paddle Properties ---
/**
 * The width of the player's paddle in pixels.
 * @constant {number}
 */
export const PADDLE_WIDTH = 100;
/**
 * The height of the player's paddle in pixels.
 * @constant {number}
 */
export const PADDLE_HEIGHT = 20;
/**
 * The speed at which the paddle moves horizontally in pixels per frame.
 * @constant {number}
 */
export const PADDLE_SPEED = 7;
/**
 * The initial X-coordinate of the paddle's top-left corner, centered horizontally.
 * @constant {number}
 */
export const PADDLE_START_X = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
/**
 * The initial Y-coordinate of the paddle's top-left corner, positioned near the bottom.
 * @constant {number}
 */
export const PADDLE_START_Y = CANVAS_HEIGHT - PADDLE_HEIGHT - 10;

// --- Ball Properties ---
/**
 * The radius of the ball in pixels.
 * @constant {number}
 */
export const BALL_RADIUS = 8;
/**
 * The base speed of the ball.
 * @constant {number}
 */
export const BALL_SPEED = 5;
/**
 * The initial horizontal velocity (change in X) of the ball.
 * @constant {number}
 */
export const BALL_DX = BALL_SPEED;
/**
 * The initial vertical velocity (change in Y) of the ball, set to move upwards.
 * @constant {number}
 */
export const BALL_DY = -BALL_SPEED;
/**
 * The initial X-coordinate of the ball's center, centered horizontally.
 * @constant {number}
 */
export const BALL_START_X = CANVAS_WIDTH / 2;
/**
 * The initial Y-coordinate of the ball's center, positioned just above the paddle.
 * @constant {number}
 */
export const BALL_START_Y = PADDLE_START_Y - BALL_RADIUS;

// --- Brick Properties ---
/**
 * The width of each brick in pixels.
 * @constant {number}
 */
export const BRICK_WIDTH = 70;
/**
 * The height of each brick in pixels.
 * @constant {number}
 */
export const BRICK_HEIGHT = 20;
/**
 * The padding (space) between bricks in pixels.
 * @constant {number}
 */
export const BRICK_PADDING = 10;
/**
 * The top offset for the first row of bricks from the top of the canvas.
 * @constant {number}
 */
export const BRICK_OFFSET_TOP = 30;
/**
 * The left offset for the first column of bricks from the left of the canvas.
 * @constant {number}
 */
export const BRICK_OFFSET_LEFT = 30;
/**
 * The number of rows of bricks.
 * @constant {number}
 */
export const BRICK_ROWS = 5;
/**
 * The number of columns of bricks, calculated to fit within the canvas width.
 * @constant {number}
 */
export const BRICK_COLUMNS = Math.floor((CANVAS_WIDTH - 2 * BRICK_OFFSET_LEFT) / (BRICK_WIDTH + BRICK_PADDING));

// --- Game Properties ---
/**
 * The initial number of lives the player starts with.
 * @constant {number}
 */
export const INITIAL_LIVES = 3;
/**
 * The initial score at the start of the game.
 * @constant {number}
 */
export const INITIAL_SCORE = 0;
/**
 * The initial level the player starts on.
 * @constant {number}
 */
export const INITIAL_LEVEL = 1;

// --- Colors ---
/**
 * An array of colors used for rendering bricks, cycling through rows.
 * @constant {string[]}
 */
export const BRICK_COLORS = [
  "#FF5733", // Red-orange
  "#33FF57", // Green
  "#3357FF", // Blue
  "#FF33F5", // Pink
  "#F5FF33", // Yellow
];