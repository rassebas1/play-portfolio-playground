import { useEffect, useCallback, useRef, RefObject } from "react";
import { GameStatus, Action } from "../types";
import { PADDLE_SPEED } from "../constants";

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
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number | null>(null);

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

  // Handle tap/double-tap for start/pause/restart
  const handleTap = useCallback((touchX: number, touchY: number) => {
    const now = Date.now();
    const gameStatus = stateRef.current?.gameStatus;

    // Check for double-tap (within 300ms) to restart
    if (lastTapRef.current && now - lastTapRef.current < 300) {
      dispatch({ type: "RESET_GAME" });
      lastTapRef.current = null;
      return;
    }
    lastTapRef.current = now;

    // Handle tap based on game status
    if (gameStatus === GameStatus.IDLE) {
      dispatch({ type: "START_GAME" });
    } else if (gameStatus === GameStatus.PLAYING) {
      dispatch({ type: "PAUSE_GAME" });
    } else if (gameStatus === GameStatus.PAUSED) {
      dispatch({ type: "RESUME_GAME" });
    } else if (gameStatus === GameStatus.GAME_OVER || gameStatus === GameStatus.LEVEL_CLEARED) {
      dispatch({ type: "RESET_GAME" });
    }
  }, [dispatch]);

  // Touch handling for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };

    // Handle tap when not playing (to start game)
    const gameStatus = stateRef.current?.gameStatus;
    if (gameStatus !== GameStatus.PLAYING && gameBoardRef.current) {
      e.preventDefault();
    }
  }, [stateRef.current, gameBoardRef.current]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (stateRef.current?.gameStatus !== GameStatus.PLAYING) {
      // If not playing, this might be a tap attempt - don't move paddle
      return;
    }

    // Explicitly check gameBoardRef.current here
    const currentGameBoard = gameBoardRef.current;
    if (!currentGameBoard) {
        return;
    }

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const gameBoardRect = currentGameBoard.getBoundingClientRect();

    // Check if this is a tap (minimal movement) vs a drag
    if (touchStartRef.current) {
      const dx = Math.abs(touchX - touchStartRef.current.x);
      const dy = Math.abs(touchY - touchStartRef.current.y);
      
      // If moved more than 10px, it's a drag, not a tap - clear the tap reference
      if (dx > 10 || dy > 10) {
        touchStartRef.current = null;
      }
    }

    let newPaddleX = touchX - gameBoardRect.left;

    const currentState = stateRef.current;
    if (!currentState) {
        return;
    }

    newPaddleX = Math.max(
      0,
      Math.min(newPaddleX, currentState.canvas.width - currentState.paddle.width)
    );

    dispatch({ type: "UPDATE_PADDLE_POSITION", payload: { x: newPaddleX } });
    e.preventDefault();
  }, [dispatch, stateRef.current, gameBoardRef.current]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // If touchStartRef is still set, it means the touch didn't move much - it's a tap
    if (touchStartRef.current && stateRef.current?.gameStatus !== GameStatus.PLAYING) {
      handleTap(touchStartRef.current.x, touchStartRef.current.y);
    }
    touchStartRef.current = null;
  }, [handleTap, stateRef.current]);

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
  }, [isMobile, gameBoardRef.current, handleTouchStart, handleTouchMove, handleTouchEnd]);
};
