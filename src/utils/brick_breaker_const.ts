// src/utils/brick_breaker_const.ts

// Canvas Dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// Paddle Properties
export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 20;
export const PADDLE_SPEED = 7;
export const PADDLE_START_X = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
export const PADDLE_START_Y = CANVAS_HEIGHT - PADDLE_HEIGHT - 10;

// Ball Properties
export const BALL_RADIUS = 8;
export const BALL_SPEED = 5;
export const BALL_DX = BALL_SPEED; // Initial x direction
export const BALL_DY = -BALL_SPEED; // Initial y direction (upwards)
export const BALL_START_X = CANVAS_WIDTH / 2;
export const BALL_START_Y = PADDLE_START_Y - BALL_RADIUS;

// Brick Properties
export const BRICK_WIDTH = 70;
export const BRICK_HEIGHT = 20;
export const BRICK_PADDING = 10;
export const BRICK_OFFSET_TOP = 30;
export const BRICK_OFFSET_LEFT = 30;
export const BRICK_ROWS = 5;
export const BRICK_COLUMNS = Math.floor((CANVAS_WIDTH - 2 * BRICK_OFFSET_LEFT) / (BRICK_WIDTH + BRICK_PADDING));

// Game Properties
export const INITIAL_LIVES = 3;
export const INITIAL_SCORE = 0;
export const INITIAL_LEVEL = 1;

// Colors
export const BRICK_COLORS = [
  "#FF5733", // Red-orange
  "#33FF57", // Green
  "#3357FF", // Blue
  "#FF33F5", // Pink
  "#F5FF33", // Yellow
];