import React from 'react';
import { useBrickBreaker } from './hooks/useBrickBreaker';
import GameBoard from './components/GameBoard';
import { GameHeader } from '@/components/game/GameHeader';
import { Scoreboard } from '@/components/game/Scoreboard';
import { GameControls } from '@/components/game/GameControls';
import { GameOverModal } from '@/components/game/GameOverModal';
import { Instructions } from '@/components/game/Instructions';
import { GameStatus } from './types';

const BrickBreaker: React.FC = () => {
  const { state, dispatch } = useBrickBreaker();

  const restartGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const isGameOver = state.gameStatus === GameStatus.GAME_OVER;
  const isWon = state.gameStatus === GameStatus.LEVEL_CLEARED; // Assuming LEVEL_CLEARED means won for the current level

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

      <GameBoard state={state} />

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
