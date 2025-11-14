// src/games/snake/types.ts

/**
 * Represents the possible directions the snake can move.
 */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/**
 * Represents a coordinate on the game board.
 */
export type Coordinate = { x: number; y: number };

export type Difficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

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
  difficulty: Difficulty; // Add difficulty level
};

/**
 * Represents the actions that can be dispatched to the game reducer.
 */
export type GameAction =
  | { type: 'START_GAME'; payload?: { difficulty: Difficulty } }
  | { type: 'RESET_GAME' }
  | { type: 'CHANGE_DIRECTION'; payload: Direction }
  | { type: 'MOVE_SNAKE' }
  | { type: 'EAT_FOOD' }
  | { type: 'GAME_OVER' }
  | { type: 'SET_DIFFICULTY'; payload: Difficulty };
