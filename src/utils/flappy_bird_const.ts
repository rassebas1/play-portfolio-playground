import type { GamePhysics, GameDimensions } from '@/types/global';

/**
 * src/utils/flappy_bird_const.ts
 *
 * Defines constants for the Flappy Bird game, including its dimensions and physics properties.
 * These constants are crucial for configuring the game's visual layout and physical behavior.
 */

/**
 * Defines the dimensions and key boundary values for the Flappy Bird game area.
 * @constant {GameDimensions}
 */
export const GAME_DIMENSIONS: GameDimensions = {
  width: 400,
  height: 600,
  groundHeight: 80,
  birdSize: 40, // Increased birdSize
};

/**
 * Defines the physics constants that govern the bird's movement and pipe behavior.
 * @constant {GamePhysics}
 */
export const PHYSICS: GamePhysics = {
  gravity: 0.6,          // The downward acceleration applied to the bird each frame.
  jumpVelocity: -10,     // The initial upward velocity applied to the bird when it jumps.
  terminalVelocity: 15,  // The maximum downward velocity the bird can reach.
  pipeSpeed: 3,          // The horizontal speed at which pipes move towards the bird.
  pipeGap: 250,          // The vertical gap size between the top and bottom pipe segments.
  pipeWidth: 50,         // The width of the pipe obstacles.
};
