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

/**
 * Dead zone ratio: 50% of the paddle width centered on the paddle.
 * If the touch is within this zone, dx = 0 (paddle stops).
 * If the touch is outside, the paddle moves toward the touch direction.
 */
const DEAD_ZONE_RATIO = 0.5;

export const useGameInput = ({ dispatch, stateRef, isMobile, gameBoardRef }: UseGameInputProps) => {
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  // --- Keyboard input (desktop, unchanged) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current?.gameStatus === GameStatus.PLAYING) {
        if (e.key === "ArrowLeft") {
          dispatch({ type: "SET_PADDLE_VELOCITY", payload: { dx: -PADDLE_SPEED } });
        } else if (e.key === "ArrowRight") {
          dispatch({ type: "SET_PADDLE_VELOCITY", payload: { dx: PADDLE_SPEED } });
        }
      }
      if (e.key === " ") {
        e.preventDefault();
        if (stateRef.current?.gameStatus === GameStatus.IDLE) {
          dispatch({ type: "START_GAME" });
        } else if (stateRef.current?.gameStatus === GameStatus.PLAYING) {
          dispatch({ type: "PAUSE_GAME" });
        } else if (stateRef.current?.gameStatus === GameStatus.PAUSED) {
          dispatch({ type: "RESUME_GAME" });
        }
      }
      if (e.key === "r" || e.key === "R") {
        dispatch({ type: "RESET_GAME" });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
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

  // --- Pointer input (mobile: drag paddle via dead zone) ---
  const handlePointerDown = useCallback((e: PointerEvent) => {
    const element = e.target as HTMLElement;

    // Capture: all subsequent pointer events go here, even if finger leaves the element
    element.setPointerCapture(e.pointerId);

    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const currentState = stateRef.current;
    const currentGameBoard = gameBoardRef.current;

    if (!currentState || !currentGameBoard) return;
    if (currentState.gameStatus !== GameStatus.PLAYING) return;

    const gameBoardRect = currentGameBoard.getBoundingClientRect();
    const touchX = e.clientX - gameBoardRect.left;

    const paddleCenter = currentState.paddle.x + currentState.paddle.width / 2;
    const deadZoneHalf = (currentState.paddle.width * DEAD_ZONE_RATIO) / 2;
    const distance = touchX - paddleCenter;

    let dx = 0;
    if (Math.abs(distance) > deadZoneHalf) {
      dx = distance > 0 ? PADDLE_SPEED : -PADDLE_SPEED;
    }

    dispatch({ type: "SET_PADDLE_VELOCITY", payload: { dx } });
    e.preventDefault();
  }, [dispatch]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    // Stop paddle movement — no tap detection, no game commands
    dispatch({ type: "SET_PADDLE_VELOCITY", payload: { dx: 0 } });
    pointerStartRef.current = null;
    e.preventDefault();
  }, [dispatch]);

  useEffect(() => {
    const gameBoardElement = gameBoardRef.current;
    if (!gameBoardElement || !isMobile) return;

    gameBoardElement.addEventListener("pointerdown", handlePointerDown, { passive: false });
    gameBoardElement.addEventListener("pointermove", handlePointerMove, { passive: false });
    gameBoardElement.addEventListener("pointerup", handlePointerUp, { passive: false });
    gameBoardElement.addEventListener("pointercancel", handlePointerUp, { passive: false });

    return () => {
      gameBoardElement.removeEventListener("pointerdown", handlePointerDown);
      gameBoardElement.removeEventListener("pointermove", handlePointerMove);
      gameBoardElement.removeEventListener("pointerup", handlePointerUp);
      gameBoardElement.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isMobile, gameBoardRef, handlePointerDown, handlePointerMove, handlePointerUp]);
};
