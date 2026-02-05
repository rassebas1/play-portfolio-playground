/**
 * src/games/flappy-bird/gameLogic.ts
 *
 * Contains core game logic functions for the Flappy Bird game,
 * including bird and pipe creation, physics updates, and collision detection.
 */

import type { Bird, Pipe, CollisionResult } from './types';
import { GAME_DIMENSIONS, PHYSICS } from '../../utils/flappy_bird_const';

/**
 * Creates and returns the initial state of the bird.
 *
 * @returns {Bird} The initial bird object.
 */
export const createInitialBird = (): Bird => ({
  x: 100,
  y: GAME_DIMENSIONS.height / 2,
  velocity: 0,
  rotation: 0,
  isFlapping: false, // Added isFlapping property
});

/**
 * Creates a new pipe object at a given X position with a random gap height.
 *
 * @param {number} x - The initial X position of the pipe.
 * @returns {Pipe} The newly created pipe object.
 */
export const createPipe = (x: number): Pipe => {
  // Define min/max heights for the top pipe segment to ensure playability
  const minTopHeight = 100;
  const maxTopHeight = GAME_DIMENSIONS.height - GAME_DIMENSIONS.groundHeight - PHYSICS.pipeGap - 100;
  // Randomly determine the height of the top pipe segment
  const topHeight = Math.random() * (maxTopHeight - minTopHeight) + minTopHeight;
  
  return {
    id: `pipe-${Date.now()}-${Math.random()}`, // Unique ID for the pipe
    x, // Current X position
    topHeight, // Height of the top pipe segment
    bottomY: topHeight + PHYSICS.pipeGap, // Y-coordinate where the bottom pipe starts
    width: PHYSICS.pipeWidth, // Width of the pipe
    passed: false, // Flag to track if the bird has passed this pipe for scoring
  };
};

/**
 * Checks for collisions between the bird and pipes, ground, or ceiling.
 *
 * @param {Bird} bird - The current state of the bird.
 * @param {Pipe[]} pipes - An array of current pipe objects.
 * @returns {CollisionResult} An object indicating if a collision occurred and its type.
 */
export const checkCollision = (bird: Bird, pipes: Pipe[]): CollisionResult => {
  // Calculate bird's bounding box coordinates
  const birdLeft = bird.x - GAME_DIMENSIONS.birdSize / 2;
  const birdRight = bird.x + GAME_DIMENSIONS.birdSize / 2;
  const birdTop = bird.y - GAME_DIMENSIONS.birdSize / 2;
  const birdBottom = bird.y + GAME_DIMENSIONS.birdSize / 2;

  // Check collision with the ground
  if (birdBottom >= GAME_DIMENSIONS.height - GAME_DIMENSIONS.groundHeight) {
    return { hasCollision: true, collisionType: 'ground' };
  }

  // Check collision with the ceiling
  if (birdTop <= 0) {
    return { hasCollision: true, collisionType: 'ceiling' };
  }

  // Check collision with each pipe
  for (const pipe of pipes) {
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + pipe.width;

    // Check if bird's horizontal position overlaps with the pipe
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      // Check collision with the top pipe segment
      if (birdTop < pipe.topHeight) {
        return { hasCollision: true, collisionType: 'pipe' };
      }
      // Check collision with the bottom pipe segment
      if (birdBottom > pipe.bottomY) {
        return { hasCollision: true, collisionType: 'pipe' };
      }
    }
  }

  // No collision detected
  return { hasCollision: false };
};

/**
 * Updates the bird's vertical position and velocity based on gravity and current velocity.
 * Also calculates the bird's rotation for visual effect.
 *
 * @param {Bird} bird - The current state of the bird.
 * @returns {Bird} The updated bird object.
 */
export const updateBirdPhysics = (bird: Bird): Bird => {
  // Apply gravity to velocity, clamping at terminal velocity
  const newVelocity = Math.min(bird.velocity + PHYSICS.gravity, PHYSICS.terminalVelocity);
  // Update bird's Y position
  const newY = bird.y + newVelocity;
  // Calculate rotation based on velocity (tilts up when rising, down when falling)
  const rotation = Math.max(-30, Math.min(90, newVelocity * 3));

  return {
    ...bird,
    y: newY,
    velocity: newVelocity,
    rotation,
  };
};

export const birdJump = (bird: Bird): Bird => ({
  ...bird,
  velocity: PHYSICS.jumpVelocity,
  isFlapping: true, // Set isFlapping to true on jump
});

export const updatePipes = (pipes: Pipe[], birdX: number): { pipes: Pipe[]; scoreIncrease: number } => {
  let scoreIncrease = 0;
  
  const updatedPipes = pipes
    .map(pipe => {
      const newPipe = { ...pipe, x: pipe.x - PHYSICS.pipeSpeed }; // Move pipe to the left
      
      // Check if the bird has passed this pipe for scoring
      if (!pipe.passed && newPipe.x + newPipe.width < birdX) {
        newPipe.passed = true; // Mark pipe as passed
        scoreIncrease += 1; // Increment score
      }
      
      return newPipe;
    })
    // Filter out pipes that have moved completely off-screen to the left
    .filter(pipe => pipe.x + pipe.width > -50); // Keep pipes until they are well off-screen

  return { pipes: updatedPipes, scoreIncrease };
};

/**
 * Generates new pipes if enough time has passed since the last pipe was generated.
 *
 * @param {Pipe[]} pipes - The current array of pipe objects.
 * @param {number} currentTime - The current timestamp.
 * @param {number} lastPipeTime - The timestamp when the last pipe was generated.
 * @returns {Pipe[]} The updated array of pipe objects, potentially with a new pipe added.
 */
export const generatePipesIfNeeded = (pipes: Pipe[], currentTime: number, lastPipeTime: number): Pipe[] => {
  const pipeSpacing = 300; // Minimum horizontal distance between pipes
  
  // If enough time has passed, create a new pipe at the right edge of the screen
  if (currentTime - lastPipeTime > pipeSpacing) {
    return [...pipes, createPipe(GAME_DIMENSIONS.width)];
  }
  
  return pipes;
};
