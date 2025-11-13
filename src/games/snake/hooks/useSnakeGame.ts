/**
 * src/games/snake/hooks/useSnakeGame.ts
 *
 * Custom React hook for managing the state and logic of the Snake game.
 * It integrates a reducer for complex state transitions, handles the game loop,
 * keyboard input for snake movement, and interacts with the high score system.
 */
import { useEffect, useReducer, useCallback } from 'react';
import { snakeGameReducer, initialSnakeGameState } from '../GameReducer';
import { Direction, GameAction } from '../types';
import { useHighScores } from '@/hooks/useHighScores';

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
  // useHighScores hook integrates persistent high score tracking for the 'snake' game
  const { highScore, updateHighScore } = useHighScores('snake');

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
  }, [state.gameStarted, state.gameOver, state.speed]); // Dependencies ensure effect re-runs when these states change

  // Effect to update the high score when the game ends.
  useEffect(() => {
    if (state.gameOver) {
      // If the game is over, update the high score using the 'highest' strategy
      updateHighScore(state.score, 'highest');
    }
  }, [state.gameOver, state.score, updateHighScore]); // Dependencies for game over, current score, and high score update function

  /**
   * Memoized callback for handling keyboard input to change the snake's direction.
   * Prevents direction changes if the game is not started or is over.
   *
   * @param {KeyboardEvent} event - The keyboard event object.
   * @returns {void}
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!state.gameStarted || state.gameOver) return; // Ignore input if game is not active

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
      event.preventDefault(); // Prevent default browser scroll behavior for arrow keys
      dispatch({ type: 'CHANGE_DIRECTION', payload: newDirection }); // Dispatch action to change direction
    }
  }, [state.gameStarted, state.gameOver]); // Dependencies for callback stability

  // Effect to add and remove the keyboard event listener.
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown); // Add listener on mount
    return () => {
      document.removeEventListener('keydown', handleKeyDown); // Remove listener on unmount
    };
  }, [handleKeyDown]); // Dependency on handleKeyDown ensures listener is updated if callback changes

  /**
   * Memoized callback to start the game.
   * @returns {void}
   */
  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' }); // Dispatch START_GAME action
  }, []); // No dependencies, stable callback

  /**
   * Memoized callback to reset the game.
   * @returns {void}
   */
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' }); // Dispatch RESET_GAME action
  }, []); // No dependencies, stable callback

  // Return the current game state, high score, and action functions
  return {
    state,
    highScore,
    startGame,
    resetGame,
    dispatch, // Expose dispatch for other actions if needed (e.g., from UI buttons)
  };
};
