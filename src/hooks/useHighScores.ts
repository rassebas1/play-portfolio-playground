import { useState, useEffect, useCallback } from 'react';

/**
 * Defines the strategy for updating a high score.
 * - 'highest': A new score is better if it's greater than the current high score.
 * - 'lowest': A new score is better if it's less than the current high score.
 */
type ScoreStrategy = 'highest' | 'lowest';

/**
 * Retrieves all high scores from the browser's local storage.
 * High scores are stored as a JSON string mapping game IDs to their respective scores.
 *
 * @returns {Record<string, number>} An object where keys are game IDs and values are their high scores.
 *                                   Returns an empty object if no scores are found or an error occurs.
 */
const getHighScores = (): Record<string, number> => {
  try {
    const scores = localStorage.getItem('highScores');
    return scores ? JSON.parse(scores) : {};
  } catch (error) {
    console.error('Error reading high scores from local storage:', error);
    return {};
  }
};

/**
 * Saves a specific game's high score to local storage.
 * This function updates the overall high scores object in local storage.
 *
 * @param {string} gameId - The unique identifier for the game.
 * @param {number} score - The new high score to save for the given game.
 * @returns {void}
 */
const setHighScoreForGame = (gameId: string, score: number) => {
  try {
    const scores = getHighScores();
    scores[gameId] = score;
    localStorage.setItem('highScores', JSON.stringify(scores));
  } catch (error) {
    console.error('Error saving high score to local storage:', error);
  }
};

/**
 * A custom React hook for managing and persisting high scores for individual games
 * using the browser's local storage.
 *
 * @param {string} gameId - The unique identifier for the game this hook instance is for.
 *
 * @returns {object} An object containing:
 *   - {number | null} highScore - The current high score for the specified game, or null if none exists.
 *   - {function(newScore: number, strategy?: ScoreStrategy): boolean} updateHighScore - A function to
 *     update the high score. It takes the new score and an optional strategy ('highest' or 'lowest').
 *     Returns `true` if a new high score was set, `false` otherwise.
 */
export const useHighScores = (gameId: string) => {
  // State to hold the high score for the current game
  const [highScore, setHighScore] = useState<number | null>(null);

  // Effect to load the high score from local storage when the component mounts or gameId changes.
  useEffect(() => {
    const scores = getHighScores();
    if (scores[gameId] !== undefined) {
      setHighScore(scores[gameId]);
    }
  }, [gameId]); // Re-run if gameId changes

  /**
   * Updates the high score for the current game based on the provided new score and strategy.
   *
   * @param {number} newScore - The score to compare against the current high score.
   * @param {ScoreStrategy} [strategy='highest'] - The strategy to determine if `newScore` is better.
   *                                               'highest' means a larger number is better.
   *                                               'lowest' means a smaller number is better.
   * @returns {boolean} True if the high score was updated, false otherwise.
   */
  const updateHighScore = useCallback(
    (newScore: number, strategy: ScoreStrategy = 'highest') => {
      const scores = getHighScores();
      const currentHighScore = scores[gameId];

      let shouldUpdate = false;

      // Determine if the new score should replace the current high score
      if (currentHighScore === undefined) {
        // If no high score exists, any new score is a high score
        shouldUpdate = true;
      } else if (strategy === 'highest' && newScore > currentHighScore) {
        // For 'highest' strategy, update if new score is greater
        shouldUpdate = true;
      } else if (strategy === 'lowest' && newScore < currentHighScore) {
        // For 'lowest' strategy, update if new score is smaller
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        setHighScoreForGame(gameId, newScore); // Persist to local storage
        setHighScore(newScore); // Update React state
        return true; // Indicate that a new high score was set
      }
      
      return false; // No new high score was set
    },
    [gameId] // Recreate this callback if gameId changes
  );

  // Return the current high score and the update function
  return { highScore, updateHighScore };
};