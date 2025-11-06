
import React from 'react';
import { useMemoryGame } from './hooks/useMemoryGame';
import GameBoard from './components/GameBoard';
import { Difficulty } from './types';
import { GameHeader } from '@/components/game/GameHeader';
import { Scoreboard } from '@/components/game/Scoreboard';
import { GameControls } from '@/components/game/GameControls';
import { GameOverModal } from '@/components/game/GameOverModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const MemoryGame: React.FC = () => {
  const { state, startGame, flipCard, resetGame } = useMemoryGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        <GameHeader 
          title="Memory Game"
          description="Test your memory by matching pairs of hidden cards."
        />

        <Scoreboard score={state.moves} bestScore={0} />

        <div className="flex justify-center items-center my-4 space-x-4">
          <Select onValueChange={(value) => startGame(value as Difficulty)} defaultValue={state.difficulty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Difficulty.Easy}>Easy</SelectItem>
              <SelectItem value={Difficulty.Medium}>Medium</SelectItem>
              <SelectItem value={Difficulty.Hard}>Hard</SelectItem>
            </SelectContent>
          </Select>
          {state.gameStatus === 'idle' || state.gameStatus === 'won' ? (
            <Button onClick={() => startGame(state.difficulty)}>Start Game</Button>
          ) : (
            <Button onClick={resetGame}>Reset Game</Button>
          )}
        </div>

        {state.gameStatus === 'playing' && <GameBoard state={state} onCardClick={flipCard} />}

        <GameOverModal 
          isGameOver={state.gameStatus === 'won'}
          isWon={true}
          score={state.moves}
          bestScore={0}
          restartGame={resetGame}
        />
      </div>
    </div>
  );
};

export default MemoryGame;
