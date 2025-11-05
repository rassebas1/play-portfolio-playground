// src/games/snake/GameReducer.ts

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
 * Generates a random coordinate for food, ensuring it doesn't overlap with the snake.
 * @param snake The current snake coordinates.
 * @returns A new Coordinate for the food.
 */
const generateRandomFood = (snake: Coordinate[]): Coordinate => {
  let newFood: Coordinate;
  do {
    newFood = {
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

/**
 * Calculates the next head position of the snake based on its current direction.
 * @param currentHead The current head coordinate of the snake.
 * @param direction The current direction of the snake.
 * @returns The next Coordinate for the snake's head.
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
 * @param head The new head position of the snake.
 * @param snake The current snake coordinates (excluding the new head).
 * @returns True if a collision occurred, false otherwise.
 */
const checkCollision = (head: Coordinate, snake: Coordinate[]): boolean => {
  // Wall collision
  if (
    head.x < 0 ||
    head.x >= BOARD_WIDTH ||
    head.y < 0 ||
    head.y >= BOARD_HEIGHT
  ) {
    return true;
  }
  // Self-collision
  return snake.some(segment => segment.x === head.x && segment.y === head.y);
};

/**
 * The initial state of the Snake game.
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
 * @param state The current game state.
 * @param action The action to be performed.
 * @returns The new game state.
 */
export const snakeGameReducer = (state: SnakeGameState, action: GameAction): SnakeGameState => {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, gameStarted: true, gameOver: false, score: 0 };

    case 'RESET_GAME':
      return { ...initialSnakeGameState, food: generateRandomFood(initialSnakeGameState.snake) };

    case 'CHANGE_DIRECTION':
      // Prevent reversing direction immediately
      const newDirection = action.payload;
      const currentDirection = state.direction;
      if (
        (newDirection === 'UP' && currentDirection === 'DOWN') ||
        (newDirection === 'DOWN' && currentDirection === 'UP') ||
        (newDirection === 'LEFT' && currentDirection === 'RIGHT') ||
        (newDirection === 'RIGHT' && currentDirection === 'LEFT')
      ) {
        return state; // Invalid direction change
      }
      return { ...state, direction: newDirection };

    case 'MOVE_SNAKE':
      if (state.gameOver || !state.gameStarted) return state;

      const currentHead = state.snake[0];
      const nextHead = getNextHeadPosition(currentHead, state.direction);

      if (checkCollision(nextHead, state.snake.slice(0, -1))) { // Check collision with body excluding tail
        return { ...state, gameOver: true };
      }

      const newSnake = [nextHead, ...state.snake];
      let newFood = state.food;
      let newScore = state.score;

      // Check if snake eats food
      if (nextHead.x === state.food.x && nextHead.y === state.food.y) {
        newFood = generateRandomFood(newSnake);
        newScore += FOOD_SCORE_INCREMENT;
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return { ...state, snake: newSnake, food: newFood, score: newScore };

    case 'GAME_OVER':
      return { ...state, gameOver: true, gameStarted: false };

    default:
      return state;
  }
};
