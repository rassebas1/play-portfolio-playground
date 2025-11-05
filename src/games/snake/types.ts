// src/games/snake/types.ts

/**
 * Represents the possible directions the snake can move.
 */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/**
 * Represents a coordinate on the game board.
 */
export type Coordinate = { x: number; y: number };

/**
 * Represents the entire state of the Snake game.
 */
export type SnakeGameState = {
  boardWidth: number;
  boardHeight: number;
  snake: Coordinate[];
  food: Coordinate;
  direction: Direction;
  score: number;
  gameOver: boolean;
  gameStarted: boolean;
  speed: number; // Milliseconds per game tick
};

/**
 * Represents the actions that can be dispatched to the game reducer.
 */
export type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'CHANGE_DIRECTION'; payload: Direction }
  | { type: 'MOVE_SNAKE' }
  | { type: 'EAT_FOOD' }
  | { type: 'GAME_OVER' };
