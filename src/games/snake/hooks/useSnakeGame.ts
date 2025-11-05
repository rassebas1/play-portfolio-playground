// src/games/snake/hooks/useSnakeGame.ts

import { useEffect, useReducer, useCallback } from 'react';
import { snakeGameReducer, initialSnakeGameState } from '../GameReducer';
import { Direction, GameAction } from '../types';

/**
 * Custom hook for managing the Snake game logic and state.
 * Integrates a reducer for state management, handles game loop, and keyboard input.
 */
export const useSnakeGame = () => {
  const [state, dispatch] = useReducer(snakeGameReducer, initialSnakeGameState);

  // Game loop effect
  useEffect(() => {
    if (!state.gameStarted || state.gameOver) return;

    const gameInterval = setInterval(() => {
      dispatch({ type: 'MOVE_SNAKE' });
    }, state.speed);

    return () => clearInterval(gameInterval);
  }, [state.gameStarted, state.gameOver, state.speed]);

  // Keyboard input handler for changing direction
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!state.gameStarted || state.gameOver) return;

    let newDirection: Direction | undefined;
    switch (event.key) {
      case 'ArrowUp':
        newDirection = 'UP';
        break;
      case 'ArrowDown':
        newDirection = 'DOWN';
        break;
      case 'ArrowLeft':
        newDirection = 'LEFT';
        break;
      case 'ArrowRight':
        newDirection = 'RIGHT';
        break;
    }

    if (newDirection) {
      event.preventDefault(); // Prevent default scroll behavior
      dispatch({ type: 'CHANGE_DIRECTION', payload: newDirection });
    }
  }, [state.gameStarted, state.gameOver]);

  // Add and remove keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Actions to expose
  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return {
    state,
    startGame,
    resetGame,
    dispatch, // Expose dispatch for other actions if needed (e.g., from UI buttons)
  };
};
