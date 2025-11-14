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