import { describe, it, expect } from 'vitest';
import {
  updateBallPosition,
  handlePaddleCollision,
  handleBrickCollision,
  isBallOutOfBounds,
  areAllBricksBroken,
  resetBall,
} from './gameLogic';
import { Ball, Paddle, Brick } from './types';
import {
  BALL_RADIUS,
  BALL_DX,
  BALL_DY,
  BALL_SPEED,
  PADDLE_HEIGHT,
} from './constants';

const createBall = (extras: Partial<Ball> = {}): Ball => ({
  x: 100,
  y: 200,
  radius: BALL_RADIUS,
  dx: BALL_DX,
  dy: BALL_DY,
  speed: BALL_SPEED,
  ...extras,
});

const createPaddle = (extras: Partial<Paddle> = {}): Paddle => ({
  x: 100,
  y: 350,
  width: 100,
  height: PADDLE_HEIGHT,
  dx: 0,
  ...extras,
});

const createBrick = (extras: Partial<Brick> = {}): Brick => ({
  x: 50,
  y: 50,
  width: 70,
  height: 20,
  hits: 1,
  isBroken: false,
  color: '#FF5733',
  ...extras,
});

describe('Brick Breaker gameLogic', () => {
  describe('updateBallPosition', () => {
    it('should update ball x position by dx', () => {
      const ball = createBall({ x: 100, dx: 5, dy: -5 });
      const result = updateBallPosition(ball, 800, 600);
      expect(result.x).toBe(105);
    });

    it('should update ball y position by dy', () => {
      const ball = createBall({ y: 200, dx: 5, dy: -5 });
      const result = updateBallPosition(ball, 800, 600);
      expect(result.y).toBe(195);
    });

    it('should reverse dx when hitting left wall', () => {
      const ball = createBall({ x: 5, dx: -5, dy: 5 });
      const result = updateBallPosition(ball, 800, 600);
      expect(result.dx).toBe(5);
    });

    it('should reverse dx when hitting right wall', () => {
      const ball = createBall({ x: 795, dx: 5, dy: 5 });
      const result = updateBallPosition(ball, 800, 600);
      expect(result.dx).toBe(-5);
    });

    it('should reverse dy when hitting top wall', () => {
      const ball = createBall({ y: 5, dx: 5, dy: -5 });
      const result = updateBallPosition(ball, 800, 600);
      expect(result.dy).toBe(5);
    });

    it('should not reverse dy when hitting bottom wall', () => {
      const ball = createBall({ y: 500, dy: 5 });
      const result = updateBallPosition(ball, 800, 600);
      expect(result.dy).toBe(5);
    });

    it('should preserve ball properties not affected by collision', () => {
      const ball = createBall({ x: 400, y: 300, dx: 3, dy: -3, speed: 4 });
      const result = updateBallPosition(ball, 800, 600);
      expect(result.speed).toBe(4);
      expect(result.radius).toBe(BALL_RADIUS);
    });
  });

  describe('handlePaddleCollision', () => {
    it('should reverse dy when ball hits paddle', () => {
      const ball = createBall({ y: 344, dy: 5 });  // Ball just entering paddle zone from above
      const paddle = createPaddle({ y: 350 });
      const result = handlePaddleCollision(ball, paddle);
      expect(result.dy).toBe(-5);
    });

    it('should position ball at top of paddle after collision', () => {
      const ball = createBall({ y: 344, dy: 5 });
      const paddle = createPaddle({ y: 350, height: 20 });
      const result = handlePaddleCollision(ball, paddle);
      expect(result.y).toBe(350 - ball.radius);
    });

    it('should not trigger when ball is above paddle', () => {
      const ball = createBall({ y: 300, dy: -5 });
      const paddle = createPaddle({ y: 350 });
      const result = handlePaddleCollision(ball, paddle);
      expect(result.dy).toBe(-5);
    });

    it('should not trigger when ball is below paddle', () => {
      const ball = createBall({ y: 400, dy: 5 });
      const paddle = createPaddle({ y: 350 });
      const result = handlePaddleCollision(ball, paddle);
      expect(result.dy).toBe(5);
    });

    it('should not trigger when ball is beside paddle', () => {
      const ball = createBall({ x: 50, y: 360, dy: 5 });
      const paddle = createPaddle({ x: 200, y: 350 });
      const result = handlePaddleCollision(ball, paddle);
      expect(result.dy).toBe(5);
    });

    it('should adjust dx based on hit position (center)', () => {
      const ball = createBall({ x: 150, dx: 5, dy: 5 });
      const paddle = createPaddle({ x: 100, width: 100 });
      const result = handlePaddleCollision(ball, paddle);
      // Center hit should have lower dx magnitude than original
      expect(Math.abs(result.dx)).toBeLessThanOrEqual(Math.abs(ball.dx));
    });

    it('should change dx based on hit position (left side)', () => {
      const ball = createBall({ x: 105, y: 548, dx: 5, dy: 5 });  // Left side, entering paddle zone
      const paddle = createPaddle({ x: 100, y: 550, width: 100 });
      const result = handlePaddleCollision(ball, paddle);
      // Left side hit should result in dx pointing left (negative relative to center)
      expect(result.dx).toBeLessThan(0);
    });

    it('should change dx based on hit position (right side)', () => {
      const ball = createBall({ x: 195, y: 548, dx: 5, dy: 5 });  // Right side, entering paddle zone
      const paddle = createPaddle({ x: 100, y: 550, width: 100 });
      const result = handlePaddleCollision(ball, paddle);
      // Right side hit should result in dx pointing right (positive relative to center)
      expect(result.dx).toBeGreaterThan(0);
    });

    it('should not affect ball when no collision', () => {
      const ball = createBall({ x: 50, y: 100 });
      const paddle = createPaddle({ x: 200, y: 350 });
      const result = handlePaddleCollision(ball, paddle);
      expect(result.x).toBe(ball.x);
      expect(result.dx).toBe(ball.dx);
    });
  });

  describe('handleBrickCollision', () => {
    it('should detect collision with brick', () => {
      const ball = createBall({ x: 75, y: 55, dx: 5, dy: 5 });
      const bricks = [createBrick({ x: 50, y: 50, width: 70, height: 20 })];
      const result = handleBrickCollision(ball, bricks);
      expect(result.brokenBrickIndex).toBe(0);
    });

    it('should not detect collision with broken brick', () => {
      const ball = createBall({ x: 75, y: 55 });
      const bricks = [createBrick({ x: 50, y: 50, isBroken: true })];
      const result = handleBrickCollision(ball, bricks);
      expect(result.brokenBrickIndex).toBeNull();
    });

    it('should reverse dx on horizontal collision', () => {
      const ball = createBall({ x: 50, y: 60, dx: 5, dy: 0 });
      const bricks = [createBrick({ x: 50, y: 50, width: 70, height: 20 })];
      const result = handleBrickCollision(ball, bricks);
      expect(result.ball.dx).toBe(-5);
    });

    it('should reverse dy on vertical collision', () => {
      const ball = createBall({ x: 60, y: 50, dx: 0, dy: -5 });
      const bricks = [createBrick({ x: 50, y: 50, width: 70, height: 20 })];
      const result = handleBrickCollision(ball, bricks);
      expect(result.ball.dy).toBe(5);
    });

    it('should only break one brick per frame', () => {
      const ball = createBall({ x: 75, y: 75, dx: 0, dy: 0 });
      const bricks = [
        createBrick({ x: 50, y: 50, width: 70, height: 20 }),
        createBrick({ x: 150, y: 50, width: 70, height: 20 }),
      ];
      const result = handleBrickCollision(ball, bricks);
      expect(result.brokenBrickIndex).toBe(0);
    });

    it('should return null when no collision', () => {
      const ball = createBall({ x: 300, y: 300 });
      const bricks = [createBrick({ x: 50, y: 50 })];
      const result = handleBrickCollision(ball, bricks);
      expect(result.brokenBrickIndex).toBeNull();
    });

    it('should not collide with far away brick', () => {
      const ball = createBall({ x: 500, y: 500 });
      const bricks = [createBrick({ x: 50, y: 50 })];
      const result = handleBrickCollision(ball, bricks);
      expect(result.brokenBrickIndex).toBeNull();
    });

    it('should detect collision on brick edge', () => {
      const ball = createBall({ x: 50, y: 55, dx: -5, dy: 5 });
      const bricks = [createBrick({ x: 50, y: 50, width: 70, height: 20 })];
      const result = handleBrickCollision(ball, bricks);
      expect(result.brokenBrickIndex).toBe(0);
    });

    it('should detect collision on brick corner', () => {
      const ball = createBall({ x: 51, y: 51, dx: -5, dy: -5 });
      const bricks = [createBrick({ x: 50, y: 50, width: 70, height: 20 })];
      const result = handleBrickCollision(ball, bricks);
      expect(result.brokenBrickIndex).toBe(0);
    });

    it('should preserve ball x position after collision', () => {
      const ball = createBall({ x: 75, y: 55, dx: 5, dy: 5 });
      const bricks = [createBrick({ x: 50, y: 50 })];
      const result = handleBrickCollision(ball, bricks);
      expect(result.ball.x).toBe(ball.x);
    });
  });

  describe('isBallOutOfBounds', () => {
    it('should return true when ball is below canvas', () => {
      const ball = createBall({ y: 610 });
      expect(isBallOutOfBounds(ball, 600)).toBe(true);
    });

    it('should return false when ball is above canvas', () => {
      const ball = createBall({ y: 50 });
      expect(isBallOutOfBounds(ball, 600)).toBe(false);
    });

    it('should return false when ball is within height', () => {
      const ball = createBall({ y: 300 });
      expect(isBallOutOfBounds(ball, 600)).toBe(false);
    });

    it('should return true when ball extends below canvas', () => {
      const ball = createBall({ y: 595, radius: 20 });
      expect(isBallOutOfBounds(ball, 600)).toBe(true);
    });

    it('should return false when ball is exactly at bottom', () => {
      const ball = createBall({ y: 592, radius: 8 });
      expect(isBallOutOfBounds(ball, 600)).toBe(false);
    });
  });

  describe('areAllBricksBroken', () => {
    it('should return true when all bricks are broken', () => {
      const bricks = [
        createBrick({ isBroken: true }),
        createBrick({ isBroken: true }),
        createBrick({ isBroken: true }),
      ];
      expect(areAllBricksBroken(bricks)).toBe(true);
    });

    it('should return false when some bricks are not broken', () => {
      const bricks = [
        createBrick({ isBroken: true }),
        createBrick({ isBroken: false }),
        createBrick({ isBroken: true }),
      ];
      expect(areAllBricksBroken(bricks)).toBe(false);
    });

    it('should return false when no bricks are broken', () => {
      const bricks = [
        createBrick({ isBroken: false }),
        createBrick({ isBroken: false }),
      ];
      expect(areAllBricksBroken(bricks)).toBe(false);
    });

    it('should return true for empty brick array', () => {
      expect(areAllBricksBroken([])).toBe(true);
    });

    it('should return true when all bricks have isBroken: true', () => {
      const bricks = Array(5).fill(null).map(() => createBrick({ isBroken: true }));
      expect(areAllBricksBroken(bricks)).toBe(true);
    });
  });

  describe('resetBall', () => {
    it('should position ball centered on paddle horizontally', () => {
      const paddle = createPaddle({ x: 100, width: 100 });
      const result = resetBall(paddle, 600);
      expect(result.x).toBe(150);
    });

    it('should position ball just above paddle', () => {
      const paddle = createPaddle({ x: 100, y: 350, width: 100 });
      const result = resetBall(paddle, 600);
      expect(result.y).toBe(350 - BALL_RADIUS);
    });

    it('should set ball radius to BALL_RADIUS constant', () => {
      const paddle = createPaddle({ x: 100 });
      const result = resetBall(paddle, 600);
      expect(result.radius).toBe(BALL_RADIUS);
    });

    it('should set dx to BALL_DX constant', () => {
      const paddle = createPaddle({ x: 100 });
      const result = resetBall(paddle, 600);
      expect(result.dx).toBe(BALL_DX);
    });

    it('should set dy to BALL_DY constant', () => {
      const paddle = createPaddle({ x: 100 });
      const result = resetBall(paddle, 600);
      expect(result.dy).toBe(BALL_DY);
    });

    it('should set speed to BALL_SPEED constant', () => {
      const paddle = createPaddle({ x: 100 });
      const result = resetBall(paddle, 600);
      expect(result.speed).toBe(BALL_SPEED);
    });

    it('should center on paddle with different width', () => {
      const paddle = createPaddle({ x: 50, width: 200 });
      const result = resetBall(paddle, 600);
      expect(result.x).toBe(150);
    });
  });
});

describe('Brick Breaker constants', () => {
  describe('Ball constants', () => {
    it('BALL_RADIUS should be 8', () => {
      expect(BALL_RADIUS).toBe(8);
    });

    it('BALL_DX should equal BALL_SPEED', () => {
      expect(BALL_DX).toBe(BALL_SPEED);
    });

    it('BALL_DY should be negative of BALL_SPEED', () => {
      expect(BALL_DY).toBe(-BALL_SPEED);
    });
  });

  describe('Paddle constants', () => {
    it('PADDLE_HEIGHT should be 20', () => {
      expect(PADDLE_HEIGHT).toBe(20);
    });
  });
});