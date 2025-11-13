/**
 * src/games/memory-game/types.ts
 *
 * Defines the TypeScript types and interfaces used throughout the Memory Game.
 * This includes structures for cards, game difficulty, the overall game state,
 * and the actions that can be dispatched to the game reducer.
 */

/**
 * Represents a single card in the Memory Game.
 * @interface Card
 * @property {string} id - A unique identifier for the card.
 * @property {string} value - The value displayed on the card (e.g., an emoji, character, or image source).
 * @property {boolean} isFlipped - True if the card is currently face-up, false otherwise.
 * @property {boolean} isMatched - True if the card has been successfully matched with another card, false otherwise.
 */
export interface Card {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

/**
 * Defines the possible difficulty levels for the Memory Game.
 * Each difficulty level corresponds to a different board size.
 * @enum {string}
 */
export enum Difficulty {
  Easy = 'Easy',     // Typically a smaller board, e.g., 4x3 grid.
  Medium = 'Medium', // A medium-sized board, e.g., 4x4 grid.
  Hard = 'Hard',     // A larger board, e.g., 6x4 grid.
}

/**
 * Represents the entire state of the Memory Game at any given moment.
 * @interface GameState
 * @property {Card[]} cards - An array of all cards currently on the board.
 * @property {number[]} flippedCards - An array containing the indices of the cards that are currently flipped (face-up).
 *                                     Typically holds 0, 1, or 2 indices.
 * @property {number} matchedPairs - The count of successfully matched pairs of cards.
 * @property {number} moves - The total number of moves (card flips) made by the player.
 * @property {'idle' | 'playing' | 'won'} gameStatus - The current status of the game.
 *                                                     - 'idle': Game is waiting to start or has just been reset.
 *                                                     - 'playing': Game is actively being played.
 *                                                     - 'won': All pairs have been matched, and the game is over.
 * @property {Difficulty} difficulty - The current difficulty setting of the game.
 * @property {number} timer - The elapsed time in seconds since the game started.
 */
export interface GameState {
  cards: Card[];
  flippedCards: number[];
  matchedPairs: number;
  moves: number;
  gameStatus: 'idle' | 'playing' | 'won';
  difficulty: Difficulty;
  timer: number;
}

/**
 * Defines the types of actions that can be dispatched to the Memory Game reducer.
 * @typedef {object} Action
 * @property {'START_GAME'} type - Action to start a new game.
 * @property {object} payload - Contains the difficulty for the new game.
 *
 * @property {'FLIP_CARD'} type - Action to flip a card.
 * @property {object} payload - Contains the index of the card to flip.
 *
 * @property {'CHECK_MATCH'} type - Action to check if two flipped cards are a match.
 *
 * @property {'RESET_FLIPPED'} type - Action to flip back cards that did not match.
 *
 * @property {'GAME_WON'} type - Action to set the game status to 'won'.
 *
 * @property {'RESET_GAME'} type - Action to reset the game to its initial state.
 *
 * @property {'TICK'} type - Action to increment the game timer.
 */
export type Action =
  | { type: 'START_GAME'; payload: { difficulty: Difficulty } }
  | { type: 'FLIP_CARD'; payload: { index: number } }
  | { type: 'CHECK_MATCH' }
  | { type: 'RESET_FLIPPED' }
  | { type: 'GAME_WON' }
  | { type: 'RESET_GAME' }
  | { type: 'TICK' };
