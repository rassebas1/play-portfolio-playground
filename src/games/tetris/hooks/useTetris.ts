/**
 * Tetris Game Hook
 * Main hook that integrates the game logic with React state
 */

import { useReducer, useEffect, useCallback, useRef } from 'react';
import { TetrisState, TetrisAction } from '../types';
import { tetrisReducer, createInitialState } from '../GameReducer';
import { useTetrisInput, useTetrisSwipe } from './useTetrisInput';
import { getSpeedForLevel } from '../constants';
import { useHighScores } from '@/hooks/useHighScores';

interface UseTetrisOptions {
  onGameOver?: (score: number, level: number, lines: number) => void;
}

export const useTetris = (options: UseTetrisOptions = {}) => {
  const [state, dispatch] = useReducer(tetrisReducer, createInitialState());
  
  // High score management
  const { highScore, updateHighScore } = useHighScores('tetris');
  
  // Track previous status for game over detection
  const prevStatusRef = useRef(state.status);

  // Game loop timer
  const gameLoopRef = useRef<number | null>(null);

  // Start a new game
  const startGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME' });
  }, []);

  // Pause the game
  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
  }, []);

  // Resume the game
  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' });
  }, []);

  // Move piece left
  const moveLeft = useCallback(() => {
    dispatch({ type: 'MOVE_LEFT' });
  }, []);

  // Move piece right
  const moveRight = useCallback(() => {
    dispatch({ type: 'MOVE_RIGHT' });
  }, []);

  // Move piece down (soft drop)
  const moveDown = useCallback(() => {
    dispatch({ type: 'MOVE_DOWN' });
  }, []);

  // Rotate clockwise
  const rotateClockwise = useCallback(() => {
    dispatch({ type: 'ROTATE', direction: 'clockwise' });
  }, []);

  // Rotate counterclockwise
  const rotateCounterclockwise = useCallback(() => {
    dispatch({ type: 'ROTATE', direction: 'counterclockwise' });
  }, []);

  // Hard drop
  const hardDrop = useCallback(() => {
    dispatch({ type: 'HARD_DROP' });
  }, []);

  // Hold piece
  const doHoldPiece = useCallback(() => {
    dispatch({ type: 'HOLD_PIECE' });
  }, []);

  // Game tick - called automatically for piece falling
  const tick = useCallback(() => {
    if (state.status === 'playing') {
      dispatch({ type: 'TICK' });
    }
  }, [state.status]);

  // Keyboard input
  useTetrisInput({
    onMoveLeft: moveLeft,
    onMoveRight: moveRight,
    onMoveDown: moveDown,
    onRotateClockwise: rotateClockwise,
    onRotateCounterclockwise: rotateCounterclockwise,
    onHardDrop: hardDrop,
    onHold: doHoldPiece,
    onPause: state.status === 'playing' ? pauseGame : resumeGame,
    isPlaying: state.status === 'playing',
  });

  // Swipe input for mobile
  const { onTouchStart, onTouchEnd } = useTetrisSwipe(
    {
      onSwipeLeft: moveLeft,
      onSwipeRight: moveRight,
      onSwipeDown: moveDown,
      onSwipeUp: rotateClockwise,
      onTap: rotateClockwise,
    },
    state.status === 'playing'
  );

  // Game loop - handles automatic piece falling
  useEffect(() => {
    if (state.status === 'playing') {
      const speed = getSpeedForLevel(state.level);
      gameLoopRef.current = window.setInterval(tick, speed);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [state.status, state.level, tick]);

  // Handle game over - update high score
  useEffect(() => {
    if (prevStatusRef.current !== 'game_over' && state.status === 'game_over') {
      // Update high score
      updateHighScore(state.score);
      options.onGameOver?.(state.score, state.level, state.lines);
    }
    prevStatusRef.current = state.status;
  }, [state.status, state.score, state.level, state.lines, options, updateHighScore]);

  // Clear animation lines after a delay
  useEffect(() => {
    if (state.clearedLines.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'LINE_CLEAR', lines: [] });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [state.clearedLines]);

  return {
    // State
    board: state.board,
    currentPiece: state.currentPiece,
    nextPiece: state.nextPiece,
    holdPiece: state.holdPiece,
    canHold: state.canHold,
    score: state.score,
    highScore,
    level: state.level,
    lines: state.lines,
    status: state.status,
    clearedLines: state.clearedLines,
    ghostPosition: state.ghostPosition,
    
    // Actions
    startGame,
    pauseGame,
    resumeGame,
    moveLeft,
    moveRight,
    moveDown,
    rotateClockwise,
    rotateCounterclockwise,
    hardDrop,
    doHoldPiece,
    
    // Touch handlers
    onTouchStart,
    onTouchEnd,
  };
};
