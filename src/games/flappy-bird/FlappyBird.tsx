import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, Play, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            🐦 Flappy Bird
          </h1>
          <p className="text-muted-foreground text-lg">
            Navigate through the pipes and set a high score!
          </p>
        </div>

        {/* Score Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Score</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary">
                {gameState.score}
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4" />
                Best
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-accent">
                {gameState.bestScore}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          <Button
            onClick={goHome}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
          
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
        {gameState.isGameOver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="text-center max-w-sm w-full bg-gradient-to-br from-destructive/20 to-destructive/10 border-destructive/30">
              <CardHeader>
                <CardTitle className="text-2xl text-destructive">
                  💥 Game Over!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-lg font-semibold">Final Score</p>
                  <p className="text-3xl font-bold text-primary">
                    {gameState.score}
                  </p>
                  {gameState.score === gameState.bestScore && gameState.score > 0 && (
                    <Badge className="mt-2 bg-accent text-accent-foreground">
                      New Best! 🏆
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={restartGame}
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
        )}
      </div>
    </div>
  );
};

export default FlappyBird;