import type { GamePhysics, GameDimensions } from '@/types/global';

export const GAME_DIMENSIONS: GameDimensions = {
  width: 400,
  height: 600,
  groundHeight: 80,
  birdSize: 40, // Increased birdSize
};

export const PHYSICS: GamePhysics = {
  gravity: 0.6,
  jumpVelocity: -10,
  terminalVelocity: 15,
  pipeSpeed: 3,
  pipeGap: 250,
  pipeWidth: 50,
};
