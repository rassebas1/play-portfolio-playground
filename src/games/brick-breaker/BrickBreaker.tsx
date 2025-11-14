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
  // Ref to the game board DOM element, used for calculating touch positions
  const gameBoardRef = useRef<HTMLDivElement>(null);

  // Destructure state, dispatch function, and high score from the custom useBrickBreaker hook
  // state: current game state (paddle, ball, bricks, score, lives, etc.)
  // dispatch: reducer's dispatch function for sending actions
  // highScore: the highest score recorded for this game
  const { state, dispatch, highScore } = useBrickBreaker(gameBoardRef);
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
