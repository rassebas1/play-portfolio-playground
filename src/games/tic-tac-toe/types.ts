/**
 * Type definitions for Tic Tac Toe game.
 * Contains all interfaces and types specific to the game logic and state management.
 */

/**
 * Represents the player symbols in the game.
 * @typedef {'X' | 'O'} Player
 */
export type Player = 'X' | 'O';

/**
 * Represents the state of a single cell on the game board.
 * It can be empty (null) or contain a player's symbol ('X' or 'O').
 * @typedef {Player | null} CellValue
 */
export type CellValue = Player | null;

/**
 * Represents the 3x3 game board as a 2D array of `CellValue`.
 * @typedef {CellValue[][]} Board
 */
export type Board = CellValue[][];

/**
 * Defines the possible outcomes or states of the game.
 * @typedef {'win' | 'draw' | 'ongoing'} GameResult
 */
export type GameResult = 'win' | 'draw' | 'ongoing';

/**
 * AI Difficulty levels - exhaustive literal union for type safety.
 */
export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

/**
 * Game mode - Player vs Player or Player vs AI.
 */
export type GameMode = 'pvp' | 'pve';

/**
 * AI move result with metadata.
 */
export interface AIMoveResult {
  position: Position;
  algorithm: string;
}

/**
 * Difficulty metadata for UI rendering.
 */
export interface DifficultyInfo {
  id: Difficulty;
  labelKey: string;
  descriptionKey: string;
  algorithm: string;
}

/**
 * Exhaustive constant array of difficulties - enables IDE autocomplete and exhaustive checking.
 */
export const DIFFICULTIES: DifficultyInfo[] = [
  { id: 'beginner', labelKey: 'ai.difficulty.beginner', descriptionKey: 'ai.difficulty.beginner_desc', algorithm: 'random' },
  { id: 'easy', labelKey: 'ai.difficulty.easy', descriptionKey: 'ai.difficulty.easy_desc', algorithm: 'block-win' },
  { id: 'medium', labelKey: 'ai.difficulty.medium', descriptionKey: 'ai.difficulty.medium_desc', algorithm: 'minimax-3' },
  { id: 'hard', labelKey: 'ai.difficulty.hard', descriptionKey: 'ai.difficulty.hard_desc', algorithm: 'minimax-full' },
  { id: 'expert', labelKey: 'ai.difficulty.expert', descriptionKey: 'ai.difficulty.expert_desc', algorithm: 'minimax-mistake' },
];

/**
 * Type-safe lookup for difficulty info.
 */
export const getDifficultyInfo = (difficulty: Difficulty): DifficultyInfo => {
  return DIFFICULTIES.find(d => d.id === difficulty) ?? DIFFICULTIES[2];
};

/**
 * Represents a specific position on the game board.
 * @interface Position
 * @property {number} row - The row index of the position (0-2).
 * @property {number} col - The column index of the position (0-2).
 */
export interface Position {
  row: number;
  col: number;
}

/**
 * Provides information about a winning line on the board.
 * @interface WinningLine
 * @property {Position[]} positions - An array of `Position` objects that form the winning line.
 * @property {Player} player - The `Player` who achieved the winning line.
 */
export interface WinningLine {
  positions: Position[];
  player: Player;
}

/**
 * Represents the complete state of the Tic Tac Toe game at any given moment.
 * @interface TicTacToeState
 * @property {Board} board - The current state of the game board.
 * @property {Player} currentPlayer - The player whose turn it is.
 * @property {GameResult} gameResult - The current result or status of the game.
 * @property {Player | null} winner - The `Player` who won the game, or null if no winner yet/draw.
 * @property {WinningLine | null} winningLine - Information about the winning line, or null if no winner yet.
 * @property {number} moveCount - The total number of moves made in the current game.
 * @property {boolean} gameStarted - True if the game has been initiated, false if in initial idle state.
 */
export interface TicTacToeState {
  board: Board;
  currentPlayer: Player;
  gameResult: GameResult;
  winner: Player | null;
  winningLine: WinningLine | null;
  moveCount: number;
  gameStarted: boolean;
}

/**
 * Interface for game statistics (currently not fully implemented/used in the main game logic).
 * @interface TicTacToeStats
 * @property {number} gamesPlayed - Total number of games played.
 * @property {number} playerXWins - Number of wins for Player X.
 * @property {number} playerOWins - Number of wins for Player O.
 * @property {number} draws - Number of drawn games.
 * @property {number} currentStreak - Current winning streak.
 * @property {number} bestStreak - Best winning streak achieved.
 */
export interface TicTacToeStats {
  gamesPlayed: number;
  playerXWins: number;
  playerOWins: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
}