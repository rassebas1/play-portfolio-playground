/**
 * src/games/memory-game/GameReducer.ts
 *
 * Defines the reducer logic for the Memory Game, managing state transitions
 * based on various game actions. It also includes helper functions for game setup.
 */

import { GameState, Action, Difficulty, Card } from './types';
import { EMOJI_CARDS, DIFFICULTY_SETTINGS } from '../../utils/memory-game_const';

/**
 * Creates a shuffled array of cards for the memory game based on the chosen difficulty.
 * Each card value appears twice to form pairs.
 *
 * @param {Difficulty} difficulty - The difficulty level, which determines the number of card pairs.
 * @returns {Card[]} An array of shuffled Card objects.
 */
const createShuffledCards = (difficulty: Difficulty): Card[] => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  // Take a slice of emoji cards based on the number of pairs for the difficulty
  const cardValues = EMOJI_CARDS.slice(0, settings.pairs);
  // Duplicate card values to create pairs
  const gameCards = [...cardValues, ...cardValues];

  // Fisher-Yates shuffle algorithm to randomize card positions
  for (let i = gameCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
  }

  // Map shuffled values to Card objects with initial state
  return gameCards.map((value, index) => ({
    id: `card-${index}`, // Unique ID for each card
    value,              // The emoji or value of the card
    isFlipped: false,   // Initially not flipped
    isMatched: false,   // Initially not matched
  }));
};

/**
 * The initial state for the Memory Game.
 * @type {GameState}
 */
export const initialState: GameState = {
  cards: [],          // Array of card objects
  flippedCards: [],   // Array of indices of currently flipped cards (max 2)
  matchedPairs: 0,    // Count of successfully matched pairs
  moves: 0,           // Count of moves made (each pair of flips is one move)
  gameStatus: 'idle', // Current status of the game ('idle', 'playing', 'won')
  difficulty: Difficulty.Easy, // Current difficulty setting
  timer: 0,           // Game timer in seconds
};

/**
 * Reducer function for the Memory Game.
 * Manages state transitions based on dispatched actions.
 *
 * @param {GameState} state - The current state of the game.
 * @param {Action} action - The action to be performed.
 * @returns {GameState} The new state of the game.
 */
export const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    /**
     * Action: START_GAME
     * Initializes a new game with shuffled cards and sets the game status to 'playing'.
     * Payload: { difficulty: Difficulty }
     */
    case 'START_GAME':
      return {
        ...initialState, // Reset to initial state
        difficulty: action.payload.difficulty,
        cards: createShuffledCards(action.payload.difficulty), // Create new shuffled cards
        gameStatus: 'playing', // Set game status to playing
      };

    /**
     * Action: FLIP_CARD
     * Flips a card and updates the moves count. Prevents flipping more than two cards.
     * Payload: { index: number } - The index of the card to flip.
     */
    case 'FLIP_CARD':
      // If two cards are already flipped, prevent further flips until they are processed
      if (state.flippedCards.length === 2) return state;

      const newCards = [...state.cards];
      newCards[action.payload.index] = { ...newCards[action.payload.index], isFlipped: true };

      return {
        ...state,
        cards: newCards,
        flippedCards: [...state.flippedCards, action.payload.index], // Add flipped card index
        moves: state.moves + 1, // Increment moves count
      };

    /**
     * Action: CHECK_MATCH
     * Checks if the two currently flipped cards are a match. If they are, marks them as matched.
     * This action is typically dispatched after two cards have been flipped.
     */
    case 'CHECK_MATCH':
      // Ensure exactly two cards are flipped before checking for a match
      if (state.flippedCards.length !== 2) return state;

      const [firstIndex, secondIndex] = state.flippedCards;
      
      // If card values match, update their status to isMatched
      if (state.cards[firstIndex].value === state.cards[secondIndex].value) {
        const updatedCards = state.cards.map((card, index) => {
          if (index === firstIndex || index === secondIndex) {
            return { ...card, isMatched: true };
          }
          return card;
        });
        return {
          ...state,
          cards: updatedCards,
          matchedPairs: state.matchedPairs + 1, // Increment matched pairs count
          flippedCards: [], // Clear flipped cards array
        };
      } else {
        // If no match, the hook (useMemoryGame) will handle flipping them back after a delay.
        // So, for this action, we just return the current state.
        return state;
      }

    /**
     * Action: RESET_FLIPPED
     * Flips back any currently flipped cards that are not matched.
     * This is typically used when two flipped cards do not form a match.
     */
    case 'RESET_FLIPPED':
        const cardsAfterReset = state.cards.map((card, index) => {
            // Only flip back cards that were in the flippedCards array and are not matched
            if(state.flippedCards.includes(index) && !card.isMatched){
                return { ...card, isFlipped: false };
            }
            return card;
        });
        return {
            ...state,
            cards: cardsAfterReset,
            flippedCards: [], // Clear flipped cards array
        }

    /**
     * Action: GAME_WON
     * Sets the game status to 'won' when all pairs have been matched.
     */
    case 'GAME_WON':
      return {
        ...state,
        gameStatus: 'won',
      };

    /**
     * Action: RESET_GAME
     * Resets the entire game state to its initial configuration.
     */
    case 'RESET_GAME':
      return initialState;

    /**
     * Action: TICK
     * Increments the game timer by one second.
     */
    case 'TICK':
      return {
        ...state,
        timer: state.timer + 1,
      };

    /**
     * Default case: Returns the current state if the action type is not recognized.
     */
    default:
      return state;
  }
};
