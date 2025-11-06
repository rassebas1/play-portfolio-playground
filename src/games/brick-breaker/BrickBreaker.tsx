import React, { useRef, useEffect, useCallback } from 'react';
import { useBrickBreaker } from './hooks/useBrickBreaker';
import GameBoard from './components/GameBoard';
import { GameHeader } from '@/components/game/GameHeader';
import { Scoreboard } from '@/components/game/Scoreboard';
import { GameControls } from '@/components/game/GameControls';
import { GameOverModal } from '@/components/game/GameOverModal';
import { Instructions } from '@/components/game/Instructions';
import { GameStatus } from './types';
import { Button } from '@/components/ui/button';

const BrickBreaker: React.FC = () => {
  const { state, dispatch } = useBrickBreaker();

  const restartGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const isGameOver = state.gameStatus === GameStatus.GAME_OVER;
  const isWon = state.gameStatus === GameStatus.LEVEL_CLEARED; // Assuming LEVEL_CLEARED means won for the current level

  const paddleTouchOffset = useRef<number | null>(null);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (state.gameStatus !== GameStatus.PLAYING || !gameBoardRef.current) return;
    const touchX = e.touches[0].clientX;
    const gameBoardRect = gameBoardRef.current.getBoundingClientRect();
    paddleTouchOffset.current = touchX - (gameBoardRect.left + state.paddle.x);
    e.preventDefault(); // Prevent scrolling
  }, [state.gameStatus, state.paddle.x]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (state.gameStatus !== GameStatus.PLAYING || paddleTouchOffset.current === null || !gameBoardRef.current) return;
    const touchX = e.touches[0].clientX;
    const gameBoardRect = gameBoardRef.current.getBoundingClientRect();

    let newPaddleX = touchX - gameBoardRect.left - paddleTouchOffset.current;

    // Clamp paddle position within canvas boundaries
    newPaddleX = Math.max(
      0,
      Math.min(newPaddleX, state.canvas.width - state.paddle.width)
    );

    dispatch({ type: "UPDATE_PADDLE_POSITION", payload: { x: newPaddleX } });
    e.preventDefault(); // Prevent scrolling
  }, [state.gameStatus, state.canvas.width, state.paddle.width, dispatch]);

  const handleTouchEnd = useCallback(() => {
    paddleTouchOffset.current = null;
  }, []);

  useEffect(() => {
    const gameBoardElement = gameBoardRef.current;
    if (gameBoardElement) {
      gameBoardElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      gameBoardElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      gameBoardElement.addEventListener('touchend', handleTouchEnd, { passive: true }); // touchend can be passive

      return () => {
        gameBoardElement.removeEventListener('touchstart', handleTouchStart);
        gameBoardElement.removeEventListener('touchmove', handleTouchMove);
        gameBoardElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const handleGameControl = () => {
    if (state.gameStatus === GameStatus.IDLE) {
      dispatch({ type: "START_GAME" });
    } else if (state.gameStatus === GameStatus.PLAYING) {
      dispatch({ type: "PAUSE_GAME" });
    } else if (state.gameStatus === GameStatus.PAUSED) {
      dispatch({ type: "RESUME_GAME" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <GameHeader
        title="Brick Breaker"
        description="Break all the bricks to advance to the next level!"
      />
      <Scoreboard score={state.score} bestScore={0} /> {/* bestScore is placeholder for now */}
      <GameControls restartGame={restartGame} />

      <Instructions>
        <p>Use <strong>Arrow Left</strong> and <strong>Arrow Right</strong> to move the paddle.</p>
        <p>Press <strong>SPACEBAR</strong> to start, pause, or resume the game.</p>
        <p>Press <strong>R</strong> to reset the game.</p>
      </Instructions>

      <div
        ref={gameBoardRef}
        className="touch-none relative"
        style={{ width: state.canvas.width, height: state.canvas.height }}
      >
        <GameBoard state={state} />
      </div>

      <Button onClick={handleGameControl} className="mt-4 w-48">
        {state.gameStatus === GameStatus.IDLE && "Start Game"}
        {state.gameStatus === GameStatus.PLAYING && "Pause Game"}
        {state.gameStatus === GameStatus.PAUSED && "Resume Game"}
      </Button>

      {isGameOver && (
        <GameOverModal
          isGameOver={isGameOver}
          isWon={isWon}
          score={state.score}
          bestScore={0} // bestScore is placeholder for now
          restartGame={restartGame}
        />
      )}
    </div>
  );
};

export default BrickBreaker;
