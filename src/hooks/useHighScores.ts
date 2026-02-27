import { useState, useEffect, useCallback, useRef } from 'react';
import { GameName, GameSession, createGameSession, ALLOWED_GAMES } from '@/types/highScores';

type ScoreStrategy = 'highest' | 'lowest';

const GAME_NAME_MAP: Record<string, GameName> = {
  'snake-game': 'snake',
  'snake': 'snake',
  '2048': '2048',
  'flappy-bird': 'flappy-bird',
  'flappy': 'flappy-bird',
  'brick-breaker': 'brick-breaker',
  'brickbreaker': 'brick-breaker',
  'memory-game': 'memory-game',
  'memory': 'memory-game',
};

/**
 * Custom React hook for managing high scores for a specific game.
 * Scores are persisted in localStorage and optionally submitted to server.
 *
 * @param {string} gameId - A unique identifier for the game (e.g., 'brick-breaker', '2048').
 * @param {boolean} enableServerSync - Whether to enable server-side score submission (default: true).
 * @returns {object} An object containing:
 *   - {number | null} highScore - The current high score for the game, or null if no score is recorded.
 *   - {function(score: number, strategy?: ScoreStrategy): void} updateHighScore - Function to update the high score.
 *   - {number | null} highestTile - The highest tile value achieved (for games like 2048).
 *   - {function(tile: number): void} updateHighestTile - Function to update the highest tile.
 *   - {function(): void} resetHighScore - Function to reset all high scores.
 *   - {GameSession | null} session - Current game session for server submission.
 *   - {function(): void} startSession - Function to start a new game session.
 *   - {function(): void} recordMove - Function to record a move in the session.
 *   - {function(): Promise<boolean>} submitScore - Function to submit score to server.
 *   - {function(): void} endSession - Function to end the current session.
 */
export const useHighScores = (gameId: string, enableServerSync: boolean = true) => {
  const localStorageKey = `highScore_${gameId}`;
  const highestTileKey = `highestTile_${gameId}`;
  
  const sessionRef = useRef<GameSession | null>(null);
  const gameNameRef = useRef<GameName | null>(null);

  useEffect(() => {
    const mappedName = GAME_NAME_MAP[gameId];
    if (mappedName && ALLOWED_GAMES.includes(mappedName)) {
      gameNameRef.current = mappedName;
    }
  }, [gameId]);

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

  // Session management functions
  const startSession = useCallback(() => {
    if (gameNameRef.current) {
      sessionRef.current = createGameSession(gameNameRef.current);
    }
  }, []);

  const recordMove = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current = {
        ...sessionRef.current,
        moves: sessionRef.current.moves + 1
      };
    }
  }, []);

  const endSession = useCallback(() => {
    sessionRef.current = null;
  }, []);

  const submitScore = useCallback(async (score: number): Promise<boolean> => {
    if (!enableServerSync || !sessionRef.current || !gameNameRef.current) {
      return false;
    }

    const session = sessionRef.current;
    const sessionDuration = Date.now() - session.startTime;

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: gameNameRef.current,
          username: 'UNK', // Will be set by UI
          score,
          sessionId: session.id,
          sessionDuration,
          moves: session.moves
        })
      });

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Failed to submit score to server:', error);
      return false;
    }
  }, [enableServerSync]);

  return { 
    highScore, 
    updateHighScore, 
    highestTile, 
    updateHighestTile, 
    resetHighScore,
    session: sessionRef.current,
    startSession,
    recordMove,
    submitScore,
    endSession
  };
};
