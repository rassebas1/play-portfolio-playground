/**
 * src/games/brick-breaker/GameReducer.ts
 *
 * Defines the reducer logic for the Brick Breaker game, managing state transitions
 * based on various game actions. It handles paddle and ball movement, brick breaking,
 * score updates, life management, and level progression.
 */

import { Action, Ball, Brick, GameState, GameStatus, Paddle } from "./types";
import * as Constants from "../../utils/brick_breaker_const";

/**
 * Creates an array of bricks for a given level.
 * Bricks are arranged in rows and columns based on defined constants.
 *
 * @param {number} level - The current game level (can be used for varied brick layouts in future).
 * @returns {Brick[]} An array of Brick objects.
 */
const createBricks = (level: number): Brick[] => {
  const bricks: Brick[] = [];
  for (let r = 0; r < Constants.BRICK_ROWS; r++) {
    for (let c = 0; c < Constants.BRICK_COLUMNS; c++) {
      const x = c * (Constants.BRICK_WIDTH + Constants.BRICK_PADDING) + Constants.BRICK_OFFSET_LEFT;
      const y = r * (Constants.BRICK_HEIGHT + Constants.BRICK_PADDING) + Constants.BRICK_OFFSET_TOP;
      bricks.push({
        x,
        y,
        width: Constants.BRICK_WIDTH,
        height: Constants.BRICK_HEIGHT,
        hits: 1, // All bricks take 1 hit for now
        isBroken: false, // Initially not broken
        color: Constants.BRICK_COLORS[r % Constants.BRICK_COLORS.length], // Color based on row
      });
    }
  }
  return bricks;
};

/**
 * Returns the initial state for the Brick Breaker game.
 * This function is called to set up a new game or reset the current one.
 *
 * @returns {GameState} The initial game state.
 */
export const getInitialState = (): GameState => ({
  paddle: {
    x: Constants.PADDLE_START_X,
    y: Constants.PADDLE_START_Y,
    width: Constants.PADDLE_WIDTH,
    height: Constants.PADDLE_HEIGHT,
    dx: 0, // Initial horizontal velocity of the paddle
  },
  ball: {
    x: Constants.BALL_START_X,
    y: Constants.BALL_START_Y,
    radius: Constants.BALL_RADIUS,
    dx: Constants.BALL_DX, // Initial horizontal velocity of the ball
    dy: Constants.BALL_DY, // Initial vertical velocity of the ball
    speed: Constants.BALL_SPEED,
  },
  bricks: createBricks(Constants.INITIAL_LEVEL), // Generate bricks for the initial level
  score: Constants.INITIAL_SCORE,
  lives: Constants.INITIAL_LIVES,
  level: Constants.INITIAL_LEVEL,
  gameStatus: GameStatus.IDLE, // Game starts in an idle state
  canvas: {
    width: Constants.CANVAS_WIDTH,
    height: Constants.CANVAS_HEIGHT,
  },
});

/**
 * Reducer function for the Brick Breaker game.
 * Manages state transitions based on dispatched actions.
 *
 * @param {GameState} state - The current state of the game.
 * @param {Action} action - The action to be performed.
 * @returns {GameState} The new state of the game.
 */
export const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    /**
     * Action: START_GAME
     * Sets the game status to 'playing'.
     */
    case "START_GAME":
      return { ...state, gameStatus: GameStatus.PLAYING };
    
    /**
     * Action: PAUSE_GAME
     * Sets the game status to 'paused'.
     */
    case "PAUSE_GAME":
      return { ...state, gameStatus: GameStatus.PAUSED };
    
    /**
     * Action: RESUME_GAME
     * Sets the game status back to 'playing' from 'paused'.
     */
    case "RESUME_GAME":
      return { ...state, gameStatus: GameStatus.PLAYING };
    
    /**
     * Action: RESET_GAME
     * Resets the game to its initial state, including new bricks for the starting level.
     */
    case "RESET_GAME":
      return { ...getInitialState(), bricks: createBricks(getInitialState().level) };
    
    /**
     * Action: SET_PADDLE_VELOCITY
     * Updates the horizontal velocity (dx) of the paddle.
     * Payload: { dx: number } - The new horizontal velocity.
     */
    case "SET_PADDLE_VELOCITY":
      return {
        ...state,
        paddle: {
          ...state.paddle,
          dx: action.payload.dx,
        },
      };
    
    /**
     * Action: UPDATE_PADDLE_POSITION
     * Updates the horizontal position (x) of the paddle.
     * Payload: { x: number } - The new horizontal position.
     */
    case "UPDATE_PADDLE_POSITION":
      return {
        ...state,
        paddle: {
          ...state.paddle,
          x: action.payload.x,
        },
      };
    
    /**
     * Action: UPDATE_BALL
     * Updates the ball's position and velocity.
     * Payload: { x: number; y: number; dx: number; dy: number } - The new ball properties.
     */
    case "UPDATE_BALL":
      return {
        ...state,
        ball: {
          ...state.ball,
          x: action.payload.x,
          y: action.payload.y,
          dx: action.payload.dx,
          dy: action.payload.dy,
        },
      };
    
    /**
     * Action: BREAK_BRICK
     * Marks a brick as broken and updates the score.
     * Payload: { index: number } - The index of the brick to break.
     */
    case "BREAK_BRICK":
      const newBricks = [...state.bricks];
      if (newBricks[action.payload.index]) {
        newBricks[action.payload.index] = { ...newBricks[action.payload.index], isBroken: true };
      }
      return {
        ...state,
        bricks: newBricks,
        score: state.score + 10, // Example score for breaking a brick
      };
    
    /**
     * Action: LOSE_LIFE
     * Decrements a life. If lives reach zero, the game status is set to 'GAME_OVER'.
     */
    case "LOSE_LIFE":
      const newLives = state.lives - 1;
      if (newLives <= 0) {
        return { ...state, lives: 0, gameStatus: GameStatus.GAME_OVER };
      }
      return {
        ...state,
        lives: newLives,
        ball: { // Reset ball position after losing a life
          ...state.ball,
          x: Constants.BALL_START_X,
          y: Constants.BALL_START_Y,
          dx: Constants.BALL_DX,
          dy: Constants.BALL_DY,
        },
        gameStatus: GameStatus.IDLE, // Ball waits on paddle after losing a life
      };
    
    /**
     * Action: LEVEL_UP
     * Increments the level, generates new bricks, and resets ball/paddle for the next level.
     */
    case "LEVEL_UP":
      const nextLevel = state.level + 1;
      return {
        ...state,
        level: nextLevel,
        bricks: createBricks(nextLevel), // Generate new bricks for next level
        ball: { // Reset ball for new level
          ...state.ball,
          x: Constants.BALL_START_X,
          y: Constants.BALL_START_Y,
          dx: Constants.BALL_DX,
          dy: Constants.BALL_DY,
        },
        paddle: { // Reset paddle for new level
          ...state.paddle,
          x: Constants.PADDLE_START_X,
        },
        gameStatus: GameStatus.IDLE, // Ball waits on paddle for new level
      };
    
    /**
     * Action: GAME_OVER
     * Explicitly sets the game status to 'GAME_OVER'.
     */
    case "GAME_OVER":
      return { ...state, gameStatus: GameStatus.GAME_OVER };
    
    /**
     * Action: SET_CANVAS_SIZE
     * Updates the canvas dimensions in the state.
     * Payload: { width: number; height: number } - The new canvas dimensions.
     */
    case "SET_CANVAS_SIZE":
      return {
        ...state,
        canvas: {
          width: action.payload.width,
          height: action.payload.height,
        },
      };
    
    /**
     * Default case: Returns the current state if the action type is not recognized.
     */
    default:
      return state;
  }
};