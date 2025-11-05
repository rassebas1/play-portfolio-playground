// src/games/brick-breaker/hooks/useBrickBreaker.ts

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

export const useBrickBreaker = () => {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());
  const animationFrameId = useRef<number | null>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const gameLoop = useCallback(() => {
    if (stateRef.current.gameStatus !== GameStatus.PLAYING) {
      animationFrameId.current = null;
      return;
    }

    let newBall = { ...stateRef.current.ball };
    let newBricks = [...stateRef.current.bricks];

    // Update Paddle Position
    const newPaddleX = stateRef.current.paddle.x + stateRef.current.paddle.dx;
    const clampedPaddleX = Math.max(
      0,
      Math.min(newPaddleX, stateRef.current.canvas.width - stateRef.current.paddle.width)
    );
    dispatch({ type: "UPDATE_PADDLE_POSITION", payload: { x: clampedPaddleX } });

    // 1. Update Ball Position
    newBall = updateBallPosition(newBall, stateRef.current.canvas.width, stateRef.current.canvas.height);

    // 2. Handle Ball-Paddle Collision
    newBall = handlePaddleCollision(newBall, stateRef.current.paddle);

    // 3. Handle Ball-Brick Collision
    const { ball: ballAfterBrickCollision, brokenBrickIndex } = handleBrickCollision(newBall, newBricks);
    newBall = ballAfterBrickCollision;

    if (brokenBrickIndex !== null) {
      dispatch({ type: "BREAK_BRICK", payload: { index: brokenBrickIndex } });
      // Update newBricks array directly for current loop iteration to reflect broken brick
      newBricks[brokenBrickIndex] = { ...newBricks[brokenBrickIndex], isBroken: true };
    }

    // 4. Check for Ball Out of Bounds
    if (isBallOutOfBounds(newBall, stateRef.current.canvas.height)) {
      dispatch({ type: "LOSE_LIFE" });
      // If lives are 0, game over will be handled by reducer
      if (stateRef.current.lives - 1 <= 0) {
        dispatch({ type: "GAME_OVER" });
      } else {
        // Reset ball to paddle if lives remain
        newBall = resetBall(stateRef.current.paddle);
      }
    }

    // 5. Check for Level Cleared
    if (areAllBricksBroken(newBricks.filter(brick => !brick.isBroken))) { // Filter out already broken bricks
      dispatch({ type: "LEVEL_UP" });
      // After level up, bricks are recreated, so we need to reset ball and paddle for next level
      newBall = resetBall(stateRef.current.paddle);
    }

    // Dispatch ball update (only if not reset by LOSE_LIFE or LEVEL_UP)
    if (stateRef.current.gameStatus === GameStatus.PLAYING) { // Ensure game is still playing before updating ball
      dispatch({
        type: "UPDATE_BALL",
        payload: { x: newBall.x, y: newBall.y, dx: newBall.dx, dy: newBall.dy },
      });
    }

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [dispatch]);

  useEffect(() => {
    if (stateRef.current.gameStatus === GameStatus.PLAYING && !animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [stateRef.current.gameStatus, gameLoop]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.gameStatus === GameStatus.PLAYING) {
        if (e.key === "ArrowLeft") {
          dispatch({ type: "SET_PADDLE_VELOCITY", payload: { dx: -PADDLE_SPEED } });
        } else if (e.key === "ArrowRight") {
          dispatch({ type: "SET_PADDLE_VELOCITY", payload: { dx: PADDLE_SPEED } });
        }
      }
      if (e.key === " ") { // Spacebar to start/pause
        e.preventDefault();
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
        dispatch({ type: "SET_PADDLE_VELOCITY", payload: { dx: 0 } }); // Stop paddle movement on key up
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]);

  return { state, dispatch };
};