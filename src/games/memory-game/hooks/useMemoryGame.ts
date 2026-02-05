
// src/games/memory-game/hooks/useMemoryGame.ts

import { useReducer, useEffect } from 'react';
import { gameReducer, initialState } from '../GameReducer';
import { Difficulty } from '../types';
import { useMemoryGameLogic } from './useMemoryGameLogic'; // Import the new logic hook
import { useHighScores } from '@/hooks/useHighScores'; // Import useHighScores

export const useMemoryGame = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Integrate the new game logic hook
  useMemoryGameLogic({ state, dispatch });

  // Integrate high score tracking
  const { highScore, updateHighScore } = useHighScores('memory-game');

  // Effect to update high score when game is won
  useEffect(() => {
    if (state.gameStatus === 'won') {
      updateHighScore(state.timer, 'lowest'); // Score is time, so lower is better
    }
  }, [state.gameStatus, state.timer, updateHighScore]);

  const startGame = (difficulty: Difficulty) => {
    dispatch({ type: 'START_GAME', payload: { difficulty } });
  };

  const flipCard = (index: number) => {
    if (state.flippedCards.length < 2 && !state.cards[index].isFlipped && state.gameStatus === 'playing') {
      dispatch({ type: 'FLIP_CARD', payload: { index } });
    }
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return { state, startGame, flipCard, resetGame, highScore };
};
