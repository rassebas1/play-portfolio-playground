import { useState, useCallback, useRef, useEffect } from 'react';
import { useGame } from '@/hooks/useGame';
import { GAME_DIMENSIONS, PHYSICS } from '@/utils/flappy_bird_const';
import {
  createInitialBird,
  updateBirdPhysics,
  updatePipes,
  generatePipesIfNeeded,
  checkCollision,
} from '../gameLogic';
import type { Bird, Pipe } from '../types';

export const useFlappyBird = () => {
  const {
    score,
    setScore,
    bestScore,
    setBestScore,
    isGameOver,
    setIsGameOver,
    isPlaying,
    setIsPlaying,
    gameStarted,
    setGameStarted,
    resetGame: resetGameBase,
  } = useGame('flappy-bird-best-score');

  const [bird, setBird] = useState<Bird>(createInitialBird());
  const [pipes, setPipes] = useState<Pipe[]>([]);

  const gameLoopRef = useRef<number>();
  const lastPipeRef = useRef<number>(0);

  const gameLoop = useCallback(() => {
    if (!isPlaying || isGameOver) return;

    const currentTime = Date.now();
    const updatedBird = updateBirdPhysics(bird);
    const { pipes: updatedPipes, scoreIncrease } = updatePipes(pipes, bird.x);

    const pipesWithNew = generatePipesIfNeeded(
      updatedPipes,
      currentTime,
      lastPipeRef.current,
    );
    if (pipesWithNew.length > updatedPipes.length) {
      lastPipeRef.current = currentTime;
    }

    const collision = checkCollision(updatedBird, pipesWithNew);

    const newScore = score + scoreIncrease;
    setScore(newScore);

    if (newScore > bestScore) {
      setBestScore(newScore);
    }

    setBird(updatedBird);
    setPipes(pipesWithNew);

    if (collision.hasCollision) {
      setIsGameOver(true);
      setIsPlaying(false);
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, isGameOver, bird, pipes, score, bestScore, setScore, setBestScore, setIsGameOver, setIsPlaying]);

  const jump = useCallback(() => {
    if (isGameOver || !isPlaying) return;
    setBird(prevBird => ({
      ...prevBird,
      velocity: PHYSICS.jumpVelocity,
    }));
  }, [isGameOver, isPlaying]);

  const startNewGame = useCallback(() => {
    resetGameBase();
    setBird(createInitialBird());
    setPipes([]);
    lastPipeRef.current = 0;
    setIsPlaying(true);
    setGameStarted(true);
  }, [resetGameBase, setIsPlaying, setGameStarted]);

  const restartGame = useCallback(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, isPlaying, isGameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!gameStarted) {
          startNewGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump, gameStarted, startNewGame]);

  const gameState = {
    bird,
    pipes,
    score,
    bestScore,
    isGameOver,
    isPlaying,
    gameStarted,
  };

  return {
    gameState,
    gameDimensions: GAME_DIMENSIONS,
    jump,
    startNewGame,
    restartGame,
  };
};