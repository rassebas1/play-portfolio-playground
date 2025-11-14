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
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

/**
 * Main Brick Breaker Game Component.
 * This component orchestrates the Brick Breaker game by integrating the `useBrickBreaker` hook for game logic,
 * rendering the game board, controls, and displaying game status and scores.
 */
const BrickBreaker: React.FC = () => {
  // Destructure state, dispatch function, and high score from the custom useBrickBreaker hook
  // state: current game state (paddle, ball, bricks, score, lives, etc.)
  // dispatch: reducer's dispatch function for sending actions
  // highScore: the highest score recorded for this game
  const { state, dispatch, highScore, onTouchStart, onTouchEnd } = useBrickBreaker();
  const isMobile = useIsMobile(); // Determine if the device is mobile

  /**
   * Resets the game to its initial state.
   * @returns {void}
   */
  const restartGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  // Determine if the game is over
  const isGameOver = state.gameStatus === GameStatus.GAME_OVER;
  // Determine if the current level is cleared (assuming this is a "win" for the level)
  const isWon = state.gameStatus === GameStatus.LEVEL_CLEARED; 

  // Ref to the game board DOM element, used for calculating touch positions
  const gameBoardRef = useRef<HTMLDivElement>(null);

  // Effect to add and remove touch event listeners to the game board.
  useEffect(() => {
    const gameBoardElement = gameBoardRef.current;
    if (gameBoardElement && isMobile) {
      // Add touch event listeners from useSwipeGesture
      gameBoardElement.addEventListener('touchstart', onTouchStart, { passive: false });
      gameBoardElement.addEventListener('touchend', onTouchEnd, { passive: true });

      // Cleanup function: remove event listeners on unmount
      return () => {
        gameBoardElement.removeEventListener('touchstart', onTouchStart);
        gameBoardElement.removeEventListener('touchend', onTouchEnd);
      };
    }
  }, [isMobile, onTouchStart, onTouchEnd]); // Dependencies for effect re-run

  /**
   * Handles game control actions (start, pause, resume) based on current game status.
   * @returns {void}
   */
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
    <div className="flex flex-col items-center p-4 min-h-screen">
      {/* Game Header: Displays the game title and a brief description */}
      <GameHeader
        title="Brick Breaker"
        description="Break all the bricks to advance to the next level!"
        lives={state.lives}
        level={state.level}
      />
      {/* Scoreboard: Displays current score and the highest score */}
      {/* score: current game score */}
      {/* bestScore: highest score recorded for this game (defaults to 0 if null) */}
      <Scoreboard score={state.score} bestScore={highScore ?? 0} />
      {/* Game Controls: Buttons for restarting, etc. */}
      {/* restartGame: function to restart the game */}
      <GameControls restartGame={restartGame} />

      {/* Instructions: Provides guidance on how to play the game */}
      <Instructions>
        <p>Use <strong>Arrow Left</strong> and <strong>Arrow Right</strong> to move the paddle.</p>
        <p>Press <strong>SPACEBAR</strong> to start, pause, or resume the game.</p>
        <p>Press <strong>R</strong> to reset the game.</p>
      </Instructions>

      {/* Game Board: The main canvas where the game is played, integrates touch input */}
      <div
        ref={gameBoardRef} // Attach ref to the game board element
        className="touch-none relative my-4" // Prevents default browser touch behaviors, add vertical margin
        style={{ width: state.canvas.width, height: state.canvas.height }}
      >
        <GameBoard state={state} />
      </div>

      {/* Main Game Control Button: Changes text based on game status */}
      <Button onClick={handleGameControl} className="mt-4 w-48">
        {state.gameStatus === GameStatus.IDLE && "Start Game"}
        {state.gameStatus === GameStatus.PLAYING && "Pause Game"}
        {state.gameStatus === GameStatus.PAUSED && "Resume Game"}
      </Button>

      {/* Game Over Modal: Displays when the game is over */}
      {isGameOver && (
        <GameOverModal
          isGameOver={isGameOver} // True if game is over
          isWon={isWon} // True if the current level is cleared
          score={state.score} // Final score of the game
          bestScore={highScore ?? 0} // Highest score recorded
          restartGame={restartGame} // Function to restart the game
        />
      )}
    </div>
  );
};

export default BrickBreaker;
