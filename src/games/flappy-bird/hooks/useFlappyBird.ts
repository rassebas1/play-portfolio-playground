import { useState, useCallback, useRef, useEffect } from 'react';
import type { FlappyBirdState, Bird, Pipe, GamePhysics, GameDimensions, CollisionResult } from '../types';

/**
 * Custom hook for Flappy Bird game logic and state management
 * Handles bird physics, pipe generation, collision detection, and game flow
 */
export const useFlappyBird = () => {
  // Game constants
  const GAME_DIMENSIONS: GameDimensions = {
    width: 400,
    height: 600,
    groundHeight: 80,
    birdSize: 30,
  };

  const PHYSICS: GamePhysics = {
    gravity: 0.6,
    jumpVelocity: -12,
    terminalVelocity: 15,
    pipeSpeed: 3,
    pipeGap: 200,
    pipeWidth: 60,
  };

  /**
   * Creates initial bird state
   */
  const createInitialBird = (): Bird => ({
    x: 100,
    y: GAME_DIMENSIONS.height / 2,
    velocity: 0,
    rotation: 0,
  });

  /**
   * Creates a new pipe obstacle
   */
  const createPipe = (x: number): Pipe => {
    const minTopHeight = 100;
    const maxTopHeight = GAME_DIMENSIONS.height - GAME_DIMENSIONS.groundHeight - PHYSICS.pipeGap - 100;
    const topHeight = Math.random() * (maxTopHeight - minTopHeight) + minTopHeight;
    
    return {
      id: `pipe-${Date.now()}-${Math.random()}`,
      x,
      topHeight,
      bottomY: topHeight + PHYSICS.pipeGap,
      width: PHYSICS.pipeWidth,
      passed: false,
    };
  };

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
   * Checks for collisions between the bird and the game boundaries (ground, ceiling) or pipes.
   * Returns an object indicating whether a collision occurred and its type.
   */
  const checkCollision = (bird: Bird, pipes: Pipe[]): CollisionResult => {
    const birdLeft = bird.x - GAME_DIMENSIONS.birdSize / 2;
    const birdRight = bird.x + GAME_DIMENSIONS.birdSize / 2;
    const birdTop = bird.y - GAME_DIMENSIONS.birdSize / 2;
    const birdBottom = bird.y + GAME_DIMENSIONS.birdSize / 2;

    // 1. Check for collision with the ground.
    if (birdBottom >= GAME_DIMENSIONS.height - GAME_DIMENSIONS.groundHeight) {
      return { hasCollision: true, collisionType: 'ground' };
    }

    // 2. Check for collision with the ceiling.
    if (birdTop <= 0) {
      return { hasCollision: true, collisionType: 'ceiling' };
    }

    // 3. Check for collisions with each of the pipes.
    for (const pipe of pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + pipe.width;

      // Check if the bird is horizontally aligned with the current pipe.
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check for collision with the top pipe.
        if (birdTop < pipe.topHeight) {
          return { hasCollision: true, collisionType: 'pipe' };
        }
        // Check for collision with the bottom pipe.
        if (birdBottom > pipe.bottomY) {
          return { hasCollision: true, collisionType: 'pipe' };
        }
      }
    }

    // 4. If no collisions are detected, return a negative result.
    return { hasCollision: false };
  };

  /**
   * Updates the bird's physics, including its vertical velocity, position, and rotation.
   * This function simulates gravity and terminal velocity.
   */
  const updateBirdPhysics = (bird: Bird): Bird => {
    // Apply gravity to the current velocity, respecting terminal velocity.
    const newVelocity = Math.min(bird.velocity + PHYSICS.gravity, PHYSICS.terminalVelocity);
    // Update the bird's vertical position based on the new velocity.
    const newY = bird.y + newVelocity;
    
    // Calculate the bird's rotation based on its vertical velocity for a visual effect.
    const rotation = Math.max(-30, Math.min(90, newVelocity * 3));

    return {
      ...bird,
      y: newY,
      velocity: newVelocity,
      rotation,
    };
  };

  /**
   * Updates pipe positions and removes off-screen pipes
   */
  const updatePipes = (pipes: Pipe[]): { pipes: Pipe[]; scoreIncrease: number } => {
    let scoreIncrease = 0;
    
    const updatedPipes = pipes
      .map(pipe => {
        const newPipe = { ...pipe, x: pipe.x - PHYSICS.pipeSpeed };
        
        // Check if bird passed this pipe
        if (!pipe.passed && newPipe.x + newPipe.width < gameState.bird.x) {
          newPipe.passed = true;
          scoreIncrease += 1;
        }
        
        return newPipe;
      })
      .filter(pipe => pipe.x + pipe.width > -50); // Remove off-screen pipes

    return { pipes: updatedPipes, scoreIncrease };
  };

  /**
   * Generates new pipes when needed
   */
  const generatePipesIfNeeded = (pipes: Pipe[], currentTime: number): Pipe[] => {
    const pipeSpacing = 300;
    
    if (currentTime - lastPipeRef.current > pipeSpacing) {
      lastPipeRef.current = currentTime;
      return [...pipes, createPipe(GAME_DIMENSIONS.width)];
    }
    
    return pipes;
  };

  /**
   * Main game loop function, running on every animation frame.
   * This function is the heart of the game, updating the state of the bird, pipes, and checking for collisions.
   */
  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    setGameState(prevState => {
      // 1. Update bird's vertical position and rotation based on gravity.
      const updatedBird = updateBirdPhysics(prevState.bird);
      
      // 2. Move pipes to the left and check if any have been passed by the bird.
      const { pipes: updatedPipes, scoreIncrease } = updatePipes(prevState.pipes);
      
      // 3. Generate new pipes when the last one has moved a certain distance.
      const pipesWithNew = generatePipesIfNeeded(updatedPipes, Date.now());
      
      // 4. Check for collisions with the ground, ceiling, or pipes.
      const collision = checkCollision(updatedBird, pipesWithNew);
      
      const newScore = prevState.score + scoreIncrease;
      const newBestScore = Math.max(prevState.bestScore, newScore);
      
      // 5. Save the best score to local storage if it has been surpassed.
      if (newBestScore > prevState.bestScore) {
        localStorage.setItem('flappy-bird-best-score', newBestScore.toString());
      }

      // 6. Update the game state with the new values.
      return {
        ...prevState,
        bird: updatedBird,
        pipes: pipesWithNew,
        score: newScore,
        bestScore: newBestScore,
        isGameOver: collision.hasCollision,
        isPlaying: !collision.hasCollision,
      };
    });

    // Request the next animation frame to continue the loop.
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.isGameOver]);

  /**
   * Makes the bird jump
   */
  const jump = useCallback(() => {
    if (gameState.isGameOver) return;

    setGameState(prevState => {
      if (!prevState.gameStarted) {
        // Start the game on first jump
        return {
          ...prevState,
          gameStarted: true,
          isPlaying: true,
          bird: {
            ...prevState.bird,
            velocity: PHYSICS.jumpVelocity,
          },
        };
      }

      return {
        ...prevState,
        bird: {
          ...prevState.bird,
          velocity: PHYSICS.jumpVelocity,
        },
      };
    });
  }, [gameState.isGameOver, gameState.gameStarted]);

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
      isPlaying: false,
      isGameOver: false,
      gameStarted: false,
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