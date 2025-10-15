import { useState, useCallback, useEffect } from 'react';
import type { Board, Direction, Game2048State, MoveResult } from '../types';

/**
 * Custom hook for 2048 game logic and state management
 * Handles board state, moves, scoring, and game conditions
 */
export const use2048 = () => {
  /**
   * Creates an empty 4x4 board
   */
  const createEmptyBoard = (): Board => {
    return Array(4).fill(null).map(() => Array(4).fill(0));
  };

  /**
   * Gets all empty positions on the board
   */
  const getEmptyPositions = (board: Board): Array<{ row: number; col: number }> => {
    const empty: Array<{ row: number; col: number }> = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === 0) {
          empty.push({ row, col });
        }
      }
    }
    return empty;
  };

  /**
   * Adds a random tile (2 or 4) to an empty position
   */
  const addRandomTile = (board: Board): Board => {
    const emptyPositions = getEmptyPositions(board);
    if (emptyPositions.length === 0) return board;

    const newBoard = board.map(row => [...row]);
    const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    const value = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2, 10% for 4
    
    newBoard[randomPosition.row][randomPosition.col] = value;
    return newBoard;
  };

  /**
   * Initializes the game board with two random tiles
   */
  const initializeBoard = (): Board => {
    let board = createEmptyBoard();
    board = addRandomTile(board);
    board = addRandomTile(board);
    return board;
  };

  // Game state
  const [gameState, setGameState] = useState<Game2048State>(() => ({
    board: initializeBoard(),
    score: 0,
    bestScore: parseInt(localStorage.getItem('2048-best-score') || '0'),
    isGameOver: false,
    isWon: false,
    canUndo: false,
    moveCount: 0,
  }));

  const [previousState, setPreviousState] = useState<Game2048State | null>(null);

  /**
   * Moves and merges tiles in a single row/column.
   * This function is the core of the game logic, handling the sliding and merging of tiles.
   */
  const moveAndMergeArray = (arr: number[]): { newArray: number[]; scoreGained: number } => {
    // 1. Filter out zeros to compact the array.
    const filtered = arr.filter(val => val !== 0);
    let scoreGained = 0;
    
    // 2. Merge adjacent equal tiles.
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2; // Double the value of the first tile.
        scoreGained += filtered[i]; // Add the merged value to the score.
        filtered[i + 1] = 0; // Mark the second tile for removal.
      }
    }
    
    // 3. Filter out zeros again after merging.
    const merged = filtered.filter(val => val !== 0);
    
    // 4. Pad with zeros to maintain the array length of 4.
    while (merged.length < 4) {
      merged.push(0);
    }
    
    return { newArray: merged, scoreGained };
  };

  /**
   * Processes a move in the specified direction by applying the moveAndMergeArray logic to each row or column.
   */
  const processMove = (board: Board, direction: Direction): MoveResult => {
    const newBoard = board.map(row => [...row]);
    let totalScore = 0;
    let moved = false;
    let hasWon = false;

    if (direction === 'left') {
      for (let row = 0; row < 4; row++) {
        const { newArray, scoreGained } = moveAndMergeArray(newBoard[row]);
        if (JSON.stringify(newArray) !== JSON.stringify(newBoard[row])) {
          moved = true;
        }
        newBoard[row] = newArray;
        totalScore += scoreGained;
        
        if (newArray.includes(2048)) {
          hasWon = true;
        }
      }
    } else if (direction === 'right') {
      for (let row = 0; row < 4; row++) {
        const reversed = [...newBoard[row]].reverse();
        const { newArray, scoreGained } = moveAndMergeArray(reversed);
        const finalArray = newArray.reverse();
        if (JSON.stringify(finalArray) !== JSON.stringify(newBoard[row])) {
          moved = true;
        }
        newBoard[row] = finalArray;
        totalScore += scoreGained;
        
        if (finalArray.includes(2048)) {
          hasWon = true;
        }
      }
    } else if (direction === 'up') {
      for (let col = 0; col < 4; col++) {
        const column = [newBoard[0][col], newBoard[1][col], newBoard[2][col], newBoard[3][col]];
        const { newArray, scoreGained } = moveAndMergeArray(column);
        const originalColumn = [board[0][col], board[1][col], board[2][col], board[3][col]];
        if (JSON.stringify(newArray) !== JSON.stringify(originalColumn)) {
          moved = true;
        }
        for (let row = 0; row < 4; row++) {
          newBoard[row][col] = newArray[row];
        }
        totalScore += scoreGained;
        
        if (newArray.includes(2048)) {
          hasWon = true;
        }
      }
    } else if (direction === 'down') {
      for (let col = 0; col < 4; col++) {
        const column = [newBoard[0][col], newBoard[1][col], newBoard[2][col], newBoard[3][col]];
        const reversed = [...column].reverse();
        const { newArray, scoreGained } = moveAndMergeArray(reversed);
        const finalArray = newArray.reverse();
        const originalColumn = [board[0][col], board[1][col], board[2][col], board[3][col]];
        if (JSON.stringify(finalArray) !== JSON.stringify(originalColumn)) {
          moved = true;
        }
        for (let row = 0; row < 4; row++) {
          newBoard[row][col] = finalArray[row];
        }
        totalScore += scoreGained;
        
        if (finalArray.includes(2048)) {
          hasWon = true;
        }
      }
    }

    return { board: newBoard, score: totalScore, moved, hasWon };
  };

  /**
   * Checks if any moves are possible on the board.
   * This is used to determine if the game is over.
   */
  const canMove = (board: Board): boolean => {
    // 1. Check for any empty cells. If there is at least one, a move is possible.
    if (getEmptyPositions(board).length > 0) return true;
    
    // 2. Check for possible merges by comparing adjacent cells.
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = board[row][col];
        // Check right neighbor
        if (col < 3 && current === board[row][col + 1]) return true;
        // Check bottom neighbor
        if (row < 3 && current === board[row + 1][col]) return true;
      }
    }
    
    // 3. If no empty cells and no possible merges, no move is possible.
    return false;
  };

  /**
   * Makes a move in the specified direction
   */
  const makeMove = useCallback((direction: Direction) => {
    if (gameState.isGameOver || gameState.isWon) return;

    const result = processMove(gameState.board, direction);
    
    if (!result.moved) return;

    // Save current state for undo
    setPreviousState({ ...gameState });

    // Add random tile to the new board
    const boardWithNewTile = addRandomTile(result.board);
    const newScore = gameState.score + result.score;
    const newBestScore = Math.max(gameState.bestScore, newScore);
    
    // Save best score to localStorage
    localStorage.setItem('2048-best-score', newBestScore.toString());
    
    const isGameOver = !canMove(boardWithNewTile);
    const hasWon = result.hasWon && !gameState.isWon;

    setGameState({
      board: boardWithNewTile,
      score: newScore,
      bestScore: newBestScore,
      isGameOver,
      isWon: hasWon || gameState.isWon,
      canUndo: true,
      moveCount: gameState.moveCount + 1,
    });
  }, [gameState]);

  /**
   * Restarts the game with a fresh state
   */
  const restartGame = useCallback(() => {
    setGameState({
      board: initializeBoard(),
      score: 0,
      bestScore: gameState.bestScore,
      isGameOver: false,
      isWon: false,
      canUndo: false,
      moveCount: 0,
    });
    setPreviousState(null);
  }, [gameState.bestScore]);

  /**
   * Undoes the last move
   */
  const undoMove = useCallback(() => {
    if (previousState && gameState.canUndo) {
      setGameState({
        ...previousState,
        canUndo: false,
      });
      setPreviousState(null);
    }
  }, [previousState, gameState.canUndo]);

  /**
   * Continues playing after winning (reaching 2048)
   */
  const continueGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isWon: false,
    }));
  }, []);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
          makeMove('up');
          break;
        case 'ArrowDown':
          makeMove('down');
          break;
        case 'ArrowLeft':
          makeMove('left');
          break;
        case 'ArrowRight':
          makeMove('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [makeMove]);

  return {
    gameState,
    makeMove,
    restartGame,
    undoMove,
    continueGame,
  };
};