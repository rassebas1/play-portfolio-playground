/**
 * src/games/brick-breaker/GameReducer.test.ts
 */
import { describe, it, expect } from 'vitest';
import { gameReducer, getInitialState } from './GameReducer';
import { GameStatus, GameState } from './types';
import * as Constants from '../../utils/brick_breaker_const';

describe('Brick Breaker GameReducer', () => {
  const canvasWidth = 800;
  const canvasHeight = 600;

  describe('getInitialState', () => {
    it('should return a valid initial state', () => {
      const initialState = getInitialState(canvasWidth, canvasHeight);
      expect(initialState.gameStatus).toBe(GameStatus.IDLE);
      expect(initialState.level).toBe(Constants.INITIAL_LEVEL);
      expect(initialState.lives).toBe(Constants.INITIAL_LIVES);
      expect(initialState.score).toBe(0);
      expect(initialState.bricks.length).toBeGreaterThan(0);
    });

    it('should place the paddle at a consistent position 20px from the bottom', () => {
      const initialState = getInitialState(canvasWidth, canvasHeight);
      const expectedPaddleY = canvasHeight - Constants.PADDLE_HEIGHT - 20;
      expect(initialState.paddle.y).toBe(expectedPaddleY);
    });
  });

  describe('LEVEL_UP action', () => {
    let state: GameState;

    beforeEach(() => {
      state = getInitialState(canvasWidth, canvasHeight);
    });

    it('should increment the level', () => {
      const newState = gameReducer(state, { type: 'LEVEL_UP' });
      expect(newState.level).toBe(state.level + 1);
    });

    it('should increase the ball speed', () => {
      const newState = gameReducer(state, { type: 'LEVEL_UP' });
      const originalSpeed = Math.sqrt(Constants.BALL_DX ** 2 + Constants.BALL_DY ** 2);
      const newSpeed = Math.sqrt(newState.ball.dx ** 2 + newState.ball.dy ** 2);
      expect(newSpeed).toBeGreaterThan(originalSpeed);
    });

    it('should generate new bricks for the next level', () => {
      const newState = gameReducer(state, { type: 'LEVEL_UP' });
      // The number of bricks should be different if the logic changes it (e.g., more rows)
      expect(newState.bricks.length).not.toBe(state.bricks.length);
    });

    it('should reset paddle and ball positions', () => {
      // Move the paddle and ball
      let modifiedState = gameReducer(state, { type: 'UPDATE_PADDLE_POSITION', payload: { x: 100 } });
      modifiedState = gameReducer(modifiedState, { type: 'UPDATE_BALL', payload: { x: 120, y: 150, dx: 5, dy: 5 } });
      
      const newState = gameReducer(modifiedState, { type: 'LEVEL_UP' });

      const expectedPaddleY = canvasHeight - Constants.PADDLE_HEIGHT - 20;
      expect(newState.paddle.y).toBe(expectedPaddleY);
      expect(newState.paddle.x).toBe((canvasWidth - Constants.PADDLE_WIDTH) / 2);

      const expectedBallY = expectedPaddleY - Constants.BALL_RADIUS;
      expect(newState.ball.y).toBe(expectedBallY);
    });
  });
});
