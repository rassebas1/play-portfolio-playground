// src/games/brick-breaker/types.ts

export enum GameStatus {
  IDLE = "IDLE",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  GAME_OVER = "GAME_OVER",
  LEVEL_CLEARED = "LEVEL_CLEARED",
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number; // change in x for movement
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number; // change in x
  dy: number; // change in y
  speed: number;
}

export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  hits: number; // how many hits to break
  isBroken: boolean;
  color: string;
}

export interface GameState {
  paddle: Paddle;
  ball: Ball;
  bricks: Brick[];
  score: number;
  lives: number;
  level: number;
  gameStatus: GameStatus;
  canvas: {
    width: number;
    height: number;
  };
}

export type Action =
  | { type: "START_GAME" }
  | { type: "PAUSE_GAME" }
  | { type: "RESUME_GAME" }
  | { type: "RESET_GAME" }
  | { type: "UPDATE_PADDLE_POSITION"; payload: { x: number } }
  | { type: "SET_PADDLE_VELOCITY"; payload: { dx: number } }
  | { type: "UPDATE_BALL"; payload: { x: number; y: number; dx: number; dy: number } }
  | { type: "BREAK_BRICK"; payload: { index: number } }
  | { type: "LOSE_LIFE" }
  | { type: "LEVEL_UP" }
  | { type: "GAME_OVER" }
  | { type: "SET_CANVAS_SIZE"; payload: { width: number; height: number } }
  | { type: "SET_PADDLE_Y"; payload: { y: number } }
  | { type: "SET_BALL_Y"; payload: { y: number } };
