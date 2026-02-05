
// src/games/memory-game/hooks/useMemoryGame.ts

import { useReducer, useEffect } from 'react';
import { gameReducer, initialState } from '../GameReducer';
import { Difficulty } from '../types';
import { useMemoryGameLogic } from './useMemoryGameLogic'; // Import the new logic hook
import { useHighScores } from '@/hooks/useHighScores'; // Import useHighScores

export const useMemoryGame = () => {
  // useReducer manages the complex state transitions of the game
  const [state, dispatch] = useReducer(gameReducer, initialState);
  // useHighScores hook integrates persistent high score (best time) tracking
  const { highScore, updateHighScore } = useHighScores('memory-game');

  // Integrate the new game logic hook
  useMemoryGameLogic({ state, dispatch });


  // Effect to update high score when game is won
  useEffect(() => {
    if (state.gameStatus === 'won') {
      updateHighScore(state.timer, 'lowest'); // Score is time, so lower is better
    }
  }, [state.gameStatus, state.timer, updateHighScore]);

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

  return { state, startGame, flipCard, resetGame, highScore };
};
