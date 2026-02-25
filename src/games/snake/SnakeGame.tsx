import { useSnakeGame } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import { Button } from '@/components/ui/button';
import { Scoreboard } from '@/components/game/Scoreboard';
import { GameOverModal } from '@/components/game/GameOverModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { Direction, Difficulty } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

/**
 * Main component for the Snake game.
 * This component orchestrates the game by integrating the `useSnakeGame` hook for game logic,
 * rendering the game board, controls, and displaying game status and scores.
 */
const SnakeGame: React.FC = () => {
  const { state, startGame, resetGame, dispatch, setDifficulty, highScore } = useSnakeGame();
  const { score, gameOver, gameStarted, difficulty } = state;
  const { t } = useTranslation('games/snake');

  /**
   * Handles swipe gestures on the game board to change the snake's direction.
   * @param {'up' | 'down' | 'left' | 'right' | null} direction - The detected swipe direction.
   * @returns {void}
   */
  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right' | null) => {
    // Only allow swipe input if the game has started, is not over, and a direction is provided
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

    // If a valid new direction is determined, dispatch the CHANGE_DIRECTION action
    if (newDirection) {
      dispatch({ type: 'CHANGE_DIRECTION', payload: newDirection });
    }
  };

  // Integrate useSwipeGesture hook for touch-based input
  // onTouchStart: event handler for touch start
  // onTouchEnd: event handler for touch end
  const { onTouchStart, onTouchEnd } = useSwipeGesture({ onSwipe: handleSwipe });

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-2">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Scoreboard score={score} bestScore={highScore || 0} /> {/* Pass highScore to Scoreboard */}

          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="difficulty-select" className="text-lg">{t('difficulty.label')}:</label>
            <Select onValueChange={(value) => setDifficulty(Number(value) as Difficulty)} value={String(difficulty)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={t('difficulty.label')} />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                  <SelectItem key={level} value={String(level)}>{t(`difficulty.${level}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Game Board: Renders the snake and food, integrates swipe gestures */}
          <div
            onTouchStart={onTouchStart} // Attach touch start event for swipe detection
            onTouchEnd={onTouchEnd}     // Attach touch end event for swipe detection
            className="touch-none"      // Prevents default browser touch behaviors like scrolling
          >
            <GameBoard gameState={state} />
          </div>

          {/* Game Controls and Status Messages */}
          <div className="mt-4">
            <>
              {!gameStarted && !gameOver && (
                <Button
                  onClick={() => startGame(difficulty)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  {t('actions.start')}
                </Button>
              )}

              {gameOver && (
                <GameOverModal isGameOver={gameOver} isWon={false} score={score} bestScore={highScore || 0} restartGame={resetGame} />
              )}

              {gameStarted && !gameOver && (
                <p className="text-gray-400">{t('instructions.desktop')}</p>
              )}
            </>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SnakeGame;
