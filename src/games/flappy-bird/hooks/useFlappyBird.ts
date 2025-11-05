import { useState, useCallback, useRef, useEffect } from 'react';
import type { FlappyBirdState } from '../types';
import { GAME_DIMENSIONS, PHYSICS } from '../constants';
import { createInitialBird, updateGameState } from '../gameLogic';

/**
 * Custom hook for Flappy Bird game logic and state management
 * Handles bird physics, pipe generation, collision detection, and game flow
 */
export const useFlappyBird = () => {
  // Game state
  const [gameState, setGameState] = useState<FlappyBirdState>(() => ({
    bird: createInitialBird(),
    pipes: [],
    score: 0,
    bestScore: parseInt(localStorage.getItem('flappy-bird-best-score') || '0'),
    isPlaying: false,
    isGameOver: false,
    gameStarted: false,
  }));

  const gameLoopRef = useRef<number>();
  const lastPipeRef = useRef<number>(0);

  /**
   * Main game loop function, running on every animation frame.
   * This function is the heart of the game, updating the state of the bird, pipes, and checking for collisions.
   */
  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    setGameState(prevState => updateGameState(prevState, lastPipeRef));

    // Request the next animation frame to continue the loop.
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.isGameOver]);

  /**
   * Makes the bird jump
   */
  const jump = useCallback(() => {
    if (gameState.isGameOver || !gameState.isPlaying) return;

    setGameState(prevState => ({
      ...prevState,
      bird: {
        ...prevState.bird,
        velocity: PHYSICS.jumpVelocity,
      },
    }));
  }, [gameState.isGameOver, gameState.isPlaying]);

  /**
   * Starts a new game
   */
  const startNewGame = useCallback(() => {
    lastPipeRef.current = 0;
    
    setGameState(prevState => ({
      bird: createInitialBird(),
      pipes: [],
      score: 0,
      bestScore: prevState.bestScore,
      isPlaying: true,
      isGameOver: false,
      gameStarted: true,
    }));
  }, []);

  /**
   * Restarts the current game
   */
  const restartGame = useCallback(() => {
    startNewGame();
  }, [startNewGame]);

  // Game loop effect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState.isPlaying, gameState.isGameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  return {
    gameState,
    gameDimensions: GAME_DIMENSIONS,
    jump,
    startNewGame,
    restartGame,
  };
};