// src/games/snake/hooks/useSnakeGame.ts

import { useEffect, useReducer, useCallback } from 'react';
import { snakeGameReducer, initialSnakeGameState } from '../GameReducer';
import { Direction, GameAction, Difficulty } from '../types';
import { useSnakeInput } from './useSnakeInput';
import { useHighScores } from '@/hooks/useHighScores'; // Import useHighScores

/**
 * Custom hook for managing the Snake game logic and state.
 * Integrates a reducer for state management, handles game loop, and keyboard input.
 */
export const useSnakeGame = () => {
  const [state, dispatch] = useReducer(snakeGameReducer, initialSnakeGameState);
  const { highScore, updateHighScore } = useHighScores('snake-game'); // Initialize useHighScores

  // Integrate the new input hook
  useSnakeInput({ dispatch, gameStarted: state.gameStarted, gameOver: state.gameOver });

  // Game loop effect
  useEffect(() => {
    if (!state.gameStarted || state.gameOver) return;

    const gameInterval = setInterval(() => {
      dispatch({ type: 'MOVE_SNAKE' });
    }, state.speed);

    return () => clearInterval(gameInterval);
  }, [state.gameStarted, state.gameOver, state.speed, dispatch]);

  // Effect to update high score when game is over
  useEffect(() => {
    if (state.gameOver && state.score > 0) { // Only update if game is over and score is positive
      updateHighScore(state.score, 'highest');
    }
  }, [state.gameOver, state.score, updateHighScore]);

  // Actions to expose
  const startGame = useCallback((difficulty?: Difficulty) => {
    dispatch({ type: 'START_GAME', payload: { difficulty } });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
  }, []);

  return {
    state,
    startGame,
    resetGame,
    setDifficulty,
    highScore, // Expose highScore
    dispatch,
  };
};
