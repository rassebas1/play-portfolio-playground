import { useSnakeGame } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import { Button } from '@/components/ui/button';
import { Scoreboard } from '@/components/game/Scoreboard';
import { GameOverModal } from '@/components/game/GameOverModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { Direction } from './types';

/**
 * Main component for the Snake game.
 * Manages game state and renders the game board and controls.
 */
const SnakeGame: React.FC = () => {
  const { state, startGame, resetGame, dispatch } = useSnakeGame();
  const { score, gameOver, gameStarted } = state;

  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right' | null) => {
    if (!gameStarted || gameOver || !direction) return;

    let newDirection: Direction | undefined;
    switch (direction) {
      case 'up':
        newDirection = 'UP';
        break;
      case 'down':
        newDirection = 'DOWN';
        break;
      case 'left':
        newDirection = 'LEFT';
        break;
      case 'right':
        newDirection = 'RIGHT';
        break;
    }

    if (newDirection) {
      dispatch({ type: 'CHANGE_DIRECTION', payload: newDirection });
    }
  };

  const { onTouchStart, onTouchEnd } = useSwipeGesture({ onSwipe: handleSwipe });

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-2">Snake Game</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Scoreboard score={score} bestScore={0} />

          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="touch-none"
          >
            <GameBoard gameState={state} />
          </div>

          <div className="mt-4">
            {!gameStarted && !gameOver && (
              <Button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Start Game
              </Button>
            )}

            {gameOver && (
              <GameOverModal isGameOver={gameOver} isWon={false} score={score} bestScore={0} restartGame={resetGame} />
            )}

            {gameStarted && !gameOver && (
              <p className="text-gray-400">Use Arrow Keys to Move</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SnakeGame;
