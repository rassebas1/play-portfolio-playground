import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, Undo2, PlayCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { use2048 } from './hooks/use2048';
import  GameBoard  from './components/GameBoard';
import { cn } from '@/lib/utils';

import { GameHeader } from '@/components/game/GameHeader';
import { Scoreboard } from '@/components/game/Scoreboard';
import { GameControls } from '@/components/game/GameControls';
import { Instructions } from '@/components/game/Instructions';

import { GameOverModal } from '@/components/game/GameOverModal';

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
        <GameHeader 
          title="2048"
          description={<>
            Join the tiles, get to <span className="text-accent font-semibold">2048!</span>
          </>}
        />

        {/* Score Section */}
        <Scoreboard score={score} bestScore={highScore} />

        {/* Game Controls */}
        <GameControls restartGame={restartGame} undoMove={undoMove} canUndo={canUndo} />

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



        {/* Instructions */}
        <Instructions>
          <p className="text-sm text-muted-foreground text-center">
            <span className="hidden sm:inline">Use arrow keys or </span>
            <span className="sm:hidden">Swipe or tap buttons to </span>
            move tiles. Combine tiles with the same number to reach <span className="text-accent font-semibold">2048</span>!
          </p>
        </Instructions>

        {/* Game Over Modal */}
        <GameOverModal 
          isGameOver={isGameOver} 
          isWon={isWon} 
          score={score} 
          bestScore={highScore} 
          canContinue={true}
          continueGame={continueGame}
          restartGame={restartGame} 
        />
      </div>
    </div>
  );
};

export default Game2048;