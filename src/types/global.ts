/**
 * Global type definitions for the Gaming Portfolio.
 * Contains shared types used across multiple games and components to ensure consistency
 * and type safety throughout the application.
 */

/**
 * Defines the available game types in the portfolio.
 * @typedef {'tic-tac-toe' | '2048' | 'flappy-bird' | 'snake' | 'memory' | 'brick-breaker'} GameType
 */
export type GameType = 'tic-tac-toe' | '2048' | 'flappy-bird' | 'snake' | 'memory-game' | 'brick-breaker';

/**
 * Interface for game metadata used for displaying games in the portfolio.
 * @interface GameInfo
 * @property {GameType} id - A unique identifier for the game.
 * @property {string} name - The display name of the game.
 * @property {string} description - A brief description of the game.
 * @property {'Easy' | 'Medium' | 'Hard'} difficulty - The perceived difficulty level of the game.
 * @property {'Strategy' | 'Arcade' | 'Puzzle'} category - The genre or category of the game.
 * @property {string} icon - An emoji or character representing the game's icon.
 * @property {string} color - A CSS color string (e.g., HSL value) for thematic styling.
 * @property {'Ready to Play' | 'Coming Soon'} status - The current development status of the game.
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
 * Common game state statuses that can be used across different games.
 * @typedef {'idle' | 'playing' | 'paused' | 'won' | 'lost' | 'draw'} GameStatus
 */
export type GameStatus = 'idle' | 'playing' | 'paused' | 'won' | 'lost' | 'draw';

/**
 * Interface for recording a player's score.
 * @interface Score
 * @property {number} value - The numerical value of the score.
 * @property {Date} timestamp - The date and time when the score was achieved.
 * @property {GameType} gameType - The type of game the score belongs to.
 */
export interface Score {
  value: number;
  timestamp: Date;
  gameType: GameType;
}

/**
 * Interface for tracking general game statistics.
 * @interface GameStats
 * @property {number} gamesPlayed - Total number of games played.
 * @property {number} gamesWon - Total number of games won.
 * @property {number} gamesLost - Total number of games lost.
 * @property {number} [bestScore] - Optional: The highest/best score achieved across all games.
 * @property {number} totalTimePlayed - Total time spent playing games, in milliseconds.
 */
export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  bestScore?: number;
  totalTimePlayed: number;
}

/**
 * Interface for defining common physics constants used in games.
 * @interface GamePhysics
 * @property {number} gravity - The gravitational acceleration applied to game objects.
 * @property {number} jumpVelocity - The initial upward velocity applied during a jump.
 * @property {number} terminalVelocity - The maximum downward velocity an object can reach.
 * @property {number} pipeSpeed - The horizontal speed at which pipes move.
 * @property {number} pipeGap - The vertical gap size between top and bottom pipe segments.
 * @property {number} pipeWidth - The width of the pipe obstacles.
 */
export interface GamePhysics {
  gravity: number;
  jumpVelocity: number;
  terminalVelocity: number;
  pipeSpeed: number;
  pipeGap: number;
  pipeWidth: number;
}

/**
 * Interface for defining game dimensions and boundaries.
 * @interface GameDimensions
 * @property {number} width - The width of the game area/canvas.
 * @property {number} height - The height of the game area/canvas.
 * @property {number} groundHeight - The height of the ground element within the game area.
 * @property {number} birdSize - The size (width/height) of the bird character.
 */
export interface GameDimensions {
  width: number;
  height: number;
  groundHeight: number;
  birdSize: number;
}