import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { use2048 } from './hooks/use2048';
import GameBoard from './components/GameBoard';
import { cn } from '@/lib/utils';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { Leaderboard } from '@/components/ui/Leaderboard';

import { GameHeader } from '@/components/game/GameHeader';
import { Scoreboard } from '@/components/game/Scoreboard';
import { GameControls } from '@/components/game/GameControls';
import { Instructions } from '@/components/game/Instructions';
import { GameOverModal } from '@/components/game/GameOverModal';
import { WinCelebrationOverlay } from '@/components/game/WinCelebrationOverlay';
import { GameSession, createGameSession } from '@/types/highScores';

/**
 * Main 2048 Game Component.
 * This component orchestrates the 2048 game by integrating the `use2048` hook for game logic,
 * rendering the game board, controls, and displaying game status and scores.
 * Features celebration overlay when reaching 2048 and option to continue playing.
 */
const Game2048: React.FC = () => {
  const { t } = useTranslation('games/2048');
  
  // Destructure state and functions from the custom use2048 hook
  const { 
    isGameOver, 
    isWon, 
    makeMove, 
    restartGame, 
    undoMove, 
    continueGame, 
    animatedTiles, 
    score, 
    highScore, 
    highestTile,
    bestHighestTile,
    canUndo 
  } = use2048();
  
  // State for celebration and modal visibility
  const [showCelebration, setShowCelebration] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [session, setSession] = useState<GameSession | null>(null);
  const prevIsWonRef = useRef(false);

  // Session tracking
  useEffect(() => {
    const gameStarted = score > 0 || highestTile > 0;
    if (gameStarted && !session) {
      setSession(createGameSession('2048'));
    }
    if (!gameStarted && !isGameOver) {
      setSession(null);
    }
  }, [score, highestTile, isGameOver, session]);

  // Track moves by watching score changes (each move increases score in 2048)
  useEffect(() => {
    if (session && score > 0) {
      setSession(prev => prev ? { ...prev, moves: prev.moves + 1 } : null);
    }
  }, [score]);

  // Integrate useSwipeGesture hook for touch-based input on the game board
  const { onTouchStart, onTouchEnd } = useSwipeGesture({
    onSwipe: (direction) => {
      if (direction) {
        makeMove(direction);
      }
    },
  });

  // Trigger celebration when player first reaches 2048 (isWon becomes true)
  useEffect(() => {
    if (isWon && !prevIsWonRef.current && !showCelebration) {
      setShowCelebration(true);
    }
    prevIsWonRef.current = isWon;
  }, [isWon, showCelebration]);

  // Handle celebration completion - show continue choice modal
  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setShowContinueModal(true);
  };

  // Handle continue playing choice
  const handleContinue = () => {
    continueGame();
    setShowContinueModal(false);
  };

  // Handle restart choice
  const handleRestart = () => {
    restartGame();
    setShowContinueModal(false);
  };

  // Check if current highest tile is a new record
  const isNewHighestTile = highestTile > 0 && highestTile > (bestHighestTile ?? 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Game Header: Displays the game title and a brief description */}
        <GameHeader 
          title={t('title')}
          description={t('description')}
        />

        {/* Score Section: Displays current score, best score, and highest tile */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Current Score */}
          <Card className="text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t('scoreboard.score')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary">
                {score.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Best Score */}
          <Card className="text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4" />
                {t('scoreboard.best')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-accent">
                {(highScore ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Highest Tile */}
          <Card className={cn(
            "text-center border-yellow-500/20",
            isNewHighestTile 
              ? "bg-gradient-to-br from-yellow-400/20 to-orange-400/20 animate-pulse" 
              : "bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                {t('scoreboard.highest_tile')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-yellow-600">
                {highestTile.toLocaleString()}
              </div>
              {bestHighestTile !== null && bestHighestTile > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Best: {bestHighestTile.toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Game Controls: Buttons for restarting, undoing, etc. */}
        <GameControls 
          restartGame={restartGame} 
          undoMove={undoMove} 
          canUndo={canUndo} 
        />

        {/* Game Board: Renders the 2048 tiles, integrates swipe gestures */}
        <div className="flex justify-center mb-6">
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="touch-none"
          >
            <GameBoard animatedTiles={animatedTiles} />
          </div>
        </div>

        {/* Instructions: Provides guidance on how to play the game */}
        <Instructions>
          <p className="text-sm text-muted-foreground text-center">
            <span className="hidden sm:inline">{t('instructions.desktop')}</span>
            <span className="sm:hidden">{t('instructions.mobile')}</span>
          </p>
        </Instructions>

        {/* Win Celebration Overlay - Shows when player reaches 2048 */}
        <WinCelebrationOverlay
          isVisible={showCelebration}
          winner={highestTile.toString()}
          winnerTitleKey="celebration.title"
          winnerSubtitleKey="celebration.subtitle"
          translationNamespace="games/2048"
          duration={3000}
          onComplete={handleCelebrationComplete}
        />

        {/* Continue Choice Modal - Shows after celebration, allows player to continue or restart */}
        <GameOverModal
          isGameOver={showContinueModal}
          isWon={true}
          score={score}
          bestScore={highScore ?? 0}
          canContinue={true}
          continueGame={handleContinue}
          restartGame={handleRestart}
        />

        {/* Game Over Modal (when truly game over - no moves left) */}
        <GameOverModal
          isGameOver={isGameOver && !isWon}
          isWon={false}
          score={score}
          bestScore={highScore ?? 0}
          restartGame={restartGame}
        />

        {/* Accessibility: Screen reader announcements */}
        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        >
          {isWon && t('status.won')}
          {isGameOver && !isWon && t('status.game_over')}
        </div>
      </div>

      <div className="mt-8">
        <Leaderboard game="2048" limit={10} currentSession={session} />
      </div>
    </div>
  );
};

export default Game2048;
