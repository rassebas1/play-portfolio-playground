import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, Undo2, PlayCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { use2048 } from './hooks/use2048';
import GameBoard from './components/GameBoard';
import { cn } from '@/lib/utils';

/**
 * Main 2048 Game Component
 * Integrates the game board, controls, and state management
 */
const Game2048: React.FC = () => {
  const { isGameOver, isWon, makeMove, restartGame, undoMove, continueGame, animatedTiles, score, highScore, canUndo } = use2048();
  const navigate = useNavigate();
  /**
   * Handles swipe gestures for mobile play
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    e.currentTarget.setAttribute('data-start-x', touch.clientX.toString());
    e.currentTarget.setAttribute('data-start-y', touch.clientY.toString());
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const startX = parseFloat(e.currentTarget.getAttribute('data-start-x') || '0');
    const startY = parseFloat(e.currentTarget.getAttribute('data-start-y') || '0');
    
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        makeMove(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        makeMove(deltaY > 0 ? 'down' : 'up');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            2048
          </h1>
          <p className="text-muted-foreground text-lg">
            Join the tiles, get to <span className="text-accent font-semibold">2048!</span>
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
                {score.toLocaleString()}
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
                {highScore.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          

          <Button
            onClick={restartGame}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </Button>
          
          <Button
            onClick={undoMove}
            disabled={!canUndo}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Undo2 className="w-4 h-4" />
            Undo
          </Button>
        </div>

        {/* Game Board */}
        <div className="flex justify-center mb-6">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="touch-none"
          >
            <GameBoard animatedTiles={animatedTiles} />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="block sm:hidden mb-6">
          <div className="text-center text-sm text-muted-foreground mb-3">
            Swipe or use buttons to move
          </div>
          <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
            <div className="col-start-2">
              <Button
                onClick={() => makeMove('up')}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isGameOver}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={() => makeMove('left')}
              variant="outline"
              size="sm"
              disabled={isGameOver}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => makeMove('down')}
              variant="outline"
              size="sm"
              disabled={isGameOver}
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => makeMove('right')}
              variant="outline"
              size="sm"
              disabled={isGameOver}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-6 bg-muted/30 border-primary/10">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground text-center">
              <span className="hidden sm:inline">Use arrow keys or </span>
              <span className="sm:hidden">Swipe or tap buttons to </span>
              move tiles. Combine tiles with the same number to reach <span className="text-accent font-semibold">2048</span>!
            </p>
          </CardContent>
        </Card>

        {/* Game Over Modal */}
        {(isGameOver || isWon) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className={cn(
              "text-center max-w-sm w-full",
              isWon && !isGameOver 
                ? "bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30" 
                : "bg-gradient-to-br from-destructive/20 to-destructive/10 border-destructive/30"
            )}>
              <CardHeader>
                <CardTitle className={cn(
                  "text-2xl",
                  isWon && !isGameOver 
                    ? "text-accent" 
                    : "text-destructive"
                )}>
                  {isWon && !isGameOver ? "🎉 You Win!" : "💔 Game Over"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-lg font-semibold">Final Score</p>
                  <p className="text-3xl font-bold text-primary">
                    {score.toLocaleString()}
                  </p>
                  {score === highScore && (
                    <Badge className="mt-2 bg-accent text-accent-foreground">
                      New Best! 🏆
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  {isWon && !isGameOver && (
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
                  
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game2048;