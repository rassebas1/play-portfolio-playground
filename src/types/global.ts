/**
 * Global type definitions for the Gaming Portfolio
 * Contains shared types used across multiple games and components
 */

/**
 * Available games in the portfolio
 */
export type GameType = 'tic-tac-toe' | '2048' | 'flappy-bird' | 'snake' | 'memory';

/**
 * Game metadata for portfolio display
 */
export interface GameInfo {
  id: GameType;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Strategy' | 'Arcade' | 'Puzzle';
  icon: string;
  color: string;
  status: 'Ready to Play' | 'Coming Soon';
}

/**
 * Common game state statuses
 */
export type GameStatus = 'idle' | 'playing' | 'paused' | 'won' | 'lost' | 'draw';

/**
 * Player score interface
 */
export interface Score {
  value: number;
  timestamp: Date;
  gameType: GameType;
}

/**
 * Game statistics tracking
 */
export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  bestScore?: number;
  totalTimePlayed: number; // in milliseconds
}