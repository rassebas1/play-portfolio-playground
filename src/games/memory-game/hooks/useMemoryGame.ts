/**
 * src/games/memory-game/hooks/useMemoryGame.ts
 *
 * Custom React hook for managing the state and logic of the Memory Game.
 * It integrates a reducer for complex state transitions, handles game-specific
 * effects like the timer and card matching, and interacts with the high score system.
 */
import { useReducer, useEffect } from 'react';
import { gameReducer, initialState } from '../GameReducer';
import { Difficulty } from '../types';
import { useHighScores } from '@/hooks/useHighScores';

/**
 * Manages the core logic and state for the Memory Game.
 *
 * @returns {object} An object containing:
 *   - {GameState} state - The current state of the Memory Game (cards, flipped cards, matched pairs, moves, game status, timer, difficulty).
 *   - {number | null} highScore - The best time recorded for the Memory Game, or null if none exists.
 *   - {function(difficulty: Difficulty): void} startGame - Initiates a new game with a specified difficulty.
 *   - {function(index: number): void} flipCard - Handles flipping a card at a given index.
 *   - {function(): void} resetGame - Resets the game to its initial idle state.
 */
export const useMemoryGame = () => {
  // useReducer manages the complex state transitions of the game
  const [state, dispatch] = useReducer(gameReducer, initialState);
  // useHighScores hook integrates persistent high score (best time) tracking
  const { highScore, updateHighScore } = useHighScores('memory-game');

  // Effect for the game timer: increments the timer every second when the game is playing.
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (state.gameStatus === 'playing') {
      timerInterval = setInterval(() => {
        dispatch({ type: 'TICK' }); // Dispatch TICK action to increment timer in reducer
      }, 1000);
    }
    // Cleanup function: clears the interval when the component unmounts or gameStatus changes
    return () => clearInterval(timerInterval);
  }, [state.gameStatus]); // Dependency on gameStatus ensures timer starts/stops correctly

  // Effect for handling card matching logic after two cards are flipped.
  useEffect(() => {
    if (state.flippedCards.length === 2) {
      const [firstIndex, secondIndex] = state.flippedCards;
      // Check if the values of the two flipped cards match
      if (state.cards[firstIndex].value === state.cards[secondIndex].value) {
        dispatch({ type: 'CHECK_MATCH' }); // Dispatch CHECK_MATCH if they match
      } else {
        // If no match, reset flipped cards after a delay
        setTimeout(() => {
          dispatch({ type: 'RESET_FLIPPED' });
        }, 1000);
      }
    }
  }, [state.flippedCards, state.cards]); // Dependencies on flippedCards and cards state

  // Effect for checking game win condition and updating high score.
  useEffect(() => {
    // Game is won if all cards are matched and game is currently playing
    if (state.gameStatus === 'playing' && state.cards.length > 0 && state.matchedPairs === state.cards.length / 2) {
      dispatch({ type: 'GAME_WON' }); // Dispatch GAME_WON action
      // Update high score (best time) using the 'lowest' strategy
      updateHighScore(state.timer, 'lowest');
    }
  }, [state.matchedPairs, state.cards.length, state.gameStatus, state.timer, updateHighScore]); // Dependencies for win condition and high score update

  /**
   * Dispatches the START_GAME action to initialize a new game.
   * @param {Difficulty} difficulty - The chosen difficulty level for the new game.
   * @returns {void}
   */
  const startGame = (difficulty: Difficulty) => {
    dispatch({ type: 'START_GAME', payload: { difficulty } });
  };

  /**
   * Dispatches the FLIP_CARD action to flip a card.
   * Cards can only be flipped if less than two are currently flipped and the game is playing.
   * @param {number} index - The index of the card to flip.
   * @returns {void}
   */
  const flipCard = (index: number) => {
    if (state.flippedCards.length < 2 && !state.cards[index].isFlipped && state.gameStatus === 'playing') {
      dispatch({ type: 'FLIP_CARD', payload: { index } });
    }
  };

  /**
   * Dispatches the RESET_GAME action to reset the game state.
   * @returns {void}
   */
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  // Returns the current game state, high score, and action functions
  return { state, highScore, startGame, flipCard, resetGame };
};
