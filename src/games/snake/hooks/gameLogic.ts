// src/games/snake/hooks/gameLogic.ts

// This file can contain pure helper functions for game mechanics
// For example, functions to calculate next position, check collisions, etc.
// Currently, much of this logic is embedded in the reducer for simplicity.
// As the game grows, more complex logic can be extracted here.

// Example: Function to get a random coordinate on the board
import { Coordinate } from '@/games/snake/types';
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/games/snake/constants';

export const getRandomBoardCoordinate = (): Coordinate => {
  return {
    x: Math.floor(Math.random() * BOARD_WIDTH),
    y: Math.floor(Math.random() * BOARD_HEIGHT),
  };
};