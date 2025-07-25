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
 * Custom hook for managing Tic Tac Toe game state and logic
 * Encapsulates all game rules, state management, and utility functions
 */
export const useTicTacToe = () => {
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

  const [gameState, setGameState] = useState<TicTacToeState>(initialState);

  /**
   * Checks if there's a winner on the board
   * Returns the winning line information if found
   */
  const checkWinner = useCallback((board: Board): WinningLine | null => {
    // All possible winning combinations
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

    for (const pattern of winPatterns) {
      const [pos1, pos2, pos3] = pattern;
      const cell1 = board[pos1.row][pos1.col];
      const cell2 = board[pos2.row][pos2.col];
      const cell3 = board[pos3.row][pos3.col];

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
   * Determines the current game result
   */
  const getGameResult = useCallback((board: Board, winningLine: WinningLine | null): GameResult => {
    if (winningLine) return 'win';
    if (isBoardFull(board)) return 'draw';
    return 'ongoing';
  }, [isBoardFull]);

  /**
   * Makes a move at the specified position
   */
  const makeMove = useCallback((row: number, col: number) => {
    setGameState(prevState => {
      // Validate move
      if (prevState.gameResult !== 'ongoing' || prevState.board[row][col] !== null) {
        return prevState;
      }

      // Create new board with the move
      const newBoard = prevState.board.map((boardRow, r) =>
        boardRow.map((cell, c) => 
          r === row && c === col ? prevState.currentPlayer : cell
        )
      );

      // Check for winner
      const winningLine = checkWinner(newBoard);
      const gameResult = getGameResult(newBoard, winningLine);

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
  }, [checkWinner, getGameResult]);

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