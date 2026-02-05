/**
 * src/games/snake/hooks/useSnakeGame.ts
 *
 * Custom React hook for managing the state and logic of the Snake game.
 * It integrates a reducer for complex state transitions, handles the game loop,
 * keyboard input for snake movement, and interacts with the high score system.
 */
import { useEffect, useReducer, useCallback } from 'react';
import { snakeGameReducer, initialSnakeGameState } from '../GameReducer';
import { Direction, GameAction, Difficulty } from '../types';
import { useSnakeInput } from './useSnakeInput';
import { useHighScores } from '@/hooks/useHighScores'; // Import useHighScores

/**
 * Custom hook for managing the Snake game logic and state.
 *
 * @returns {object} An object containing:
 *   - {SnakeGameState} state - The current state of the Snake game (snake position, food, score, game over status, etc.).
 *   - {number | null} highScore - The highest score recorded for the Snake game, or null if none exists.
 *   - {function(): void} startGame - Initiates the game.
 *   - {function(): void} resetGame - Resets the game to its initial state.
 *   - {function(action: GameAction): void} dispatch - The dispatch function from the reducer, allowing external components to send actions.
 */
export const useSnakeGame = () => {
  // useReducer manages the complex state transitions of the game
  const [state, dispatch] = useReducer(snakeGameReducer, initialSnakeGameState);
  const { highScore, updateHighScore } = useHighScores('snake-game'); // Initialize useHighScores

  // Integrate the new input hook
  useSnakeInput({ dispatch, gameStarted: state.gameStarted, gameOver: state.gameOver });

  // Effect for the main game loop: moves the snake at a set interval when the game is playing.
  useEffect(() => {
    let gameInterval: NodeJS.Timeout;
    if (!state.gameStarted || state.gameOver) {
      // If game is not started or is over, clear any existing interval and do nothing
      return;
    }

    // Set up an interval to dispatch the 'MOVE_SNAKE' action
    gameInterval = setInterval(() => {
      dispatch({ type: 'MOVE_SNAKE' });
    }, state.speed); // Game speed determines the interval duration

    // Cleanup function: clears the interval when the component unmounts or dependencies change
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

  /**
   * Memoized callback to reset the game.
   * @returns {void}
   */
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
  }, []);

  // Return the current game state, high score, and action functions
  return {
    state,
    highScore,
    startGame,
    resetGame,
    setDifficulty,
    highScore, // Expose highScore
    dispatch,
  };
};
