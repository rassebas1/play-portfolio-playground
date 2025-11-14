/**
 * src/games/brick-breaker/hooks/useBrickBreaker.ts
 *
 * Custom React hook for managing the state and logic of the Brick Breaker game.
 * It integrates a reducer for complex state transitions, handles the main game loop,
 * keyboard input for paddle control, and interacts with the high score system.
 */
import { useReducer, useEffect, useRef, useCallback } from "react";
import { gameReducer, getInitialState } from "../GameReducer";
import { GameStatus } from "../types";
import { PADDLE_SPEED } from "../../../utils/brick_breaker_const";
import {
  updateBallPosition,
  handlePaddleCollision,
  handleBrickCollision,
  isBallOutOfBounds,
  areAllBricksBroken,
  resetBall,
} from "../gameLogic";
import { useHighScores } from '@/hooks/useHighScores';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

/**
 * Custom hook for managing the Brick Breaker game logic and state.
 *
 * @returns {object} An object containing:
 *   - {GameState} state - The current state of the Brick Breaker game (paddle, ball, bricks, score, lives, etc.).
 *   - {function(action: Action): void} dispatch - The dispatch function from the reducer, allowing external components to send actions.
 *   - {number | null} highScore - The highest score recorded for the Brick Breaker game, or null if none exists.
 */
export const useBrickBreaker = () => {
  const { width: windowWidth } = useWindowSize(); // Get current window width
  const isMobile = useIsMobile(); // Determine if the device is mobile

  // Define max canvas width and aspect ratios
  const MAX_CANVAS_WIDTH = 800;
  const DESKTOP_CANVAS_ASPECT_RATIO = 600 / 800; // Original height / original width
  const MOBILE_CANVAS_ASPECT_RATIO = 1.0; // Taller aspect ratio for mobile (e.g., 1:1 square)

  // Conditionally set CANVAS_ASPECT_RATIO based on device type
  const CANVAS_ASPECT_RATIO = isMobile ? MOBILE_CANVAS_ASPECT_RATIO : DESKTOP_CANVAS_ASPECT_RATIO;

  // Calculate responsive canvas dimensions
  const responsiveCanvasWidth = Math.max(320, Math.min(windowWidth * 0.9, MAX_CANVAS_WIDTH)); // 90% of window width, max 800, min 320
  const responsiveCanvasHeight = responsiveCanvasWidth * CANVAS_ASPECT_RATIO;

  // useReducer manages the complex state transitions of the game
  const [state, dispatch] = useReducer(gameReducer, getInitialState(responsiveCanvasWidth, responsiveCanvasHeight));
  // Ref to store the requestAnimationFrame ID for the game loop, allowing it to be cancelled
  const animationFrameId = useRef<number | null>(null);
  // Ref to hold the current state, allowing callbacks to access the latest state without re-creating
  const stateRef = useRef(state);
  // useHighScores hook integrates persistent high score tracking for the 'brick-breaker' game
  const { highScore, updateHighScore } = useHighScores('brick-breaker');

  // Effect to keep stateRef always updated with the latest state
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Effect to update canvas size in state when responsive dimensions change
  useEffect(() => {
    dispatch({ type: "SET_CANVAS_SIZE", payload: { width: responsiveCanvasWidth, height: responsiveCanvasHeight } });
  }, [responsiveCanvasWidth, responsiveCanvasHeight, dispatch]);

  /**
   * The main game loop function. Updates game state, checks for collisions, and manages score.
   * This function is memoized using `useCallback`.
   * @returns {void}
   */
  const gameLoop = useCallback(() => {
    // Stop the loop if the game is not playing
    if (stateRef.current.gameStatus !== GameStatus.PLAYING) {
      animationFrameId.current = null;
      return;
    }

    let newBall = { ...stateRef.current.ball };
    let newBricks = [...stateRef.current.bricks];

    // Update Paddle Position based on its current velocity (dx)
    const newPaddleX = stateRef.current.paddle.x + stateRef.current.paddle.dx;
    // Clamp paddle position within canvas boundaries
    const clampedPaddleX = Math.max(
      0,
      Math.min(newPaddleX, stateRef.current.canvas.width - stateRef.current.paddle.width)
    );
    dispatch({ type: "UPDATE_PADDLE_POSITION", payload: { x: clampedPaddleX } });

    // 1. Update Ball Position based on its velocity and canvas boundaries
    newBall = updateBallPosition(newBall, stateRef.current.canvas.width, stateRef.current.canvas.height);

    // 2. Handle Ball-Paddle Collision: updates ball direction if it hits the paddle
    newBall = handlePaddleCollision(newBall, stateRef.current.paddle);

    // 3. Handle Ball-Brick Collision: checks if ball hits any brick
    const { ball: ballAfterBrickCollision, brokenBrickIndex } = handleBrickCollision(newBall, newBricks);
    newBall = ballAfterBrickCollision; // Update ball state after potential collision

    if (brokenBrickIndex !== null) {
      // If a brick was broken, dispatch action to update game state and score
      dispatch({ type: "BREAK_BRICK", payload: { index: brokenBrickIndex } });
      // Also update newBricks array directly for current loop iteration to reflect broken brick
      newBricks[brokenBrickIndex] = { ...newBricks[brokenBrickIndex], isBroken: true };
    }

    // 4. Check for Ball Out of Bounds: if ball goes below the paddle
    if (isBallOutOfBounds(newBall, stateRef.current.canvas.height)) {
      dispatch({ type: "LOSE_LIFE" }); // Dispatch action to lose a life
      // If lives are 0, game over will be handled by reducer. Otherwise, reset ball to paddle.
      if (stateRef.current.lives - 1 <= 0) {
        dispatch({ type: "GAME_OVER" });
      } else {
        newBall = resetBall(stateRef.current.paddle, stateRef.current.canvas.height); // Reset ball to paddle for next life
      }
    }

    // 5. Check for Level Cleared: if all active bricks are broken
    if (areAllBricksBroken(newBricks.filter(brick => !brick.isBroken))) {
      dispatch({ type: "LEVEL_UP" }); // Dispatch action to level up
      // After level up, bricks are recreated, so reset ball and paddle for next level
      newBall = resetBall(stateRef.current.paddle, stateRef.current.canvas.height);
    }

    // Dispatch ball update (only if game is still playing and ball wasn't reset by LOSE_LIFE or LEVEL_UP)
    if (stateRef.current.gameStatus === GameStatus.PLAYING) {
      dispatch({
        type: "UPDATE_BALL",
        payload: { x: newBall.x, y: newBall.y, dx: newBall.dx, dy: newBall.dy },
      });
    }

    // Request the next animation frame to continue the game loop
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [dispatch]); // Dependency on dispatch for callback stability

  // Effect to manage the game loop's start and stop based on game status.
  useEffect(() => {
    if (stateRef.current.gameStatus === GameStatus.PLAYING && !animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(gameLoop); // Start the game loop
    }

    // Cleanup function: cancels the animation frame when dependencies change or component unmounts
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [stateRef.current.gameStatus, gameLoop]); // Dependencies for effect re-run

  // Effect to update the high score when the game is over.
  useEffect(() => {
    if (state.gameStatus === GameStatus.GAME_OVER) {
      // If the game is over, update the high score using the 'highest' strategy
      updateHighScore(state.score, 'highest');
    }
  }, [state.gameStatus, state.score, updateHighScore]); // Dependencies for game over, current score, and high score update function

  // Effect to handle keyboard input for paddle movement and game control.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.gameStatus === GameStatus.PLAYING) {
        if (e.key === "ArrowLeft") {
          dispatch({ type: "SET_PADDLE_VELOCITY", payload: { dx: -PADDLE_SPEED } });
        } else if (e.key === "ArrowRight") {
          dispatch({ type: "SET_PADDLE_VELOCITY", payload: { dx: PADDLE_SPEED } });
        }
      }
      if (e.key === " ") { // Spacebar to start/pause/resume
        e.preventDefault(); // Prevent default scroll behavior
        if (stateRef.current.gameStatus === GameStatus.IDLE) {
          dispatch({ type: "START_GAME" });
        } else if (stateRef.current.gameStatus === GameStatus.PLAYING) {
          dispatch({ type: "PAUSE_GAME" });
        } else if (stateRef.current.gameStatus === GameStatus.PAUSED) {
          dispatch({ type: "RESUME_GAME" });
        }
      }
      if (e.key === "r" || e.key === "R") { // 'R' to reset
        dispatch({ type: "RESET_GAME" });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        // Stop paddle movement when arrow keys are released
        dispatch({ type: "SET_PADDLE_VELOCITY", payload: { dx: 0 } });
      }
    };

    // Add and remove keyboard event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]); // Dependency on dispatch for callback stability

  // Return the current game state, dispatch function, and high score
  return { state, dispatch, highScore };
};