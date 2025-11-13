/**
 * src/games/tic-tac-toe/hooks/useTicTacToe.ts
 *
 * Custom React hook for managing the state and logic of the Tic Tac Toe game.
 * It handles the game board, player turns, win/draw conditions, and integrates
 * with the high score system to track the fewest moves to win.
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  TicTacToeState,
  Board,
  Player,
  CellValue,
  Position,
  WinningLine,
  GameResult
} from '../types';
import { useHighScores } from '@/hooks/useHighScores';

/**
 * Creates an empty 3x3 game board, initialized with null values.
 * @returns {Board} A 3x3 array representing the empty game board.
 */
const createEmptyBoard = (): Board =>
  Array(3).fill(null).map(() => Array(3).fill(null));

/**
 * The initial state for the Tic Tac Toe game.
 * @type {TicTacToeState}
 */
const initialState: TicTacToeState = {
  board: createEmptyBoard(), // The 3x3 game board
  currentPlayer: 'X',        // 'X' always starts
  gameResult: 'ongoing',     // Initial game status
  winner: null,              // No winner initially
  winningLine: null,         // No winning line initially
  moveCount: 0,              // Number of moves made
  gameStarted: false         // Game not started initially
};

/**
 * Custom hook for managing Tic Tac Toe game state and logic.
 *
 * @returns {object} An object containing:
 *   - {TicTacToeState} gameState - The current state of the Tic Tac Toe game.
 *   - {string} gameStatusMessage - A human-readable message describing the current game status.
 *   - {number | null} highScore - The fewest moves to win recorded for this game, or null if none exists.
 *   - {function(row: number, col: number): void} makeMove - Function to handle a player's move.
 *   - {function(): void} resetGame - Function to reset the game to its initial state.
 *   - {function(row: number, col: number): boolean} isCellInWinningLine - Checks if a cell is part of the winning line.
 *   - {function(row: number, col: number): CellValue} getCellValue - Gets the value of a cell at a specific position.
 */
export const useTicTacToe = () => {
  // State to hold the entire game state
  const [gameState, setGameState] = useState<TicTacToeState>(initialState);
  // useHighScores hook integrates persistent high score tracking for the 'tic-tac-toe' game
  // High score for Tic Tac Toe is the fewest moves to win, so we'll use the 'lowest' strategy.
  const { highScore, updateHighScore } = useHighScores('tic-tac-toe');

  /**
   * Checks if there's a winner on the board by iterating through all possible winning patterns.
   * This function is memoized using `useCallback`.
   *
   * @param {Board} board - The current game board.
   * @returns {WinningLine | null} The winning line information if a winner is found, otherwise null.
   */
  const checkWinner = useCallback((board: Board): WinningLine | null => {
    // All possible winning combinations (rows, columns, and diagonals)
    const winPatterns: Position[][] = [
      // Rows
      [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
      [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
      [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
      // Columns
      [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
      [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
      [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
      // Diagonals
      [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
      [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }]
    ];

    // Iterate through each winning pattern to see if it's met.
    for (const pattern of winPatterns) {
      const [pos1, pos2, pos3] = pattern;
      const cell1 = board[pos1.row][pos1.col];
      const cell2 = board[pos2.row][pos2.col];
      const cell3 = board[pos3.row][pos3.col];

      // Check if all three cells in the pattern are the same and not null.
      if (cell1 && cell1 === cell2 && cell2 === cell3) {
        return {
          positions: pattern,
          player: cell1 as Player // The player who made the winning move
        };
      }
    }

    return null; // No winner found
  }, []); // No dependencies, stable callback

  /**
   * Checks if the board is full, indicating a draw condition if no winner is found.
   * This function is memoized using `useCallback`.
   *
   * @param {Board} board - The current game board.
   * @returns {boolean} True if all cells on the board are filled, false otherwise.
   */
  const isBoardFull = useCallback((board: Board): boolean => {
    return board.every(row => row.every(cell => cell !== null));
  }, []); // No dependencies, stable callback

  /**
   * Handles a player's move at the specified row and column.
   * Updates the board, checks for a win or draw, and switches the current player.
   * This function is memoized using `useCallback`.
   *
   * @param {number} row - The row index of the cell where the move is made.
   * @param {number} col - The column index of the cell where the move is made.
   * @returns {void}
   */
  const makeMove = useCallback((row: number, col: number) => {
    setGameState(prevState => {
      // 1. Validate the move: ensure the game is ongoing and the selected cell is empty.
      if (prevState.gameResult !== 'ongoing' || prevState.board[row][col] !== null) {
        return prevState; // Invalid move, return current state
      }

      // 2. Create a new board with the current player's move.
      const newBoard = prevState.board.map((boardRow, r) =>
        boardRow.map((cell, c) => 
          r === row && c === col ? prevState.currentPlayer : cell // Place current player's mark
        )
      );

      // 3. Check for a winner or a draw.
      const winningLine = checkWinner(newBoard);
      let gameResult: GameResult = 'ongoing';
      if (winningLine) {
        gameResult = 'win'; // Game is won
      } else if (isBoardFull(newBoard)) {
        gameResult = 'draw'; // Game is a draw
      }

      // 4. Update the game state with the new board, next player, and game result.
      return {
        ...prevState,
        board: newBoard,
        currentPlayer: prevState.currentPlayer === 'X' ? 'O' : 'X', // Switch player
        gameResult,
        winner: winningLine?.player || null, // Set winner if applicable
        winningLine,
        moveCount: prevState.moveCount + 1, // Increment move count
        gameStarted: true // Mark game as started
      };
    });
  }, [checkWinner, isBoardFull]); // Dependencies for callback stability

  /**
   * Resets the game to its initial state.
   * This function is memoized using `useCallback`.
   * @returns {void}
   */
  const resetGame = useCallback(() => {
    setGameState(initialState); // Reset to the predefined initial state
  }, []); // No dependencies, stable callback

  // Effect to update the high score (fewest moves to win) when the game is won.
  useEffect(() => {
    if (gameState.gameResult === 'win') {
      // Update high score using the 'lowest' strategy (fewer moves are better)
      updateHighScore(gameState.moveCount, 'lowest');
    }
  }, [gameState.gameResult, gameState.moveCount, updateHighScore]); // Dependencies for high score update

  /**
   * Checks if a cell at a given position is part of the winning line.
   * This function is memoized using `useCallback`.
   *
   * @param {number} row - The row index of the cell.
   * @param {number} col - The column index of the cell.
   * @returns {boolean} True if the cell is part of the winning line, false otherwise.
   */
  const isCellInWinningLine = useCallback((row: number, col: number): boolean => {
    if (!gameState.winningLine) return false; // No winning line if game is not won
    
    // Check if the cell's position matches any position in the winning line
    return gameState.winningLine.positions.some(
      pos => pos.row === row && pos.col === col
    );
  }, [gameState.winningLine]); // Dependency on winningLine state

  /**
   * Gets the current value of a cell at the specified position on the board.
   * This function is memoized using `useCallback`.
   *
   * @param {number} row - The row index of the cell.
   * @param {number} col - The column index of the cell.
   * @returns {CellValue} The value of the cell ('X', 'O', or null).
   */
  const getCellValue = useCallback((row: number, col: number): CellValue => {
    return gameState.board[row][col];
  }, [gameState.board]); // Dependency on board state

  /**
   * Memoized game status message for display.
   * Updates only when relevant game state properties change.
   *
   * @returns {string} A descriptive message about the current game status.
   */
  const gameStatusMessage = useMemo(() => {
    if (gameState.gameResult === 'win') {
      return `Player ${gameState.winner} wins!`;
    }
    if (gameState.gameResult === 'draw') {
      return "It's a draw!";
    }
    if (!gameState.gameStarted) {
      return "Click any cell to start playing!";
    }
    return `Current player: ${gameState.currentPlayer}`;
  }, [gameState.gameResult, gameState.winner, gameState.currentPlayer, gameState.gameStarted]); // Dependencies for memoization

  // Return all relevant game state, high score, and control functions
  return {
    // State
    gameState,
    gameStatusMessage,
    highScore, // Expose the fewest moves to win
    
    // Actions
    makeMove,
    resetGame,
    
    // Utilities
    isCellInWinningLine,
    getCellValue
  };
};