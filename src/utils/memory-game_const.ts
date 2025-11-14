/**
 * src/utils/memory-game_const.ts
 *
 * Defines constants used throughout the Memory Game.
 * This includes the set of possible card values (emojis) and
 * configuration settings for different difficulty levels.
 */

/**
 * An array of emoji characters used as values for the memory game cards.
 * Each emoji will appear twice on the board to form a pair.
 * @constant {string[]}
 */
export const EMOJI_CARDS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
  '😊', '😇', '😉', '😍', '🥰', '😘', '😗', '😙',
];

/**
 * Defines the settings for different difficulty levels in the Memory Game.
 * Each level specifies the grid dimensions (rows, cols) and the number of card pairs.
 * @constant {object}
 * @property {object} Easy - Settings for the Easy difficulty.
 * @property {number} Easy.rows - Number of rows for Easy difficulty.
 * @property {number} Easy.cols - Number of columns for Easy difficulty.
 * @property {number} Easy.pairs - Number of card pairs for Easy difficulty.
 * @property {object} Medium - Settings for the Medium difficulty.
 * @property {number} Medium.rows - Number of rows for Medium difficulty.
 * @property {number} Medium.cols - Number of columns for Medium difficulty.
 * @property {number} Medium.pairs - Number of card pairs for Medium difficulty.
 * @property {object} Hard - Settings for the Hard difficulty.
 * @property {number} Hard.rows - Number of rows for Hard difficulty.
 * @property {number} Hard.cols - Number of columns for Hard difficulty.
 * @property {number} Hard.pairs - Number of card pairs for Hard difficulty.
 */
export const DIFFICULTY_SETTINGS = {
  Easy: {
    rows: 3,
    cols: 4,
    pairs: 6, // 12 cards total
  },
  Medium: {
    rows: 4,
    cols: 4,
    pairs: 8, // 16 cards total
  },
  Hard: {
    rows: 4,
    cols: 6,
    pairs: 12, // 24 cards total
  },
};
