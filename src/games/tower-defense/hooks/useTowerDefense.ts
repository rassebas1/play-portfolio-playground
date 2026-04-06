/**
 * Tower Defense Game Hook
 * 
 * Main hook that orchestrates the tower defense game state,
 * game loop, and user interactions.
 * 
 * Features:
 * - useReducer for state management
 * - requestAnimationFrame for smooth game loop
 * - Keyboard shortcuts for tower selection
 * - High score integration
 * - Session tracking
 */

import { useReducer, useEffect, useCallback, useRef } from 'react';
import { gameReducer, createInitialState } from '../GameReducer';
import { GameState, TowerType, Difficulty } from '../types';
import { useHighScores } from '@/hooks/useHighScores';
import { createGameSession, type GameSession } from '@/types/highScores';

interface UseTowerDefenseReturn {
  gameState: GameState;
  handlePlaceTower: (towerType: TowerType, row: number, col: number) => void;
  handleStartWave: () => void;
  handleUpgradeTower: (towerId: string) => void;
  handleSellTower: (towerId: string) => void;
  handleResetGame: () => void;
  handleSelectTowerType: (towerType: TowerType | null) => void;
  handleSelectTower: (towerId: string | null) => void;
  handleGameSpeed: (speed: number) => void;
  handleTowerHover: (towerId: string | null) => void;
  handleSetDifficulty: (difficulty: Difficulty) => void;
  isGameRunning: boolean;
  session: GameSession | null;
  highScore: number | null;
  updateHighScore: (score: number) => void;
  submitScore: (score: number) => Promise<boolean>;
}

export function useTowerDefense(): UseTowerDefenseReturn {
  const [gameState, dispatch] = useReducer(gameReducer, null, createInitialState);
  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const sessionRef = useRef<GameSession | null>(null);
  const gameStateRef = useRef(gameState);
  
  // Keep ref in sync with current state
  gameStateRef.current = gameState;

  // High scores integration
  const { 
    highScore, 
    updateHighScore, 
    submitScore,
    startSession: startHighScoreSession,
    recordMove,
  } = useHighScores('tower-defense', 'score');

  /**
   * Game loop using requestAnimationFrame
   */
  const gameLoop = useCallback(() => {
    const now = Date.now();
    const deltaTime = now - lastTickRef.current;
    lastTickRef.current = now;

    dispatch({ type: 'TICK', deltaTime });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, []);

  /**
   * Start/stop game loop based on game phase
   */
  useEffect(() => {
    if (gameState.phase === 'playing') {
      lastTickRef.current = Date.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.phase, gameLoop]);

  /**
   * Handle game over - submit score
   */
  useEffect(() => {
    if (gameState.phase === 'gameOver' || gameState.phase === 'victory') {
      // Update local high score
      updateHighScore(gameState.score);
      
      // Submit to server if session exists
      if (sessionRef.current) {
        submitScore(gameState.score);
        sessionRef.current = null;
      }
    }
  }, [gameState.phase, gameState.score, updateHighScore, submitScore]);

  /**
   * Start a new game session
   */
  const handleResetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
    sessionRef.current = createGameSession('tower-defense');
    startHighScoreSession();
  }, [startHighScoreSession]);

  /**
   * Place a tower on the grid
   */
  const handlePlaceTower = useCallback((towerType: TowerType, row: number, col: number) => {
    dispatch({ type: 'PLACE_TOWER', towerType, row, col });
    recordMove();
  }, [recordMove]);

  /**
   * Start the next wave
   */
  const handleStartWave = useCallback(() => {
    if (!sessionRef.current) {
      sessionRef.current = createGameSession('tower-defense');
      startHighScoreSession();
    }
    dispatch({ type: 'START_WAVE' });
  }, [startHighScoreSession]);

  /**
   * Upgrade an existing tower
   */
  const handleUpgradeTower = useCallback((towerId: string) => {
    dispatch({ type: 'UPGRADE_TOWER', towerId });
    recordMove();
  }, [recordMove]);

  /**
   * Sell a tower for partial refund
   */
  const handleSellTower = useCallback((towerId: string) => {
    dispatch({ type: 'SELL_TOWER', towerId });
  }, []);

  /**
   * Select a tower type for placement
   */
  const handleSelectTowerType = useCallback((towerType: TowerType | null) => {
    dispatch({ type: 'SELECT_TOWER_TYPE', towerType });
  }, []);

  /**
   * Select an existing tower for details/upgrades
   */
  const handleSelectTower = useCallback((towerId: string | null) => {
    dispatch({ type: 'SELECT_TOWER', towerId });
  }, []);

  /**
   * Change game speed
   */
  const handleGameSpeed = useCallback((speed: number) => {
    dispatch({ type: 'SET_GAME_SPEED', speed });
  }, []);

  const handleTowerHover = useCallback((towerId: string | null) => {
    dispatch({ type: 'HOVER_TOWER', towerId });
  }, []);

  /**
   * Change difficulty (resets game)
   */
  const handleSetDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', difficulty });
    sessionRef.current = createGameSession('tower-defense');
    startHighScoreSession();
  }, [startHighScoreSession]);

  /**
   * Check if game is currently running (wave active)
   */
  const isGameRunning = gameState.phase === 'playing';

  return {
    gameState,
    handlePlaceTower,
    handleStartWave,
    handleUpgradeTower,
    handleSellTower,
    handleResetGame,
    handleSelectTowerType,
    handleSelectTower,
    handleGameSpeed,
    handleTowerHover,
    handleSetDifficulty,
    isGameRunning,
    session: sessionRef.current,
    highScore,
    updateHighScore,
    submitScore,
  };
}
