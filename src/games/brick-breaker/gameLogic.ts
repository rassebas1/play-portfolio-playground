/**
 * src/games/brick-breaker/gameLogic.ts
 *
 * Contains core game logic functions for the Brick Breaker game,
 * including ball movement, collision detection with walls, paddle, and bricks,
 * and game state checks like ball out of bounds and all bricks broken.
 */

import { GameState, Ball, Paddle, Brick, GameStatus } from "./types";
import {
  BALL_RADIUS,
  BALL_DX,
  BALL_DY,
  BALL_SPEED,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BRICK_WIDTH,
  BRICK_HEIGHT,
} from "../../utils/brick_breaker_const";

/**
 * Updates the ball's position based on its current velocity and handles collisions with canvas walls.
 *
 * @param {Ball} ball - The current ball state (x, y, dx, dy, radius).
 * @param {number} canvasWidth - The width of the game canvas.
 * @param {number} canvasHeight - The height of the game canvas.
 * @returns {Ball} The updated ball state after moving and handling wall collisions.
 */
export const updateBallPosition = (ball: Ball, canvasWidth: number, canvasHeight: number): Ball => {
  let { x, y, dx, dy, speed, radius } = ball;

  // Update position
  x += dx;
  y += dy;

  // Wall collision (left/right)
  if (x + radius > canvasWidth || x - radius < 0) {
    dx = -dx; // Reverse horizontal direction
  }

  // Wall collision (top)
  if (y - radius < 0) {
    dy = -dy; // Reverse vertical direction
  }

  return { ...ball, x, y, dx, dy };
};

/**
 * Handles ball-paddle collision. If a collision occurs, the ball's vertical direction is reversed,
 * and its horizontal direction is adjusted based on where it hit the paddle.
 *
 * @param {Ball} ball - The current ball state.
 * @param {Paddle} paddle - The current paddle state.
 * @returns {Ball} The updated ball state after potential collision with the paddle.
 */
export const handlePaddleCollision = (ball: Ball, paddle: Paddle): Ball => {
  let { x, y, dx, dy } = ball;

  // Check for collision with paddle's top surface
  if (
    ball.y + ball.radius > paddle.y && // Ball's bottom is below paddle's top
    ball.y - ball.radius < paddle.y + paddle.height && // Ball's top is above paddle's bottom
    ball.x + ball.radius > paddle.x && // Ball's right is past paddle's left
    ball.x - ball.radius < paddle.x + paddle.width // Ball's left is before paddle's right
  ) {
    // Reverse vertical direction
    dy = -dy;
    // Set ball's y position to be exactly at the top of the paddle to prevent visual overlap
    y = paddle.y - ball.radius;

    // Adjust ball's x direction based on where it hit the paddle
    // Hitting the center results in dx ~ 0, hitting edges results in larger dx
    const hitPoint = ball.x - (paddle.x + paddle.width / 2);
    dx = hitPoint * 0.1; // Multiplier controls bounce angle sensitivity
  }
  return { ...ball, x, y, dx, dy };
};

/**
 * Handles ball-brick collision. If a collision occurs, the ball's direction is reversed
 * based on the collision side, and the index of the broken brick is returned.
 *
 * @param {Ball} ball - The current ball state.
 * @param {Brick[]} bricks - The array of brick states.
 * @returns {object} An object containing:
 *   - {Ball} ball - The updated ball state after potential collision.
 *   - {number | null} brokenBrickIndex - The index of the brick that was hit, or null if no brick was hit.
 */
export const handleBrickCollision = (ball: Ball, bricks: Brick[]): { ball: Ball; brokenBrickIndex: number | null } => {
  let { dx, dy } = ball;
  let brokenBrickIndex: number | null = null;

  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    if (!brick.isBroken) { // Only check collision with active bricks
      // Check for collision between ball and brick
      if (
        ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + brick.height
      ) {
        // Collision detected
        brokenBrickIndex = i;

        // Determine which side of the brick was hit to reverse ball direction
        // Calculate overlap on X and Y axes
        const overlapX = Math.min(ball.x + ball.radius, brick.x + brick.width) - Math.max(ball.x - ball.radius, brick.x);
        const overlapY = Math.min(ball.y + ball.radius, brick.y + brick.height) - Math.max(ball.y - ball.radius, brick.y);

        if (overlapX < overlapY) {
          dx = -dx; // Reverse horizontal direction if collision is more horizontal
        } else {
          dy = -dy; // Reverse vertical direction if collision is more vertical
        }
        break; // Only break one brick per frame to avoid multiple collisions
      }
    }
  }
  return { ball: { ...ball, dx, dy }, brokenBrickIndex };
};

/**
 * Checks if the ball has gone out of the bottom of the canvas (below the paddle).
 *
 * @param {Ball} ball - The current ball state.
 * @param {number} canvasHeight - The height of the game canvas.
 * @returns {boolean} True if the ball is out of bounds, false otherwise.
 */
export const isBallOutOfBounds = (ball: Ball, canvasHeight: number): boolean => {
  return ball.y + ball.radius > canvasHeight;
};

/**
 * Checks if all bricks in the provided array are broken.
 *
 * @param {Brick[]} bricks - The array of brick states.
 * @returns {boolean} True if all bricks are marked as broken, false otherwise.
 */
export const areAllBricksBroken = (bricks: Brick[]): boolean => {
  return bricks.every((brick) => brick.isBroken);
};

/**
 * Resets the ball to its initial position, centered on the paddle.
 *
 * @param {Paddle} paddle - The current paddle state.
 * @param {number} canvasHeight - The height of the game canvas.
 * @returns {Ball} The reset ball state.
 */
export const resetBall = (paddle: Paddle, canvasHeight: number): Ball => ({
  x: paddle.x + paddle.width / 2, // Center ball horizontally on paddle
  y: paddle.y - BALL_RADIUS, // Position ball just above the paddle
  radius: BALL_RADIUS,
  dx: BALL_DX, // Initial horizontal velocity
  dy: BALL_DY, // Initial vertical velocity
  speed: BALL_SPEED,
});