/**
 * src/games/brick-breaker/types.ts
 *
 * Defines the TypeScript types and interfaces used throughout the Brick Breaker Game.
 * This includes structures for game entities (paddle, ball, brick), game status,
 * the overall game state, and the actions that can be dispatched to the game reducer.
 */

/**
 * Defines the possible statuses of the Brick Breaker game.
 * @enum {string}
 */
export enum GameStatus {
  IDLE = "IDLE",                 // Game is waiting to start or has just been reset.
  PLAYING = "PLAYING",           // Game is actively being played.
  PAUSED = "PAUSED",             // Game is temporarily paused.
  GAME_OVER = "GAME_OVER",       // Game has ended due to losing all lives.
  LEVEL_CLEARED = "LEVEL_CLEARED", // All bricks in the current level have been broken.
}

/**
 * Represents the player's paddle in the game.
 * @interface Paddle
 * @property {number} x - The horizontal position of the paddle's top-left corner.
 * @property {number} y - The vertical position of the paddle's top-left corner.
 * @property {number} width - The width of the paddle.
 * @property {number} height - The height of the paddle.
 * @property {number} dx - The horizontal velocity of the paddle (change in x per frame).
 */
export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
}

/**
 * Represents the ball in the game.
 * @interface Ball
 * @property {number} x - The horizontal position of the ball's center.
 * @property {number} y - The vertical position of the ball's center.
 * @property {number} radius - The radius of the ball.
 * @property {number} dx - The horizontal velocity of the ball (change in x per frame).
 * @property {number} dy - The vertical velocity of the ball (change in y per frame).
 * @property {number} speed - The overall speed magnitude of the ball (not directly used for movement, but for reference).
 */
export interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  speed: number;
}

/**
 * Represents a single brick in the game.
 * @interface Brick
 * @property {number} x - The horizontal position of the brick's top-left corner.
 * @property {number} y - The vertical position of the brick's top-left corner.
 * @property {number} width - The width of the brick.
 * @property {number} height - The height of the brick.
 * @property {number} hits - How many hits the brick can withstand before breaking (currently always 1).
 * @property {boolean} isBroken - True if the brick has been broken, false otherwise.
 * @property {string} color - The color of the brick.
 */
export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  hits: number;
  isBroken: boolean;
  color: string;
}

/**
 * Represents the entire state of the Brick Breaker game at any given moment.
 * @interface GameState
 * @property {Paddle} paddle - The current state of the paddle.
 * @property {Ball} ball - The current state of the ball.
 * @property {Brick[]} bricks - An array of all bricks in the current level.
 * @property {number} score - The player's current score.
 * @property {number} lives - The number of lives remaining for the player.
 * @property {number} level - The current game level.
 * @property {GameStatus} gameStatus - The current status of the game.
 * @property {{ width: number; height: number }} canvas - The dimensions of the game canvas.
 */
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

/**
 * Defines the types of actions that can be dispatched to the Brick Breaker game reducer.
 * @typedef {object} Action
 * @property {'START_GAME'} type - Action to start the game.
 * @property {'PAUSE_GAME'} type - Action to pause the game.
 * @property {'RESUME_GAME'} type - Action to resume the game from a paused state.
 * @property {'RESET_GAME'} type - Action to reset the game to its initial state.
 * @property {'UPDATE_PADDLE_POSITION'} type - Action to update the paddle's horizontal position.
 * @property {object} payload - Contains the new 'x' position for the paddle.
 * @property {'SET_PADDLE_VELOCITY'} type - Action to set the paddle's horizontal velocity.
 * @property {object} payload - Contains the new 'dx' velocity for the paddle.
 * @property {'UPDATE_BALL'} type - Action to update the ball's position and velocity.
 * @property {object} payload - Contains the new 'x', 'y', 'dx', and 'dy' for the ball.
 * @property {'BREAK_BRICK'} type - Action to mark a brick as broken and update score.
 * @property {object} payload - Contains the index of the brick that was broken.
 * @property {'LOSE_LIFE'} type - Action to decrement a life and potentially trigger game over.
 * @property {'LEVEL_UP'} type - Action to advance to the next level.
 * @property {'GAME_OVER'} type - Action to set the game status to game over.
 * @property {'SET_CANVAS_SIZE'} type - Action to update the canvas dimensions in the state.
 * @property {object} payload - Contains the new 'width' and 'height' for the canvas.
 */
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
  | { type: "SET_PADDLE_Y"; payload: { y: number } };
