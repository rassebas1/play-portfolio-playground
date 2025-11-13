import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, Undo2, PlayCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { use2048 } from './hooks/use2048';
import  GameBoard  from './components/GameBoard';
import { cn } from '@/lib/utils';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

import { GameHeader } from '@/components/game/GameHeader';
import { Scoreboard } from '@/components/game/Scoreboard';
import { GameControls } from '@/components/game/GameControls';
import { Instructions } from '@/components/game/Instructions';

import { GameOverModal } from '@/components/game/GameOverModal';

/**
 * Main 2048 Game Component.
 * This component orchestrates the 2048 game by integrating the `use2048` hook for game logic,
 * rendering the game board, controls, and displaying game status and scores.
 */
const Game2048: React.FC = () => {
  // Destructure state and functions from the custom use2048 hook
  // isGameOver: boolean indicating if the game is over
  // isWon: boolean indicating if the player has reached 2048
  // makeMove: function to move tiles in a given direction
  // restartGame: function to reset and start a new game
  // undoMove: function to undo the last move
  // continueGame: function to continue playing after winning
  // animatedTiles: array of tiles for rendering
  // score: current game score
  // highScore: the highest score recorded for this game
  // canUndo: boolean indicating if an undo operation is possible
  const { isGameOver, isWon, makeMove, restartGame, undoMove, continueGame, animatedTiles, score, highScore, canUndo } = use2048();
  // useNavigate hook from react-router-dom for navigation
  const navigate = useNavigate();

  // Integrate useSwipeGesture hook for touch-based input on the game board
  // onSwipe callback calls makeMove with the detected direction
  const { onTouchStart, onTouchEnd } = useSwipeGesture({
    onSwipe: (direction) => {
      if (direction) {
        makeMove(direction); // Trigger a game move based on swipe direction
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Game Header: Displays the game title and a brief description */}
        <GameHeader 
          title="2048"
          description={<>
            Join the tiles, get to <span className="text-accent font-semibold">2048!</span>
          </>}
        />

        {/* Score Section: Displays current score and the highest score */}
        {/* score: current game score */}
        {/* bestScore: highest score recorded for the game (defaults to 0 if null) */}
        <Scoreboard score={score} bestScore={highScore ?? 0} />

        {/* Game Controls: Buttons for restarting, undoing, etc. */}
        {/* restartGame: function to restart the game */}
        {/* undoMove: function to undo the last move */}
        {/* canUndo: boolean to enable/disable the undo button */}
        <GameControls restartGame={restartGame} undoMove={undoMove} canUndo={canUndo} />

        {/* Game Board: Renders the 2048 tiles, integrates swipe gestures */}
        <div className="flex justify-center mb-6">
          <div
            onTouchStart={onTouchStart} // Attach touch start event for swipe detection
            onTouchEnd={onTouchEnd}     // Attach touch end event for swipe detection
            className="touch-none"      // Prevents default browser touch behaviors like scrolling
          >
            <GameBoard animatedTiles={animatedTiles} />
          </div>
        </div>

        {/* Instructions: Provides guidance on how to play the game */}
        <Instructions>
          <p className="text-sm text-muted-foreground text-center">
            <span className="hidden sm:inline">Use arrow keys or </span>
            <span className="sm:hidden">Swipe or tap buttons to </span>
            move tiles. Combine tiles with the same number to reach <span className="text-accent font-semibold">2048</span>!
          </p>
        </Instructions>

        {/* Game Over Modal: Displays when the game is over or won */}
        <GameOverModal 
          isGameOver={isGameOver} // True if game is over
          isWon={isWon}          // True if the player has won
          score={score}          // Final score of the game
          bestScore={highScore ?? 0} // Highest score recorded
          canContinue={true}     // Allows continuing after winning
          continueGame={continueGame} // Function to continue playing
          restartGame={restartGame} // Function to restart the game
        />
      </div>
    </div>
  );
};

export default Game2048;