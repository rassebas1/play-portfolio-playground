// src/games/brick-breaker/GameReducer.ts

import { Action, Ball, Brick, GameState, GameStatus, Paddle } from "./types";
import * as Constants from "../../utils/brick_breaker_const";

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
        isBroken: false,
        color: Constants.BRICK_COLORS[r % Constants.BRICK_COLORS.length],
      });
    }
  }
  return bricks;
};

export const getInitialState = (): GameState => ({
  paddle: {
    x: Constants.PADDLE_START_X,
    y: Constants.PADDLE_START_Y,
    width: Constants.PADDLE_WIDTH,
    height: Constants.PADDLE_HEIGHT,
    dx: 0,
  },
  ball: {
    x: Constants.BALL_START_X,
    y: Constants.BALL_START_Y,
    radius: Constants.BALL_RADIUS,
    dx: Constants.BALL_DX,
    dy: Constants.BALL_DY,
    speed: Constants.BALL_SPEED,
  },
  bricks: createBricks(Constants.INITIAL_LEVEL),
  score: Constants.INITIAL_SCORE,
  lives: Constants.INITIAL_LIVES,
  level: Constants.INITIAL_LEVEL,
  gameStatus: GameStatus.IDLE,
  canvas: {
    width: Constants.CANVAS_WIDTH,
    height: Constants.CANVAS_HEIGHT,
  },
});

export const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "START_GAME":
      return { ...state, gameStatus: GameStatus.PLAYING };
    case "PAUSE_GAME":
      return { ...state, gameStatus: GameStatus.PAUSED };
    case "RESUME_GAME":
      return { ...state, gameStatus: GameStatus.PLAYING };
    case "RESET_GAME":
      return { ...getInitialState(), bricks: createBricks(getInitialState().level) };
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
    default:
      return state;
  }
};