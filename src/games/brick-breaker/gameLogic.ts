// src/games/brick-breaker/gameLogic.ts

import { GameState, Ball, Paddle, Brick, GameStatus } from "./types";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
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
 * Updates the ball's position and handles collisions with walls.
 * @param ball The current ball state.
 * @param canvasWidth The width of the game canvas.
 * @param canvasHeight The height of the game canvas.
 * @returns The updated ball state.
 */
export const updateBallPosition = (ball: Ball, canvasWidth: number, canvasHeight: number): Ball => {
  let { x, y, dx, dy, speed, radius } = ball;

  x += dx;
  y += dy;

  // Wall collision (left/right)
  if (x + radius > canvasWidth || x - radius < 0) {
    dx = -dx;
  }

  // Wall collision (top)
  if (y - radius < 0) {
    dy = -dy;
  }

  return { ...ball, x, y, dx, dy };
};

/**
 * Handles ball-paddle collision.
 * @param ball The current ball state.
 * @param paddle The current paddle state.
 * @returns The updated ball state after collision.
 */
export const handlePaddleCollision = (ball: Ball, paddle: Paddle): Ball => {
  let { dx, dy } = ball;

  // Check for collision with paddle
  if (
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height &&
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width
  ) {
    // Reverse y direction
    dy = -dy;

    // Adjust ball's x direction based on where it hit the paddle
    const hitPoint = ball.x - (paddle.x + paddle.width / 2);
    dx = hitPoint * 0.1; // Adjust this multiplier for desired bounce effect
  }
  return { ...ball, dx, dy };
};

/**
 * Handles ball-brick collision.
 * @param ball The current ball state.
 * @param bricks The array of brick states.
 * @returns An object containing the updated ball state and the index of the broken brick (if any).
 */
export const handleBrickCollision = (ball: Ball, bricks: Brick[]): { ball: Ball; brokenBrickIndex: number | null } => {
  let { dx, dy } = ball;
  let brokenBrickIndex: number | null = null;

  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    if (!brick.isBroken) {
      // Check for collision
      if (
        ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + brick.height
      ) {
        // Collision detected
        brokenBrickIndex = i;

        // Determine which side of the brick was hit to reverse ball direction
        const overlapX = Math.min(ball.x + ball.radius, brick.x + brick.width) - Math.max(ball.x - ball.radius, brick.x);
        const overlapY = Math.min(ball.y + ball.radius, brick.y + brick.height) - Math.max(ball.y - ball.radius, brick.y);

        if (overlapX < overlapY) {
          dx = -dx;
        } else {
          dy = -dy;
        }
        break; // Only break one brick per frame
      }
    }
  }
  return { ball: { ...ball, dx, dy }, brokenBrickIndex };
};

/**
 * Checks if the ball is out of bounds (below the paddle).
 * @param ball The current ball state.
 * @param canvasHeight The height of the game canvas.
 * @returns True if the ball is out of bounds, false otherwise.
 */
export const isBallOutOfBounds = (ball: Ball, canvasHeight: number): boolean => {
  return ball.y + ball.radius > canvasHeight;
};

/**
 * Checks if all bricks are broken.
 * @param bricks The array of brick states.
 * @returns True if all bricks are broken, false otherwise.
 */
export const areAllBricksBroken = (bricks: Brick[]): boolean => {
  return bricks.every((brick) => brick.isBroken);
};

/**
 * Resets the ball to its initial position on the paddle.
 * @param paddle The current paddle state.
 * @returns The reset ball state.
 */
export const resetBall = (paddle: Paddle): Ball => ({
  x: paddle.x + paddle.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  dx: BALL_DX,
  dy: BALL_DY,
  speed: BALL_SPEED,
});