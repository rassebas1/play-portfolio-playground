/**
 * Type definitions for Tic Tac Toe game
 * Contains all interfaces and types specific to the game logic
 */

/**
 * Player symbols in the game
 */
export type Player = 'X' | 'O';

/**
 * Cell state - can be empty (null) or contain a player symbol
 */
export type CellValue = Player | null;

/**
 * Game board represented as a 3x3 grid
 */
export type Board = CellValue[][];

/**
 * Possible game outcomes
 */
export type GameResult = 'win' | 'draw' | 'ongoing';

/**
 * Position on the game board
 */
export interface Position {
  row: number;
  col: number;
}

/**
 * Winning line information
 */
export interface WinningLine {
  positions: Position[];
  player: Player;
}

/**
 * Complete game state
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
 * Game statistics for Tic Tac Toe
 */
export interface TicTacToeStats {
  gamesPlayed: number;
  playerXWins: number;
  playerOWins: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
}