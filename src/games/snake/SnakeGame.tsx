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
 * This component orchestrates the game by integrating the `useSnakeGame` hook for game logic,
 * rendering the game board, controls, and displaying game status and scores.
 */
const SnakeGame: React.FC = () => {
  // Destructure state and functions from the custom useSnakeGame hook
  // state: current game state (snake position, food, score, game over status, etc.)
  // startGame: function to initiate the game
  // resetGame: function to reset the game
  // dispatch: reducer's dispatch function for sending actions
  // highScore: the highest score recorded for this game
  const { state, startGame, resetGame, dispatch, highScore } = useSnakeGame();
  // Destructure specific state variables for easier access
  const { score, gameOver, gameStarted } = state;

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
          <CardTitle className="text-4xl font-bold mb-2">Snake Game</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {/* Scoreboard: Displays current score and the highest score */}
          {/* score: current game score */}
          {/* bestScore: highest score recorded for the game (defaults to 0 if null) */}
          <Scoreboard score={score} bestScore={highScore ?? 0} />

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
            {/* Start Game Button: Shown when the game has not started and is not over */}
            {!gameStarted && !gameOver && (
              <Button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Start Game
              </Button>
            )}

            {/* Game Over Modal: Displays when the game is over */}
            {gameOver && (
              <GameOverModal 
                isGameOver={gameOver} // True if game is over
                isWon={false}        // Snake game doesn't have a "win" state
                score={score}        // Final score of the game
                bestScore={highScore ?? 0} // Highest score recorded
                restartGame={resetGame} // Function to restart the game
              />
            )}

            {/* Instructions for movement: Shown when game is started but not over */}
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
