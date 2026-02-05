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
const createBricks = (level: number, canvasWidth: number): Brick[] => {
  const bricks: Brick[] = [];
  // Calculate BRICK_COLUMNS dynamically based on canvasWidth
  const BRICK_COLUMNS = Math.floor((canvasWidth - 2 * Constants.BRICK_OFFSET_LEFT) / (Constants.BRICK_WIDTH + Constants.BRICK_PADDING));
  // Calculate BRICK_OFFSET_LEFT dynamically to center the bricks
  const BRICK_OFFSET_LEFT = (canvasWidth - (BRICK_COLUMNS * (Constants.BRICK_WIDTH + Constants.BRICK_PADDING) - Constants.BRICK_PADDING)) / 2;

  if (BRICK_COLUMNS <= 0 || Constants.BRICK_ROWS <= 0) {
    return bricks;
  }

  // Calculate BRICK_COLUMNS dynamically based on canvasWidth
  const BRICK_COLUMNS = Math.floor((canvasWidth - 2 * Constants.BRICK_OFFSET_LEFT) / (Constants.BRICK_WIDTH + Constants.BRICK_PADDING));
  // Calculate BRICK_OFFSET_LEFT dynamically to center the bricks
  const BRICK_OFFSET_LEFT = (canvasWidth - (BRICK_COLUMNS * (Constants.BRICK_WIDTH + Constants.BRICK_PADDING) - Constants.BRICK_PADDING)) / 2;

  if (BRICK_COLUMNS <= 0 || Constants.BRICK_ROWS <= 0) {
    return bricks;
  }

  for (let r = 0; r < Constants.BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLUMNS; c++) {
      const x = c * (Constants.BRICK_WIDTH + Constants.BRICK_PADDING) + BRICK_OFFSET_LEFT;
    for (let c = 0; c < BRICK_COLUMNS; c++) {
      const x = c * (Constants.BRICK_WIDTH + Constants.BRICK_PADDING) + BRICK_OFFSET_LEFT;
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
 * @param {number} canvasWidth - The width of the game canvas.
 * @param {number} canvasHeight - The height of the game canvas.
 * @returns {GameState} The initial game state.
 */
export const getInitialState = (canvasWidth: number, canvasHeight: number): GameState => {
  // Recalculate dependent constants based on dynamic canvas size
  const PADDLE_WIDTH = Constants.PADDLE_WIDTH;
  const PADDLE_HEIGHT = Constants.PADDLE_HEIGHT;
  const PADDLE_START_X = (canvasWidth - PADDLE_WIDTH) / 2;
  const PADDLE_START_Y = canvasHeight - PADDLE_HEIGHT + 5; // Move paddle 5 pixels below the canvas bottom edge

  const BALL_RADIUS = Constants.BALL_RADIUS;
  const BALL_START_X = canvasWidth / 2;
  const BALL_START_Y = PADDLE_START_Y - BALL_RADIUS;

  return {
    paddle: {
      x: PADDLE_START_X,
      y: PADDLE_START_Y,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      dx: 0, // Initial horizontal velocity of the paddle
    },
    ball: {
      x: BALL_START_X,
      y: BALL_START_Y,
      radius: BALL_RADIUS,
      dx: Constants.BALL_DX, // Initial horizontal velocity of the ball
      dy: Constants.BALL_DY, // Initial vertical velocity of the ball
      speed: Constants.BALL_SPEED,
    },
    bricks: createBricks(Constants.INITIAL_LEVEL, canvasWidth), // Generate bricks for the initial level
    score: Constants.INITIAL_SCORE,
    lives: Constants.INITIAL_LIVES,
    level: Constants.INITIAL_LEVEL,
    gameStatus: GameStatus.IDLE, // Game starts in an idle state
    canvas: {
      width: canvasWidth,
      height: canvasHeight,
    },
  };
};

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
      return { ...getInitialState(state.canvas.width, state.canvas.height), bricks: createBricks(state.level, state.canvas.width) };
    
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
          x: state.canvas.width / 2,
          y: state.paddle.y - state.ball.radius,
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

      // Recalculate dependent constants based on dynamic canvas size
      const PADDLE_WIDTH_LVL_UP = Constants.PADDLE_WIDTH;
      const PADDLE_HEIGHT_LVL_UP = Constants.PADDLE_HEIGHT;
      const PADDLE_START_X_LVL_UP = (state.canvas.width - PADDLE_WIDTH_LVL_UP) / 2;
      const PADDLE_START_Y_LVL_UP = state.canvas.height - PADDLE_HEIGHT_LVL_UP - 10;

      const BALL_RADIUS_LVL_UP = Constants.BALL_RADIUS;
      const BALL_START_X_LVL_UP = state.canvas.width / 2;
      const BALL_START_Y_LVL_UP = PADDLE_START_Y_LVL_UP - BALL_RADIUS_LVL_UP;

      return {
        ...state,
        level: nextLevel,
        bricks: createBricks(nextLevel, state.canvas.width), // Generate new bricks for next level with dynamic width
        ball: { // Reset ball for new level
          ...state.ball,
          x: BALL_START_X_LVL_UP,
          y: BALL_START_Y_LVL_UP,
          dx: Constants.BALL_DX,
          dy: Constants.BALL_DY,
        },
        paddle: { // Reset paddle for new level
          ...state.paddle,
          x: PADDLE_START_X_LVL_UP,
          y: PADDLE_START_Y_LVL_UP,
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
      const newCanvasWidth = action.payload.width;
      const newCanvasHeight = action.payload.height;

      // Recalculate paddle's Y position based on new canvas height
      const PADDLE_HEIGHT_NEW = Constants.PADDLE_HEIGHT;
      const newPaddleY = newCanvasHeight - PADDLE_HEIGHT_NEW; // Paddle's top edge at canvasHeight - PADDLE_HEIGHT

      const BALL_RADIUS_NEW = Constants.BALL_RADIUS;
      const newBallY = newPaddleY - BALL_RADIUS_NEW; // Ball's center just above paddle's top

      return {
        ...state,
        canvas: {
          width: newCanvasWidth,
          height: newCanvasHeight,
        },
        paddle: {
          ...state.paddle,
          y: newPaddleY,
        },
        ball: {
          ...state.ball,
          y: newBallY,
        },
      };
    
    /**
     * Action: SET_PADDLE_Y
     * Updates the vertical position (y) of the paddle.
     * Payload: { y: number } - The new vertical position.
     */
    case "SET_PADDLE_Y":
      return {
        ...state,
        paddle: {
          ...state.paddle,
          y: action.payload.y,
        },
      };
    
    /**
     * Default case: Returns the current state if the action type is not recognized.
     */
    default:
      return state;
  }
};