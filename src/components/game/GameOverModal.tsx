import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, PlayCircle, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface GameOverModalProps {
  isGameOver: boolean;
  isWon: boolean;
  score: number;
  bestScore: number;
  canContinue?: boolean;
  continueGame?: () => void;
  restartGame: () => void;
}

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

  const goHome = () => {
    navigate('/');
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
            {isWon ? "🎉 You Win!" : "💔 Game Over"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-lg font-semibold">Final Score</p>
            <p className="text-3xl font-bold text-primary">
              {score.toLocaleString()}
            </p>
            {score === bestScore && (
              <Badge className="mt-2 bg-accent text-accent-foreground">
                New Best! 🏆
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
                Continue
              </Button>
            )}
            <Button
              onClick={restartGame}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
            <Button
              onClick={goHome}
              variant="outline"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};