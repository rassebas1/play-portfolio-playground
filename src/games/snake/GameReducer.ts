/**
 * src/games/snake/GameReducer.ts
 *
 * Defines the reducer logic for the Snake game, managing state transitions
 * based on various game actions. It also includes helper functions for game mechanics.
 */

import { SnakeGameState, GameAction, Direction, Coordinate } from './types';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  INITIAL_SNAKE,
  INITIAL_FOOD,
  INITIAL_DIRECTION,
  INITIAL_GAME_SPEED,
  FOOD_SCORE_INCREMENT,
} from '../../utils/snake_const';

/**
 * Generates a random coordinate for food, ensuring it doesn't overlap with the snake's body.
 *
 * @param {Coordinate[]} snake - The current snake coordinates (array of segments).
 * @returns {Coordinate} A new Coordinate object for the food.
 */
const generateRandomFood = (snake: Coordinate[]): Coordinate => {
  let newFood: Coordinate;
  do {
    // Generate random x and y within board boundaries
    newFood = {
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)); // Ensure food doesn't spawn on snake
  return newFood;
};

/**
 * Calculates the next head position of the snake based on its current direction.
 *
 * @param {Coordinate} currentHead - The current head coordinate of the snake.
 * @param {Direction} direction - The current direction of the snake ('UP', 'DOWN', 'LEFT', 'RIGHT').
 * @returns {Coordinate} The next Coordinate for the snake's head.
 */
const getNextHeadPosition = (currentHead: Coordinate, direction: Direction): Coordinate => {
  switch (direction) {
    case 'UP':
      return { x: currentHead.x, y: currentHead.y - 1 };
    case 'DOWN':
      return { x: currentHead.x, y: currentHead.y + 1 };
    case 'LEFT':
      return { x: currentHead.x - 1, y: currentHead.y };
    case 'RIGHT':
      return { x: currentHead.x + 1, y: currentHead.y };
  }
};

/**
 * Checks if the snake has collided with itself or the board boundaries.
 *
 * @param {Coordinate} head - The new head position of the snake.
 * @param {Coordinate[]} snake - The current snake coordinates (excluding the new head, if checking self-collision).
 * @returns {boolean} True if a collision occurred, false otherwise.
 */
const checkCollision = (head: Coordinate, snake: Coordinate[]): boolean => {
  // Wall collision detection
  if (
    head.x < 0 ||
    head.x >= BOARD_WIDTH ||
    head.y < 0 ||
    head.y >= BOARD_HEIGHT
  ) {
    return true;
  }
  // Self-collision detection: checks if the head overlaps with any part of the snake's body
  return snake.some(segment => segment.x === head.x && segment.y === head.y);
};

/**
 * The initial state of the Snake game.
 * @type {SnakeGameState}
 */
export const initialSnakeGameState: SnakeGameState = {
  boardWidth: BOARD_WIDTH,
  boardHeight: BOARD_HEIGHT,
  snake: INITIAL_SNAKE,
  food: INITIAL_FOOD,
  direction: INITIAL_DIRECTION,
  score: 0,
  gameOver: false,
  gameStarted: false,
  speed: INITIAL_GAME_SPEED,
};

/**
 * Reducer function for the Snake game.
 * Manages state transitions based on dispatched actions.
 *
 * @param {SnakeGameState} state - The current game state.
 * @param {GameAction} action - The action to be performed.
 * @returns {SnakeGameState} The new game state.
 */
export const snakeGameReducer = (state: SnakeGameState, action: GameAction): SnakeGameState => {
  switch (action.type) {
    /**
     * Action: START_GAME
     * Sets the game to started, not over, and resets the score.
     */
    case 'START_GAME':
      return { ...state, gameStarted: true, gameOver: false, score: 0 };

    /**
     * Action: RESET_GAME
     * Resets the game to its initial state, including generating new food.
     */
    case 'RESET_GAME':
      // Generate new food based on the initial snake position
      return { ...initialSnakeGameState, food: generateRandomFood(initialSnakeGameState.snake) };

    /**
     * Action: CHANGE_DIRECTION
     * Updates the snake's direction, preventing immediate reversal.
     * Payload: { Direction } - The new desired direction.
     */
    case 'CHANGE_DIRECTION':
      const newDirection = action.payload;
      const currentDirection = state.direction;
      // Prevent the snake from immediately reversing its direction
      if (
        (newDirection === 'UP' && currentDirection === 'DOWN') ||
        (newDirection === 'DOWN' && currentDirection === 'UP') ||
        (newDirection === 'LEFT' && currentDirection === 'RIGHT') ||
        (newDirection === 'RIGHT' && currentDirection === 'LEFT')
      ) {
        return state; // Invalid direction change, return current state
      }
      return { ...state, direction: newDirection };

    /**
     * Action: MOVE_SNAKE
     * Advances the snake by one segment, handles food consumption, and checks for collisions.
     */
    case 'MOVE_SNAKE':
      if (state.gameOver || !state.gameStarted) return state; // Do nothing if game is over or not started

      const currentHead = state.snake[0];
      const nextHead = getNextHeadPosition(currentHead, state.direction);

      // Check for collision with walls or self (excluding the last segment for self-collision check)
      if (checkCollision(nextHead, state.snake.slice(0, -1))) {
        return { ...state, gameOver: true }; // Game over if collision detected
      }

      const newSnake = [nextHead, ...state.snake]; // Add new head
      let newFood = state.food;
      let newScore = state.score;

      // Check if snake eats food
      if (nextHead.x === state.food.x && nextHead.y === state.food.y) {
        newFood = generateRandomFood(newSnake); // Generate new food
        newScore += FOOD_SCORE_INCREMENT; // Increase score
      } else {
        newSnake.pop(); // Remove tail if no food eaten (snake moves without growing)
      }

      return { ...state, snake: newSnake, food: newFood, score: newScore };

    /**
     * Action: GAME_OVER
     * Explicitly sets the game status to over and stops the game.
     */
    case 'GAME_OVER':
      return { ...state, gameOver: true, gameStarted: false };

    /**
     * Default case: Returns the current state if the action type is not recognized.
     */
    default:
      return state;
  }
};
