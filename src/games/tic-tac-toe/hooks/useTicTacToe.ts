import { useState, useCallback, useMemo } from 'react';
import type {
  TicTacToeState,
  Board,
  Player,
  CellValue,
  Position,
  WinningLine,
  GameResult
} from '../types';

/**
 * Creates an empty 3x3 game board
 */
const createEmptyBoard = (): Board =>
  Array(3).fill(null).map(() => Array(3).fill(null));

/**
 * Initial game state
 */
const initialState: TicTacToeState = {
  board: createEmptyBoard(),
  currentPlayer: 'X',
  gameResult: 'ongoing',
  winner: null,
  winningLine: null,
  moveCount: 0,
  gameStarted: false
};

/**
 * Custom hook for managing Tic Tac Toe game state and logic
 * Encapsulates all game rules, state management, and utility functions
 */
export const useTicTacToe = () => {
  const [gameState, setGameState] = useState<TicTacToeState>(initialState);
  /**
   * Checks if there's a winner on the board by iterating through all possible winning patterns.
   * Returns the winning line information if a winner is found, otherwise returns null.
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
          player: cell1 as Player
        };
      }
    }

    return null;
  }, []);

  /**
   * Checks if the board is full (draw condition)
   */
  const isBoardFull = useCallback((board: Board): boolean => {
    return board.every(row => row.every(cell => cell !== null));
  }, []);

    /**
   * Handles a player's move at the specified row and column.
   * Updates the board, checks for a win or draw, and switches the current player.
   */
  const makeMove = useCallback((row: number, col: number) => {
    setGameState(prevState => {
      // 1. Validate the move: ensure the game is ongoing and the cell is empty.
      if (prevState.gameResult !== 'ongoing' || prevState.board[row][col] !== null) {
        return prevState;
      }

      // 2. Create a new board with the current player's move.
      const newBoard = prevState.board.map((boardRow, r) =>
        boardRow.map((cell, c) => 
          r === row && c === col ? prevState.currentPlayer : cell
        )
      );

      // 3. Check for a winner or a draw.
      const winningLine = checkWinner(newBoard);
      let gameResult: GameResult = 'ongoing';
      if (winningLine) {
        gameResult = 'win';
      } else if (isBoardFull(newBoard)) {
        gameResult = 'draw';
      }

      // 4. Update the game state.
      return {
        ...prevState,
        board: newBoard,
        currentPlayer: prevState.currentPlayer === 'X' ? 'O' : 'X',
        gameResult,
        winner: winningLine?.player || null,
        winningLine,
        moveCount: prevState.moveCount + 1,
        gameStarted: true
      };
    });
  }, [checkWinner, isBoardFull]);

  /**
   * Resets the game to initial state
   */
  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  /**
   * Checks if a cell is part of the winning line
   */
  const isCellInWinningLine = useCallback((row: number, col: number): boolean => {
    if (!gameState.winningLine) return false;
    
    return gameState.winningLine.positions.some(
      pos => pos.row === row && pos.col === col
    );
  }, [gameState.winningLine]);

  /**
   * Gets the current cell value at specified position
   */
  const getCellValue = useCallback((row: number, col: number): CellValue => {
    return gameState.board[row][col];
  }, [gameState.board]);

  /**
   * Memoized game status message
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
  }, [gameState.gameResult, gameState.winner, gameState.currentPlayer, gameState.gameStarted]);

  return {
    // State
    gameState,
    gameStatusMessage,
    
    // Actions
    makeMove,
    resetGame,
    
    // Utilities
    isCellInWinningLine,
    getCellValue
  };
};