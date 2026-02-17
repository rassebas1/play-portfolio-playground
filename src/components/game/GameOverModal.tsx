import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, PlayCircle, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  canContinue = false,
  continueGame,
  restartGame,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const goHome = () => {
    navigate('/games');
  };

  if (!isGameOver) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className={cn(
        "text-center max-w-sm w-full",
        isWon
          ? "bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30" 
          : "bg-gradient-to-br from-destructive/20 to-destructive/10 border-destructive/30"
      )}>
        <CardHeader>
          <CardTitle className={cn(
            "text-2xl",
            isWon
              ? "text-accent" 
              : "text-destructive"
          )}>
            {isWon ? `🎉 ${t('game_over.win_title')}` : `💔 ${t('game_over.lose_title')}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-lg font-semibold">{t('game_over.final_score')}</p>
            <p className="text-3xl font-bold text-primary">
              {score.toLocaleString()}
            </p>
            {score === bestScore && (
              <Badge className="mt-2 bg-accent text-accent-foreground">
                {t('game_over.new_best')} 🏆
              </Badge>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            {canContinue && isWon && (
              <Button
                onClick={continueGame}
                className="gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                {t('game_over.continue')}
              </Button>
            )}
            <Button
              onClick={restartGame}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t('game_over.play_again')}
            </Button>
            <Button
              onClick={goHome}
              variant="outline"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              {t('game_over.home')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};