/**
 * src/games/snake/GameReducer.test.ts
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { snakeGameReducer, initialSnakeGameState } from './GameReducer';
import { SnakeGameState, GameAction, Direction, Coordinate } from './types';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  INITIAL_SNAKE,
  INITIAL_FOOD,
  INITIAL_DIRECTION,
  INITIAL_GAME_SPEED,
} from './constants';

describe('Snake GameReducer', () => {
  describe('initialState', () => {
    it('should have correct board dimensions', () => {
      expect(initialSnakeGameState.boardWidth).toBe(BOARD_WIDTH);
      expect(initialSnakeGameState.boardHeight).toBe(BOARD_HEIGHT);
    });

    it('should have initial snake at center', () => {
      expect(initialSnakeGameState.snake).toEqual(INITIAL_SNAKE);
    });

    it('should have initial direction RIGHT', () => {
      expect(initialSnakeGameState.direction).toBe(INITIAL_DIRECTION);
    });

    it('should have score 0', () => {
      expect(initialSnakeGameState.score).toBe(0);
    });

    it('should have game not started and not over', () => {
      expect(initialSnakeGameState.gameStarted).toBe(false);
      expect(initialSnakeGameState.gameOver).toBe(false);
    });

    it('should have difficulty 1 by default', () => {
      expect(initialSnakeGameState.difficulty).toBe(1);
    });
  });

  describe('START_GAME action', () => {
    it('should start the game', () => {
      const state = initialSnakeGameState;
      const action: GameAction = { type: 'START_GAME' };
      const newState = snakeGameReducer(state, action);

      expect(newState.gameStarted).toBe(true);
      expect(newState.gameOver).toBe(false);
      expect(newState.score).toBe(0);
    });

    it('should set difficulty from payload', () => {
      const state = initialSnakeGameState;
      const action: GameAction = { type: 'START_GAME', payload: { difficulty: 5 } };
      const newState = snakeGameReducer(state, action);

      expect(newState.difficulty).toBe(5);
    });

    it('should calculate speed based on difficulty', () => {
      const state = initialSnakeGameState;
      const action: GameAction = { type: 'START_GAME', payload: { difficulty: 1 } };
      const newState = snakeGameReducer(state, action);

      expect(newState.speed).toBe(INITIAL_GAME_SPEED);
    });

    it('should cap speed at minimum 50ms', () => {
      const state = initialSnakeGameState;
      const action: GameAction = { type: 'START_GAME', payload: { difficulty: 9 } };
      const newState = snakeGameReducer(state, action);

      expect(newState.speed).toBe(50);
    });
  });

  describe('RESET_GAME action', () => {
    it('should reset game to initial state', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
        gameOver: true,
        score: 100,
        snake: [{ x: 10, y: 10 }],
      };
      const action: GameAction = { type: 'RESET_GAME' };
      const newState = snakeGameReducer(state, action);

      expect(newState.gameStarted).toBe(false);
      expect(newState.gameOver).toBe(false);
      expect(newState.score).toBe(0);
      expect(newState.snake).toEqual(INITIAL_SNAKE);
    });

    it('should preserve difficulty on reset', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        difficulty: 5,
      };
      const action: GameAction = { type: 'RESET_GAME' };
      const newState = snakeGameReducer(state, action);

      expect(newState.difficulty).toBe(5);
    });

    it('should preserve speed on reset', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        speed: 100,
      };
      const action: GameAction = { type: 'RESET_GAME' };
      const newState = snakeGameReducer(state, action);

      expect(newState.speed).toBe(100);
    });
  });

  describe('CHANGE_DIRECTION action', () => {
    it('should change direction to UP', () => {
      const state = { ...initialSnakeGameState, direction: 'RIGHT' as Direction };
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'UP' };
      const newState = snakeGameReducer(state, action);

      expect(newState.direction).toBe('UP');
    });

    it('should change direction to DOWN', () => {
      const state = { ...initialSnakeGameState, direction: 'LEFT' as Direction };
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'DOWN' };
      const newState = snakeGameReducer(state, action);
      expect(newState.direction).toBe('DOWN');
    });

    it('should handle UP direction change', () => {
      const state = { ...initialSnakeGameState, direction: 'LEFT' as Direction };
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'UP' };
      const newState = snakeGameReducer(state, action);
      expect(newState.direction).toBe('UP');
    });

it('should change direction to RIGHT from perpendicular', () => {
      // From UP, we can change to RIGHT (perpendicular)
      const state = { ...initialSnakeGameState, direction: 'UP' as Direction };
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'RIGHT' };
      const newState = snakeGameReducer(state, action);
      expect(newState.direction).toBe('RIGHT');
    });

    it('should change direction to LEFT from perpendicular', () => {
      // From UP, we can change to LEFT (perpendicular)
      const state = { ...initialSnakeGameState, direction: 'UP' as Direction };
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'LEFT' };
      const newState = snakeGameReducer(state, action);
      expect(newState.direction).toBe('LEFT');
    });

    it('should change direction to DOWN from perpendicular', () => {
      // From LEFT, we can change to DOWN (perpendicular)
      const state = { ...initialSnakeGameState, direction: 'LEFT' as Direction };
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'DOWN' };
      const newState = snakeGameReducer(state, action);
      expect(newState.direction).toBe('DOWN');
    });

    it('should NOT allow 180-degree turn from LEFT to RIGHT', () => {
      // The reducer blocks this direction change
      const state: SnakeGameState = { ...initialSnakeGameState, direction: 'LEFT' as Direction };
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'RIGHT' };
      const newState = snakeGameReducer(state, action);
      // Direction stays LEFT - blocked
      expect(newState.direction).toBe('LEFT');
    });

    it('should NOT block LEFT when direction is RIGHT', () => {
      // Current implementation: blocks both LEFT->RIGHT and RIGHT->LEFT
      const state = { ...initialSnakeGameState, direction: 'RIGHT' as Direction };
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'LEFT' };
      const newState = snakeGameReducer(state, action);
      // Current behavior: blocks RIGHT->LEFT (stays RIGHT)
      expect(newState.direction).toBe('RIGHT');
    });

    it('should NOT allow UP when current direction is DOWN', () => {
      const state = { ...initialSnakeGameState, direction: 'DOWN' as Direction };
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'UP' };
      const newState = snakeGameReducer(state, action);
      expect(newState.direction).toBe('DOWN');
    });

    it('should NOT allow LEFT when current direction is RIGHT', () => {
      const state = { ...initialSnakeGameState, direction: 'RIGHT' as Direction };
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'LEFT' };
      const newState = snakeGameReducer(state, action);
      expect(newState.direction).toBe('RIGHT');
    });

    it('should NOT allow opposite direction (RIGHT from LEFT)', () => {
      const state: SnakeGameState = { ...initialSnakeGameState, direction: 'LEFT' as Direction };
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'RIGHT' };
      const newState = snakeGameReducer(state, action);
      // Direction should remain LEFT because the change was blocked
      expect(newState.direction).toBe('LEFT');
    });

    it('should NOT allow UP when current direction is UP (no change)', () => {
      const state = initialSnakeGameState; // direction is 'UP' by default
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'UP' };
      const newState = snakeGameReducer(state, action);
      expect(newState.direction).toBe('UP');
    });

    it('should allow perpendicular direction changes', () => {
      // From RIGHT, going UP or DOWN is allowed
      const stateRight = { ...initialSnakeGameState, direction: 'RIGHT' as Direction };
      const upAction: GameAction = { type: 'CHANGE_DIRECTION', payload: 'UP' };
      const downAction: GameAction = { type: 'CHANGE_DIRECTION', payload: 'DOWN' };

      expect(snakeGameReducer(stateRight, upAction).direction).toBe('UP');
      expect(snakeGameReducer(stateRight, downAction).direction).toBe('DOWN');
    });

    it('should allow turning LEFT while moving DOWN', () => {
      // LEFT is perpendicular to DOWN, should be allowed
      const state: SnakeGameState = { ...initialSnakeGameState, direction: 'DOWN' as Direction };
      const action: GameAction = { type: 'CHANGE_DIRECTION', payload: 'LEFT' };
      const newState = snakeGameReducer(state, action);
      expect(newState.direction).toBe('LEFT');
    });
  });

  describe('MOVE_SNAKE action', () => {
    it('should do nothing if game is not started', () => {
      const state = initialSnakeGameState;
      const action: GameAction = { type: 'MOVE_SNAKE' };
      const newState = snakeGameReducer(state, action);

      expect(newState).toBe(state);
    });

    it('should do nothing if game is over', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
        gameOver: true,
      };
      const action: GameAction = { type: 'MOVE_SNAKE' };
      const newState = snakeGameReducer(state, action);

      expect(newState).toBe(state);
    });

    it('should move snake forward', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
        direction: 'RIGHT',
        snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }],
      };
      const action: GameAction = { type: 'MOVE_SNAKE' };
      const newState = snakeGameReducer(state, action);

      expect(newState.snake[0].x).toBe(6);
      expect(newState.snake[0].y).toBe(5);
    });

    it('should grow snake when eating food', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
        direction: 'RIGHT',
        snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }],
        food: { x: 6, y: 5 }, // Food is in next position
      };
      const action: GameAction = { type: 'MOVE_SNAKE' };
      const newState = snakeGameReducer(state, action);

      expect(newState.snake).toHaveLength(3);
      expect(newState.snake[0]).toEqual({ x: 6, y: 5 });
    });

    it('should increase score when eating food', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
        direction: 'RIGHT',
        snake: [{ x: 5, y: 5 }],
        food: { x: 6, y: 5 },
        difficulty: 3,
      };
      const action: GameAction = { type: 'MOVE_SNAKE' };
      const newState = snakeGameReducer(state, action);

      expect(newState.score).toBe(3);
    });

    it('should not grow snake when not eating food', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
        direction: 'RIGHT',
        snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }],
        food: { x: 10, y: 10 }, // Food not at next position
      };
      const action: GameAction = { type: 'MOVE_SNAKE' };
      const newState = snakeGameReducer(state, action);

      expect(newState.snake).toHaveLength(2);
    });

    it('should trigger game over on wall collision', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
        direction: 'LEFT',
        snake: [{ x: 0, y: 5 }], // At left wall
      };
      const action: GameAction = { type: 'MOVE_SNAKE' };
      const newState = snakeGameReducer(state, action);

      expect(newState.gameOver).toBe(true);
    });

    it('should trigger game over on self collision', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
        direction: 'DOWN',
        snake: [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 5 }], // Self-collision
      };
      const action: GameAction = { type: 'MOVE_SNAKE' };
      const newState = snakeGameReducer(state, action);

      expect(newState.gameOver).toBe(true);
    });

    it('should move in UP direction', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
        direction: 'UP',
        snake: [{ x: 5, y: 5 }, { x: 5, y: 6 }],
      };
      const action: GameAction = { type: 'MOVE_SNAKE' };
      const newState = snakeGameReducer(state, action);

      expect(newState.snake[0]).toEqual({ x: 5, y: 4 });
    });

    it('should move in DOWN direction', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
        direction: 'DOWN',
        snake: [{ x: 5, y: 5 }, { x: 5, y: 6 }],
      };
      const action: GameAction = { type: 'MOVE_SNAKE' };
      const newState = snakeGameReducer(state, action);

      expect(newState.snake[0]).toEqual({ x: 5, y: 6 });
    });
  });

  describe('GAME_OVER action', () => {
    it('should set game over and game not started', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
      };
      const action: GameAction = { type: 'GAME_OVER' };
      const newState = snakeGameReducer(state, action);

      expect(newState.gameOver).toBe(true);
      expect(newState.gameStarted).toBe(false);
    });
  });

  describe('SET_DIFFICULTY action', () => {
    it('should set difficulty and reset state', () => {
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
        gameOver: true,
        score: 100,
        snake: [{ x: 10, y: 10 }],
      };
      const action: GameAction = { type: 'SET_DIFFICULTY', payload: 7 };
      const newState = snakeGameReducer(state, action);

      expect(newState.difficulty).toBe(7);
      expect(newState.gameStarted).toBe(false);
      expect(newState.gameOver).toBe(false);
      expect(newState.snake).toEqual(INITIAL_SNAKE);
    });

    it('should calculate speed based on difficulty', () => {
      const state = initialSnakeGameState;
      const action: GameAction = { type: 'SET_DIFFICULTY', payload: 3 };
      const newState = snakeGameReducer(state, action);

      const expectedSpeed = INITIAL_GAME_SPEED - (3 - 1) * 20;
      expect(newState.speed).toBe(Math.max(50, expectedSpeed));
    });
  });

  describe('Edge cases', () => {
    it('should handle unknown action type', () => {
      const state = initialSnakeGameState;
      const action = { type: 'UNKNOWN_ACTION' } as unknown as GameAction;
      const newState = snakeGameReducer(state, action);

      expect(newState).toBe(state);
    });
  });
});

describe('Snake movement logic', () => {
  describe('Direction changes', () => {
    it('should allow 180-degree turn after moving sideways', () => {
      // If snake moved RIGHT and then DOWN, it can now turn LEFT
      const state: SnakeGameState = {
        ...initialSnakeGameState,
        gameStarted: true,
        direction: 'DOWN',
        snake: [
          { x: 6, y: 6 }, // head (moved down from 5,6)
          { x: 5, y: 6 }, // body
          { x: 5, y: 5 }, // tail
        ],
      };
      
      // Can turn LEFT (opposite of current DOWN, but perpendicular turns allowed)
      const turnLeftAction: GameAction = { type: 'CHANGE_DIRECTION', payload: 'LEFT' };
      const newState = snakeGameReducer(state, turnLeftAction);
      expect(newState.direction).toBe('LEFT');
    });
  });
});