import { useState, useCallback, useEffect } from 'react';
import type { Board, Direction, Game2048State, MoveResult } from '../types';
import {
  createEmptyBoard,
  getEmptyPositions,
  addRandomTile,
  initializeBoard,
  moveAndMergeArray,
  processMove,
  canMove,
} from '../gameLogic';

/**
 * Custom hook for 2048 game logic and state management
 * Handles board state, moves, scoring, and game conditions
 */
export const use2048 = () => {
  // Game state
  const [gameState, setGameState] = useState<Game2048State>(() => ({
    board: initializeBoard(),
    score: 0,
    bestScore: parseInt(localStorage.getItem('2048-best-score') || '0'),
    isGameOver: false,
    isWon: false,
    canUndo: false,
    moveCount: 0,
    animations: [],
  }));

  const [previousState, setPreviousState] = useState<Game2048State | null>(null);

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
      animations: result.animations,
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
      animations: [],
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
      animations: [],
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