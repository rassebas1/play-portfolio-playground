import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, Play, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GameHeader } from '@/components/game/GameHeader';
import { Scoreboard } from '@/components/game/Scoreboard';
import { GameOverModal } from '@/components/game/GameOverModal';
import { useFlappyBird } from './hooks/useFlappyBird';
import GameArea from './components/GameArea';
import { cn } from '@/lib/utils';

/**
 * Main Flappy Bird Game Component
 * Integrates the game area, controls, and state management
 */
const FlappyBird: React.FC = () => {
  const { gameState, gameDimensions, jump, startNewGame, restartGame } = useFlappyBird();
  const navigate = useNavigate();

  /**
   * Navigates back to the main portfolio page
   */
  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-sky-200 to-blue-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <GameHeader 
          title="🐦 Flappy Bird"
          description="Navigate through the pipes and set a high score!"
        />

        {/* Score Section */}
        <Scoreboard score={gameState.score} bestScore={gameState.bestScore} />

        {/* Game Controls */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          
          
          <Button
            onClick={startNewGame}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            New Game
          </Button>

          {gameState.gameStarted && (
            <Badge variant="secondary" className="px-3 py-1">
              Score: {gameState.score}
            </Badge>
          )}
        </div>

        {/* Game Area */}
        <div className="flex justify-center mb-6">
          <GameArea
            gameState={gameState}
            dimensions={gameDimensions}
            onJump={jump}
          />
        </div>

        {/* Instructions */}
        <Card className="mb-6 bg-muted/30 border-primary/10">
          <CardContent className="pt-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Desktop:</span> Press SPACE or ↑ arrow key to jump
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Mobile:</span> Tap the game area to jump
              </p>
              <p className="text-xs text-muted-foreground/80">
                Navigate through the pipes without hitting them or the ground!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Game Over Modal */}
        <GameOverModal
          isGameOver={gameState.isGameOver}
          isWon={false} // Flappy Bird doesn't have a "win" state
          score={gameState.score}
          bestScore={gameState.bestScore}
          restartGame={restartGame}
        />
      </div>
    </div>
  );
};

export default FlappyBird;