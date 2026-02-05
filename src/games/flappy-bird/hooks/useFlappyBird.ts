/**
 * src/games/flappy-bird/hooks/useFlappyBird.ts
 *
 * Custom React hook for managing the state and logic of the Flappy Bird game.
 * It integrates with the `useGame` hook for common game state management (score, game over),
 * handles bird physics, pipe generation, collision detection, and user input.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { useGame } from '@/hooks/useGame';
import { GAME_DIMENSIONS, PHYSICS } from '@/utils/flappy_bird_const';
import {
  createInitialBird,
  updateBirdPhysics,
  updatePipes,
  generatePipesIfNeeded,
  checkCollision,
  birdJump, // Import birdJump
} from '../gameLogic';
import type { Bird, Pipe } from '../types';

/**
 * Manages the core logic and state for the Flappy Bird game.
 *
 * @returns {object} An object containing:
 *   - {object} gameState - The current state of the Flappy Bird game (bird, pipes, score, high score, game status).
 *   - {object} gameDimensions - Constants defining the game area dimensions.
 *   - {function(): void} jump - Function to make the bird jump.
 *   - {function(): void} startNewGame - Initiates a new game.
 *   - {function(): void} restartGame - Restarts the current game.
 */
export const useFlappyBird = () => {
  // Integrate with the generic useGame hook for common game state management
  // score: current game score
  // setScore: function to update current score
  // highScore: the highest score recorded for this game
  // setBestScore: function to update the high score
  // isGameOver, setIsGameOver: game over status
  // isPlaying, setIsPlaying: game playing status
  // gameStarted, setGameStarted: game started status
  // resetGameBase: base function to reset common game states
  const {
    score,
    setScore,
    highScore, // Now directly from useGame, which uses useHighScores
    setBestScore, // This now calls updateHighScore from useHighScores
    isGameOver,
    setIsGameOver,
    isPlaying,
    setIsPlaying,
    gameStarted,
    setGameStarted,
    resetGame: resetGameBase,
  } = useGame('flappy-bird'); // Pass unique gameId to useGame

  // State for the bird's properties (position, velocity)
  const [bird, setBird] = useState<Bird>(createInitialBird());
  // State for the array of pipes in the game
  const [pipes, setPipes] = useState<Pipe[]>([]);

  // Ref to store the requestAnimationFrame ID for the game loop, allowing it to be cancelled
  const gameLoopRef = useRef<number>();
  // Ref to track the time when the last pipe was generated, to control pipe spawning rate
  const lastPipeRef = useRef<number>(0);

  /**
   * The main game loop function. Updates game state, checks for collisions, and manages score.
   * This function is memoized using `useCallback`.
   * @returns {void}
   */
  const gameLoop = useCallback(() => {
    // Stop the loop if the game is not playing or is over
    if (!isPlaying || isGameOver) return;

    const currentTime = Date.now();
    // Update bird's position and velocity based on physics
    const updatedBird = updateBirdPhysics(bird);
    // Update pipe positions and calculate score increase from passing pipes
    const { pipes: updatedPipes, scoreIncrease } = updatePipes(pipes, bird.x);

    // Generate new pipes if needed based on time and existing pipes
    const pipesWithNew = generatePipesIfNeeded(
      updatedPipes,
      currentTime,
      lastPipeRef.current,
    );
    // If new pipes were generated, update the last pipe generation time
    if (pipesWithNew.length > updatedPipes.length) {
      lastPipeRef.current = currentTime;
    }

    // Check for collisions between the bird and pipes/ground
    const collision = checkCollision(updatedBird, pipesWithNew);

    // Calculate new score and update it
    const newScore = score + scoreIncrease;
    setScore(newScore);

    // Update the best score. `setBestScore` now internally calls `updateHighScore`.
    setBestScore(newScore);

    // Update bird and pipes state
    setBird(updatedBird);
    setPipes(pipesWithNew);

    // If a collision occurred, set game over and stop playing
    if (collision.hasCollision) {
      setIsGameOver(true);
      setIsPlaying(false);
    }

    // Request the next animation frame to continue the game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, isGameOver, bird, pipes, score, setScore, setBestScore, setIsGameOver, setIsPlaying]); // Dependencies for callback stability

  /**
   * Makes the bird jump by applying an upward velocity.
   * This function is memoized using `useCallback`.
   * @returns {void}
   */
  const jump = useCallback(() => {
    // Only allow jumping if the game is not over and is currently playing
    if (isGameOver || !isPlaying) return;
    setBird(prevBird => birdJump(prevBird)); // Use birdJump function
    // Reset isFlapping after a short delay
    setTimeout(() => {
      setBird(prevBird => ({ ...prevBird, isFlapping: false }));
    }, 100); // Match this duration with the CSS animation duration
  }, [isGameOver, isPlaying]);

  /**
   * Starts a new game, resetting all game-specific and common game states.
   * This function is memoized using `useCallback`.
   * @returns {void}
   */
  const startNewGame = useCallback(() => {
    resetGameBase(); // Reset common game states via useGame hook
    setBird(createInitialBird()); // Reset bird to initial position
    setPipes([]); // Clear all pipes
    lastPipeRef.current = 0; // Reset pipe generation timer
    setIsPlaying(true); // Set game to playing
    setGameStarted(true); // Mark game as started
  }, [resetGameBase, setIsPlaying, setGameStarted]); // Dependencies for callback stability

  /**
   * Restarts the game. Currently just calls `startNewGame`.
   * This function is memoized using `useCallback`.
   * @returns {void}
   */
  const restartGame = useCallback(() => {
    startNewGame();
  }, [startNewGame]); // Dependency for callback stability

  // Effect to manage the game loop's start and stop based on playing and game over status.
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop); // Start the game loop
    }

    // Cleanup function: cancels the animation frame when dependencies change or component unmounts
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, isPlaying, isGameOver]); // Dependencies for effect re-run

  // Effect to handle keyboard input for jumping and starting the game.
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault(); // Prevent default browser actions (e.g., scrolling)
        if (!gameStarted) {
          startNewGame(); // Start game if not already started
        } else {
          jump(); // Jump if game is already playing
        }
      }
    };

    // Add and remove keyboard event listener
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump, gameStarted, startNewGame]); // Dependencies for effect re-run

  // Consolidate relevant game state into a single object for easier return
  const gameState = {
    bird,
    pipes,
    score,
    highScore, // Expose highScore from useGame
    isGameOver,
    isPlaying,
    gameStarted,
  };

  // Return game state and control functions
  return {
    gameState,
    gameDimensions: GAME_DIMENSIONS, // Game dimensions constants
    jump,
    startNewGame,
    restartGame,
  };
};
