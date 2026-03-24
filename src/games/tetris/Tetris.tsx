/**
 * Tetris Game Component
 * Main game component with retro-cyberpunk aesthetic
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Layers, Zap } from 'lucide-react';
import { useTetris } from './hooks/useTetris';
import GameBoard from './components/GameBoard';
import { cn } from '@/lib/utils';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { Leaderboard } from '@/components/ui/Leaderboard';
import { getTetrominoColor, TETROMINOES } from './constants';

import { GameHeader } from '@/components/game/GameHeader';
import { GameControls } from '@/components/game/GameControls';
import { Instructions } from '@/components/game/Instructions';
import { GameOverModal } from '@/components/game/GameOverModal';

// Tetromino preview component
const TetrominoPreview = ({
  type,
  title,
}: {
  type: string | null;
  title: string;
}) => {
  const { t } = useTranslation('games/tetris');
  
  if (!type) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="w-12 h-12 flex items-center justify-center text-muted-foreground/50">
            -
          </div>
        </CardContent>
      </Card>
    );
  }

  const color = getTetrominoColor(type as keyof typeof TETROMINOES);
  const shape = TETROMINOES[type as keyof typeof TETROMINOES].shape;

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div
          className="grid gap-[1px]"
          style={{
            gridTemplateColumns: `repeat(${shape[0].length}, 1fr)`,
          }}
        >
          {shape.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'w-4 h-4',
                  cell !== 0 && 'shadow-[0_0_8px_currentColor]'
                )}
                style={{
                  backgroundColor: cell !== 0 ? color : 'transparent',
                }}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Main Tetris Game Component
 */
const Tetris: React.FC = () => {
  const { t } = useTranslation('games/tetris');
  
  const {
    board,
    currentPiece,
    nextPiece,
    holdPiece,
    canHold,
    score,
    highScore,
    bestLines,
    level,
    lines,
    status,
    clearedLines,
    ghostPosition,
    startGame,
    pauseGame,
    resumeGame,
    moveLeft,
    moveRight,
    moveDown,
    rotateClockwise,
    hardDrop,
    doHoldPiece,
    session,
    startSession,
  } = useTetris();

  const [showGameOver, setShowGameOver] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    startGame();
    startSession();
  }, []);

  // Show game over modal when game ends
  useEffect(() => {
    if (status === 'game_over') {
      setShowGameOver(true);
    }
  }, [status]);

  // Swipe gestures for mobile
  const { onTouchStart, onTouchEnd } = useSwipeGesture({
    onSwipe: (direction) => {
      if (status !== 'playing') return;
      
      switch (direction) {
        case 'left':
          moveLeft();
          break;
        case 'right':
          moveRight();
          break;
        case 'down':
          moveDown();
          break;
        case 'up':
          rotateClockwise();
          break;
      }
    },
  });

  const handleRestart = () => {
    setShowGameOver(false);
    startGame();
  };

  const handleNewGame = () => {
    setShowGameOver(false);
    startGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <GameHeader
          title={t('title')}
          description={t('description')}
        />

        {/* Score Section */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Score */}
          <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-cyan-400 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {t('scoreboard.score')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-cyan-400 font-mono">
                {score.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Level */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-purple-400 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {t('scoreboard.level')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-purple-400 font-mono">
                {level}
              </div>
            </CardContent>
          </Card>

          {/* Lines */}
          <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-green-400 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {t('scoreboard.lines')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-green-400 font-mono">
                {lines}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side panels for next/hold pieces */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-4">
          {/* Hold piece */}
          <div className={cn(
            "transition-opacity duration-300",
            !canHold && "opacity-50"
          )}>
            <TetrominoPreview
              type={holdPiece}
              title={t('scoreboard.hold')}
            />
          </div>

          {/* Game Board */}
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="touch-none"
          >
            <GameBoard
              board={board}
              currentPiece={currentPiece}
              ghostPosition={ghostPosition}
              clearedLines={clearedLines}
            />
          </div>

          {/* Next piece */}
          <TetrominoPreview
            type={nextPiece}
            title={t('scoreboard.next')}
          />
        </div>

        {/* Game Controls */}
        <GameControls restartGame={handleNewGame} />

        {/* Instructions */}
        <Instructions>
          <p className="text-sm text-muted-foreground text-center">
            <span className="hidden sm:inline">{t('instructions.desktop')}</span>
            <span className="sm:hidden">{t('instructions.mobile')}</span>
          </p>
        </Instructions>

        {/* Game Over Modal */}
        <GameOverModal
          isGameOver={showGameOver}
          isWon={false}
          score={score}
          bestScore={highScore ?? 0}
          game="tetris"
          session={session}
          restartGame={handleRestart}
        />

        {/* Status indicator */}
        {status === 'paused' && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="text-4xl font-bold text-white animate-pulse">
              {t('status.paused')}
            </div>
          </div>
        )}

        {/* Accessibility */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {status === 'game_over' && t('status.game_over')}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mt-8 max-w-2xl mx-auto">
        <Leaderboard game="tetris" limit={10} currentSession={session} />
      </div>
    </div>
  );
};

export default Tetris;
