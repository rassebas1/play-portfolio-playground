import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, PlayCircle, Home } from 'lucide-react';
import { cn } from '@/lib/utils'; // Utility for conditionally joining class names
import { useNavigate } from 'react-router-dom';

/**
 * Props for the GameOverModal component.
 * @interface GameOverModalProps
 * @property {boolean} isGameOver - True if the game is over (either won or lost).
 * @property {boolean} isWon - True if the game was won, false if lost.
 * @property {number} score - The final score achieved in the game.
 * @property {number} bestScore - The highest score recorded for this game.
 * @property {boolean} [canContinue=false] - Optional: True if there's an option to continue playing after winning (e.g., in 2048).
 * @property {() => void} [continueGame] - Optional: Callback function to continue the game if `canContinue` is true.
 * @property {() => void} restartGame - Callback function to restart the game.
 */
interface GameOverModalProps {
  isGameOver: boolean;
  isWon: boolean;
  score: number;
  bestScore: number;
  canContinue?: boolean;
  continueGame?: () => void;
  restartGame: () => void;
}

/**
 * GameOverModal component.
 * Displays a modal overlay when a game ends, showing the result (win/loss),
 * final score, and options to continue, play again, or go home.
 *
 * @param {GameOverModalProps} props - Props passed to the component.
 * @returns {JSX.Element | null} The rendered modal or null if the game is not over.
 */
export const GameOverModal: React.FC<GameOverModalProps> = ({
  isGameOver,
  isWon,
  score,
  bestScore,
  canContinue = false, // Default to false
  continueGame,
  restartGame,
}) => {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Navigates to the '/games' route (main games listing page).
   * @returns {void}
   */
  const goHome = () => {
    navigate('/games');
  };

  // If the game is not over, don't render the modal
  if (!isGameOver) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className={cn(
        "text-center max-w-sm w-full",
        // Dynamic background and border based on win/loss status
        isWon
          ? "bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30" 
          : "bg-gradient-to-br from-destructive/20 to-destructive/10 border-destructive/30"
      )}>
        <CardHeader>
          <CardTitle className={cn(
            "text-2xl",
            // Dynamic text color based on win/loss status
            isWon
              ? "text-accent" 
              : "text-destructive"
          )}>
            {isWon ? "🎉 You Win!" : "💔 Game Over"} {/* Display win or game over message */}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-lg font-semibold">Final Score</p>
            <p className="text-3xl font-bold text-primary">
              {score.toLocaleString()} {/* Display final score */}
            </p>
            {/* Display "New Best!" badge if current score is the best score */}
            {score === bestScore && (
              <Badge className="mt-2 bg-accent text-accent-foreground">
                New Best! 🏆
              </Badge>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            {/* Continue Button: Conditionally rendered if canContinue is true and game was won */}
            {canContinue && isWon && (
              <Button
                onClick={continueGame} // Attach continue game handler
                className="gap-2"
              >
                <PlayCircle className="w-4 h-4" /> {/* Icon for continue */}
                Continue
              </Button>
            )}
            {/* Play Again Button */}
            <Button
              onClick={restartGame} // Attach restart game handler
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" /> {/* Icon for play again */}
              Play Again
            </Button>
            {/* Home Button */}
            <Button
              onClick={goHome} // Attach go home handler
              variant="outline"
              className="gap-2"
            >
              <Home className="w-4 h-4" /> {/* Icon for home */}
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};