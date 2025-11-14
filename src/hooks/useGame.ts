import { useState, useCallback } from 'react';
import { useHighScores } from './useHighScores';

/**
 * A custom React hook for managing common game state logic, including current score,
 * game over status, playing status, and integration with high scores.
 *
 * @param {string} gameId - The unique identifier for the game this hook instance is for.
 *                          This ID is used to store and retrieve high scores via `useHighScores`.
 *
 * @returns {object} An object containing:
 *   - {number} score - The current score of the game.
 *   - {function(number): void} setScore - Function to update the current score.
 *   - {number | null} highScore - The highest score recorded for this game, or null if none exists.
 *   - {function(number): void} setBestScore - Function to update the high score. Internally calls `updateHighScore`
 *     from `useHighScores` with a 'highest' strategy.
 *   - {boolean} isGameOver - True if the game is currently in a game over state.
 *   - {function(boolean): void} setIsGameOver - Function to set the game over status.
 *   - {boolean} isPlaying - True if the game is currently active and not paused.
 *   - {function(boolean): void} setIsPlaying - Function to set the playing status.
 *   - {boolean} gameStarted - True if the game has been started at least once.
 *   - {function(boolean): void} setGameStarted - Function to set the game started status.
 *   - {function(): void} resetGame - Function to reset the game to its initial state (score, game over, playing, started).
 */
export const useGame = (gameId: string) => {
  // State for the current score of the game
  const [score, setScore] = useState(0);
  // Integrate useHighScores to manage the persistent high score for this game
  const { highScore, updateHighScore } = useHighScores(gameId);
  // State to track if the game is over
  const [isGameOver, setIsGameOver] = useState(false);
  // State to track if the game is currently being played (not paused or idle)
  const [isPlaying, setIsPlaying] = useState(false);
  // State to track if the game has been started (useful for initial setup vs. restart)
  const [gameStarted, setGameStarted] = useState(false);

  /**
   * Updates the high score for the game.
   * This function is memoized using `useCallback`.
   *
   * @param {number} newScore - The new score to potentially set as the high score.
   * @returns {void}
   */
  const setBestScore = useCallback((newScore: number) => {
    // Calls the updateHighScore function from the useHighScores hook with a 'highest' strategy
    updateHighScore(newScore, 'highest');
  }, [updateHighScore]); // Dependency array ensures callback is stable unless updateHighScore changes

  /**
   * Resets all relevant game states to their initial values.
   * This function is memoized using `useCallback`.
   *
   * @returns {void}
   */
  const resetGame = useCallback(() => {
    setScore(0); // Reset current score
    setIsGameOver(false); // Reset game over status
    setIsPlaying(false); // Reset playing status
    setGameStarted(false); // Reset game started status
  }, []); // No dependencies, so this callback is stable

  // Return all state variables and functions for external use
  return {
    score,
    setScore,
    highScore,
    setBestScore, // This will now call updateHighScore from useHighScores
    isGameOver,
    setIsGameOver,
    isPlaying,
    setIsPlaying,
    gameStarted,
    setGameStarted,
    resetGame,
  };
};