import { useState, useEffect, useCallback } from 'react';

type ScoreStrategy = 'highest' | 'lowest';

/**
 * Custom React hook for managing high scores for a specific game.
 * Scores are persisted in localStorage.
 *
 * @param {string} gameId - A unique identifier for the game (e.g., 'brick-breaker', '2048').
 * @returns {object} An object containing:
 *   - {number | null} highScore - The current high score for the game, or null if no score is recorded.
 *   - {function(score: number, strategy?: ScoreStrategy): void} updateHighScore - Function to update the high score.
 */
export const useHighScores = (gameId: string) => {
  const localStorageKey = `highScore_${gameId}`;

  // Initialize state with the value from localStorage, or null if not found
  const [highScore, setHighScore] = useState<number | null>(() => {
    try {
      const storedScore = localStorage.getItem(localStorageKey);
      return storedScore ? JSON.parse(storedScore) : null;
    } catch (error) {
      console.error("Error reading high score from localStorage:", error);
      return null;
    }
  });

  // Callback to update the high score based on a given strategy
  const updateHighScore = useCallback((newScore: number, strategy: ScoreStrategy = 'highest') => {
    setHighScore((prevScore) => {
      let updatedScore = prevScore;

      if (prevScore === null) {
        updatedScore = newScore;
      } else if (strategy === 'highest' && newScore > prevScore) {
        updatedScore = newScore;
      } else if (strategy === 'lowest' && newScore < prevScore) {
        updatedScore = newScore;
      }

      // Persist the updated score to localStorage
      if (updatedScore !== prevScore) {
        try {
          localStorage.setItem(localStorageKey, JSON.stringify(updatedScore));
        } catch (error) {
          console.error("Error writing high score to localStorage:", error);
        }
      }
      return updatedScore;
    });
  }, [localStorageKey]);

  // Optionally, you might want to expose a way to reset the high score
  const resetHighScore = useCallback(() => {
    setHighScore(null);
    try {
      localStorage.removeItem(localStorageKey);
    } catch (error) {
      console.error("Error removing high score from localStorage:", error);
    }
  }, [localStorageKey]);

  return { highScore, updateHighScore, resetHighScore };
};
