import { useEffect, useCallback, RefObject } from "react";
import { GameStatus, Action } from "../types";
import { PADDLE_SPEED } from "../../../utils/brick_breaker_const";

interface UseGameInputProps {
  dispatch: React.Dispatch<Action>;
  stateRef: RefObject<{
    gameStatus: GameStatus;
    paddle: { width: number; x: number };
    canvas: { width: number };
  }>;
  isMobile: boolean;
  gameBoardRef: RefObject<HTMLDivElement>;
}

export const useGameInput = ({ dispatch, stateRef, isMobile, gameBoardRef }: UseGameInputProps) => {
  // Effect to handle keyboard input for paddle movement and game control.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current?.gameStatus === GameStatus.PLAYING) {
        if (e.key === "ArrowLeft") {
          dispatch({ type: "SET_PADDLE_VELOCITY", payload: { dx: -PADDLE_SPEED } });
        } else if (e.key === "ArrowRight") {
          dispatch({ type: "SET_PADDLE_VELOCITY", payload: { dx: PADDLE_SPEED } });
        }
      }
      if (e.key === " ") { // Spacebar to start/pause/resume
        e.preventDefault(); // Prevent default scroll behavior
        if (stateRef.current?.gameStatus === GameStatus.IDLE) {
          dispatch({ type: "START_GAME" });
        } else if (stateRef.current?.gameStatus === GameStatus.PLAYING) {
          dispatch({ type: "PAUSE_GAME" });
        } else if (stateRef.current?.gameStatus === GameStatus.PAUSED) {
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

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch, stateRef]);

  // Touch handling for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (stateRef.current?.gameStatus !== GameStatus.PLAYING || !gameBoardRef.current) return;
    e.preventDefault();
  }, [stateRef, gameBoardRef]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (stateRef.current?.gameStatus !== GameStatus.PLAYING || !gameBoardRef.current) return;
    const touchX = e.touches[0].clientX;
    const gameBoardRect = gameBoardRef.current.getBoundingClientRect();

    let newPaddleX = touchX - gameBoardRect.left;

    newPaddleX = Math.max(
      0,
      Math.min(newPaddleX, stateRef.current.canvas.width - stateRef.current.paddle.width)
    );

    dispatch({ type: "UPDATE_PADDLE_POSITION", payload: { x: newPaddleX } });
    e.preventDefault();
  }, [dispatch, stateRef, gameBoardRef]);

  const handleTouchEnd = useCallback(() => {
    // For direct control, no specific action is needed on touch end other than releasing the touch.
  }, []);

  useEffect(() => {
    const gameBoardElement = gameBoardRef.current;
    if (gameBoardElement && isMobile) {
      gameBoardElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      gameBoardElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      gameBoardElement.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        gameBoardElement.removeEventListener('touchstart', handleTouchStart);
        gameBoardElement.removeEventListener('touchmove', handleTouchMove);
        gameBoardElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMobile, gameBoardRef, handleTouchStart, handleTouchMove, handleTouchEnd]);
};
