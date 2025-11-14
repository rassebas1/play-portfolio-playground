import { Action, Ball, Brick, GameState, GameStatus, Paddle } from "./types";
import * as Constants from "../../utils/brick_breaker_const";

const createBricks = (level: number, canvasWidth: number): Brick[] => {
  const bricks: Brick[] = [];
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
      const y = r * (Constants.BRICK_HEIGHT + Constants.BRICK_PADDING) + Constants.BRICK_OFFSET_TOP;
      bricks.push({
        x,
        y,
        width: Constants.BRICK_WIDTH,
        height: Constants.BRICK_HEIGHT,
        hits: 1, // All bricks take 1 hit for now
        isBroken: false,
        color: Constants.BRICK_COLORS[r % Constants.BRICK_COLORS.length],
      });
    }
  }
  return bricks;
};

export const getInitialState = (canvasWidth: number, canvasHeight: number): GameState => {
  // Recalculate dependent constants based on dynamic canvas size
  const PADDLE_WIDTH = Constants.PADDLE_WIDTH;
  const PADDLE_HEIGHT = Constants.PADDLE_HEIGHT;
  const PADDLE_START_X = (canvasWidth - PADDLE_WIDTH) / 2;
  const PADDLE_START_Y = canvasHeight - PADDLE_HEIGHT - 20; // 20 pixels from the bottom

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

export const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "START_GAME":
      return { ...state, gameStatus: GameStatus.PLAYING };
    case "PAUSE_GAME":
      return { ...state, gameStatus: GameStatus.PAUSED };
    case "RESUME_GAME":
      return { ...state, gameStatus: GameStatus.PLAYING };
    case "RESET_GAME":
      return { ...getInitialState(state.canvas.width, state.canvas.height), bricks: createBricks(Constants.INITIAL_LEVEL, state.canvas.width) };
    case "SET_PADDLE_VELOCITY":
      return {
        ...state,
        paddle: {
          ...state.paddle,
          dx: action.payload.dx,
        },
      };
    case "UPDATE_PADDLE_POSITION":
      return {
        ...state,
        paddle: {
          ...state.paddle,
          x: action.payload.x,
        },
      };
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
    case "BREAK_BRICK":
      const newBricks = [...state.bricks];
      if (newBricks[action.payload.index]) {
        newBricks[action.payload.index].isBroken = true;
      }
      return {
        ...state,
        bricks: newBricks,
        score: state.score + 10, // Example score for breaking a brick
      };
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
        gameStatus: GameStatus.IDLE, // Ball waits on paddle
      };
    case "LEVEL_UP":
      const nextLevel = state.level + 1;
      return {
        ...state,
        level: nextLevel,
        bricks: createBricks(nextLevel, state.canvas.width), // Generate new bricks for next level
        ball: { // Reset ball for new level
          ...state.ball,
          x: state.canvas.width / 2,
          y: (state.canvas.height - state.paddle.height - 20) - state.ball.radius,
          dx: Constants.BALL_DX,
          dy: Constants.BALL_DY,
        },
        paddle: { // Reset paddle for new level
          ...state.paddle,
          x: (state.canvas.width - state.paddle.width) / 2,
        },
        gameStatus: GameStatus.IDLE, // Ball waits on paddle
      };
    case "GAME_OVER":
      return { ...state, gameStatus: GameStatus.GAME_OVER };
    case "SET_CANVAS_SIZE":
      return {
        ...state,
        canvas: {
          width: action.payload.width,
          height: action.payload.height,
        },
      };
    case "SET_PADDLE_Y":
      return {
        ...state,
        paddle: {
          ...state.paddle,
          y: action.payload.y,
        },
      };
    case "SET_BALL_Y":
      return {
        ...state,
        ball: {
          ...state.ball,
          y: action.payload.y,
        },
      };
    default:
      return state;
  }
};