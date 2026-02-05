/**
 * Type definitions for Flappy Bird Game
 * Contains all game-specific types and interfaces
 */

/**
 * Represents the bird entity
 */
export interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
  isFlapping: boolean; // Added isFlapping property
}

/**
 * Represents a pipe obstacle
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
 * Game state interface for Flappy Bird
 */
export interface FlappyBirdState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  bestScore: number;
  isPlaying: boolean;
  isGameOver: boolean;
  gameStarted: boolean;
}

/**
 * Collision detection result
 */
export interface CollisionResult {
  hasCollision: boolean;
  collisionType?: 'pipe' | 'ground' | 'ceiling';
}

/**
 * Game dimensions and boundaries
 */
export interface GameDimensions {
  width: number;
  height: number;
  groundHeight: number;
  birdSize: number;
}
