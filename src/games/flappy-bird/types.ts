/**
 * Type definitions for Flappy Bird Game.
 * Contains all game-specific types and interfaces used throughout the Flappy Bird game.
 */

/**
 * Represents the bird entity in the game.
 * @interface Bird
 * @property {number} x - The horizontal position of the bird.
 * @property {number} y - The vertical position of the bird.
 * @property {number} velocity - The current vertical velocity of the bird.
 * @property {number} rotation - The current rotation angle of the bird in degrees.
 */
export interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

/**
 * Represents a pipe obstacle in the game.
 * @interface Pipe
 * @property {string} id - A unique identifier for the pipe.
 * @property {number} x - The horizontal position of the pipe.
 * @property {number} topHeight - The height of the top segment of the pipe.
 * @property {number} bottomY - The Y-coordinate where the bottom segment of the pipe begins.
 * @property {number} width - The width of the pipe.
 * @property {boolean} passed - True if the bird has successfully passed this pipe, false otherwise.
 */
export interface Pipe {
  id: string;
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  passed: boolean;
}

/**
 * Game state interface for Flappy Bird.
 * Note: `bestScore` is now managed by `useHighScores` and integrated via `useGame`.
 * @interface FlappyBirdState
 * @property {Bird} bird - The current state of the bird.
 * @property {Pipe[]} pipes - An array of all active pipe obstacles.
 * @property {number} score - The player's current score.
 * @property {boolean} isPlaying - True if the game is currently active, false if paused or idle.
 * @property {boolean} isGameOver - True if the game has ended due to a collision, false otherwise.
 * @property {boolean} gameStarted - True if the game has been initiated, false if in initial idle state.
 */
export interface FlappyBirdState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  isPlaying: boolean;
  isGameOver: boolean;
  gameStarted: boolean;
}

/**
 * Represents the result of a collision check.
 * @interface CollisionResult
 * @property {boolean} hasCollision - True if a collision occurred, false otherwise.
 * @property {'pipe' | 'ground' | 'ceiling'} [collisionType] - Optional: The type of object the bird collided with.
 */
export interface CollisionResult {
  hasCollision: boolean;
  collisionType?: 'pipe' | 'ground' | 'ceiling';
}

/**
 * Defines the dimensions and key boundary values for the game area.
 * @interface GameDimensions
 * @property {number} width - The total width of the game canvas/area.
 * @property {number} height - The total height of the game canvas/area.
 * @property {number} groundHeight - The height of the ground element at the bottom of the screen.
 * @property {number} birdSize - The size (width/height) of the bird entity.
 */
export interface GameDimensions {
  width: number;
  height: number;
  groundHeight: number;
  birdSize: number;
}