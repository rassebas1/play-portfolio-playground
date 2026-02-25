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
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

/**
 * Main Brick Breaker Game Component.
 * This component orchestrates the Brick Breaker game by integrating the `useBrickBreaker` hook for game logic,
 * rendering the game board, controls, and displaying game status and scores.
 */
const BrickBreaker: React.FC = () => {
  const gameBoardRef = useRef<HTMLDivElement>(null);
  const { state, dispatch, highScore } = useBrickBreaker(gameBoardRef);
  const { t } = useTranslation('games/brick-breaker');
  const isMobile = useIsMobile();

  /**
   * Resets the game to its initial state.
   * @returns {void}
   */
  const restartGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const isGameOver = state.gameStatus === GameStatus.GAME_OVER;
  const isWon = state.gameStatus === GameStatus.LEVEL_CLEARED; // Dependencies for effect re-run

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
        title={t('title')}
        description={t('description')}
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
        <p><strong>Arrow Left</strong> / <strong>Arrow Right</strong>: {isMobile ? t('instructions.mobile') : t('instructions.desktop')}</p>
        <p><strong>SPACEBAR</strong>: {t('actions.start')} / {t('status.paused')} / {t('actions.resume')}</p>
        <p><strong>R</strong>: {t('actions.restart')}</p>
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
        {state.gameStatus === GameStatus.IDLE && t('actions.start')}
        {state.gameStatus === GameStatus.PLAYING && t('actions.pause')}
        {state.gameStatus === GameStatus.PAUSED && t('actions.resume')}
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
