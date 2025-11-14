/**
 * src/utils/2048_const.ts
 *
 * Defines constants used throughout the 2048 game.
 * These constants help in configuring game board dimensions and animation timings.
 */

/**
 * The number of tiles in a single row or column of the 2048 game board.
 * The game board is typically a square grid, so this value applies to both dimensions.
 * @constant {number}
 */
export const TILE_COUNT_PER_ROW_OR_COLUMN = 4;

/**
 * The duration of tile animations (e.g., movement, merging, new tile appearance) in milliseconds.
 * This value is used to synchronize UI animations with game logic updates.
 * @constant {number}
 */
export const ANIMATION_DURATION = 200;