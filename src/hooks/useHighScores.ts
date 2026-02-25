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
 *   - {number | null} highestTile - The highest tile value achieved (for games like 2048).
 *   - {function(tile: number): void} updateHighestTile - Function to update the highest tile.
 *   - {function(): void} resetHighScore - Function to reset all high scores.
 */
export const useHighScores = (gameId: string) => {
  const localStorageKey = `highScore_${gameId}`;
  const highestTileKey = `highestTile_${gameId}`;

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

  // Initialize highest tile state
  const [highestTile, setHighestTile] = useState<number | null>(() => {
    try {
      const storedTile = localStorage.getItem(highestTileKey);
      return storedTile ? JSON.parse(storedTile) : null;
    } catch (error) {
      console.error("Error reading highest tile from localStorage:", error);
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

  // Callback to update the highest tile
  const updateHighestTile = useCallback((newTile: number) => {
    setHighestTile((prevTile) => {
      // Only update if new tile is higher
      if (prevTile === null || newTile > prevTile) {
        try {
          localStorage.setItem(highestTileKey, JSON.stringify(newTile));
        } catch (error) {
          console.error("Error writing highest tile to localStorage:", error);
        }
        return newTile;
      }
      return prevTile;
    });
  }, [highestTileKey]);

  // Reset all high scores
  const resetHighScore = useCallback(() => {
    setHighScore(null);
    setHighestTile(null);
    try {
      localStorage.removeItem(localStorageKey);
      localStorage.removeItem(highestTileKey);
    } catch (error) {
      console.error("Error removing high scores from localStorage:", error);
    }
  }, [localStorageKey, highestTileKey]);

  return { highScore, updateHighScore, highestTile, updateHighestTile, resetHighScore };
};
