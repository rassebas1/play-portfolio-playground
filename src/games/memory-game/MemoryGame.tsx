/**
 * src/games/memory-game/MemoryGame.tsx
 *
 * Main component for the Memory Game.
 * This component orchestrates the game by integrating the `useMemoryGame` hook for game logic,
 * rendering the game board, controls, and displaying game status and scores.
 */
import React from 'react';
import { useMemoryGame } from './hooks/useMemoryGame';
import GameBoard from './components/GameBoard';
import { Difficulty } from './types';
import { GameHeader } from '@/components/game/GameHeader';
import { GameOverModal } from '@/components/game/GameOverModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Scoreboard } from '@/components/game/Scoreboard';

/**
 * React functional component for the Memory Game.
 *
 * @returns {JSX.Element} The rendered Memory Game component.
 */
const MemoryGame: React.FC = () => {
  const { state, startGame, flipCard, resetGame, highScore } = useMemoryGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        <GameHeader
          title="Memory Game"
          description="Test your memory by matching pairs of hidden cards."
        />
        <div>
          <Scoreboard score={state.timer} bestScore={highScore ?? 0} />

          {/* Card for displaying current game time */}
          <Card className="text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Time</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary">
                {state.timer.toLocaleString()}s
              </div>
            </CardContent>
          </Card>

          {/* Card for displaying the best recorded time (high score) */}
          <Card className="text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4" />
                Best Time
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-accent">
                {/* Displays best time or '--' if no high score is set */}
                {highScore !== null ? `${highScore.toLocaleString()}s` : '--'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Controls: Difficulty selection and Start/Reset buttons */}
        <div className="flex justify-center items-center my-4 space-x-4">
          {/* Difficulty Selector */}
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
          {/* Start Game or Reset Game Button based on game status */}
          {state.gameStatus === 'idle' || state.gameStatus === 'won' ? (
            <Button onClick={() => startGame(state.difficulty)}>Start Game</Button>
          ) : (
            <Button onClick={resetGame}>Reset Game</Button>
          )}
        </div>

        {/* Game Board: Renders the cards if the game is playing */}
        {state.gameStatus === 'playing' && <GameBoard state={state} onCardClick={flipCard} />}

        <GameOverModal
          isGameOver={state.gameStatus === 'won'}
          isWon={true}
          score={state.timer}
          bestScore={highScore ?? 0}
          restartGame={resetGame}
        />
      </div>
    </div>
  );
};
export default MemoryGame;
