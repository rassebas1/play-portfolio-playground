/**
 * src/games/snake/types.ts
 *
 * Defines the TypeScript types and interfaces used throughout the Snake Game.
 * This includes structures for directions, coordinates, the overall game state,
 * and the actions that can be dispatched to the game reducer.
 */

/**
 * Represents the possible directions the snake can move.
 * @typedef {'UP' | 'DOWN' | 'LEFT' | 'RIGHT'} Direction
 */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/**
 * Represents a 2D coordinate on the game board.
 * @interface Coordinate
 * @property {number} x - The horizontal position.
 * @property {number} y - The vertical position.
 */
export type Coordinate = { x: number; y: number };

/**
 * Represents the entire state of the Snake game at any given moment.
 * @interface SnakeGameState
 * @property {number} boardWidth - The width of the game board in cells.
 * @property {number} boardHeight - The height of the game board in cells.
 * @property {Coordinate[]} snake - An array of coordinates representing each segment of the snake's body.
 * @property {Coordinate} food - The coordinate of the food item on the board.
 * @property {Direction} direction - The current direction the snake is moving.
 * @property {number} score - The player's current score.
 * @property {boolean} gameOver - True if the game is over, false otherwise.
 * @property {boolean} gameStarted - True if the game has started, false otherwise.
 * @property {number} speed - The game speed in milliseconds per game tick (lower value means faster game).
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
  speed: number;
};

/**
 * Defines the types of actions that can be dispatched to the Snake Game reducer.
 * @typedef {object} GameAction
 * @property {'START_GAME'} type - Action to start a new game.
 *
 * @property {'RESET_GAME'} type - Action to reset the game to its initial state.
 *
 * @property {'CHANGE_DIRECTION'} type - Action to change the snake's direction.
 * @property {Direction} payload - The new direction.
 *
 * @property {'MOVE_SNAKE'} type - Action to move the snake one step in its current direction.
 *
 * @property {'EAT_FOOD'} type - Action to handle the snake eating food (not directly used in reducer, but could be for future features).
 *
 * @property {'GAME_OVER'} type - Action to set the game status to 'gameOver'.
 */
export type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'CHANGE_DIRECTION'; payload: Direction }
  | { type: 'MOVE_SNAKE' }
  | { type: 'EAT_FOOD' }
  | { type: 'GAME_OVER' };
