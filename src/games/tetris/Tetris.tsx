/**
 * Tetris Game Component
 * Main game component with retro-cyberpunk aesthetic
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Layers, Zap, RotateCcw, Pause, Play, ArrowLeft, ArrowRight, ArrowDown, Undo2, Hand, Box } from 'lucide-react';
import { useTetris } from './hooks/useTetris';
import GameBoard from './components/GameBoard';
import { cn } from '@/lib/utils';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useIsMobile } from '@/hooks/use-mobile';
import { Leaderboard } from '@/components/ui/Leaderboard';
import { getTetrominoColor, TETROMINOES } from './constants';
import { Button } from '@/components/ui/button';

import { GameHeader } from '@/components/game/GameHeader';
import { GameControls } from '@/components/game/GameControls';
import { Instructions } from '@/components/game/Instructions';
import { GameOverModal } from '@/components/game/GameOverModal';
import { GameSession, createGameSession } from '@/types/highScores';

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
  } = useTetris();

  // Local session state for score submission (like Snake does)
  const [session, setSession] = useState<GameSession | null>(null);
  const [prevPieceType, setPrevPieceType] = useState<string | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const isMobile = useIsMobile();

  // Initialize game on mount
  useEffect(() => {
    startGame();
    setSession(createGameSession('tetris'));
  }, []);

  // Track moves - increment when new piece spawns (previous piece locked)
  useEffect(() => {
    if (status === 'playing' && currentPiece && prevPieceType && currentPiece.type !== prevPieceType) {
      setSession(prev => prev ? { ...prev, moves: prev.moves + 1 } : null);
    }
    if (currentPiece) {
      setPrevPieceType(currentPiece.type);
    }
  }, [currentPiece, status, prevPieceType]);

  // Show game over modal when game ends
  useEffect(() => {
    if (status === 'game_over') {
      setShowGameOver(true);
    }
  }, [status]);

  // Swipe gestures for mobile — increased minSwipeDistance to prevent accidental swipes
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
          hardDrop();
          break;
      }
    },
    minSwipeDistance: 40, // Increased from default 25 to prevent accidental swipes
  });

  // Handle tap for start/pause/resume — immediate response, no setTimeout delay
  const handleBoardTap = useCallback(() => {
    if (status === 'idle') {
      startGame();
    } else if (status === 'paused') {
      resumeGame();
    } else if (status === 'playing') {
      rotateClockwise();
    } else if (status === 'game_over') {
      handleRestart();
    }
  }, [status, startGame, resumeGame, rotateClockwise]);

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
        {/* Desktop: side panels, Mobile: hidden (shown in compact mode) */}
        <div className={cn(
          "grid gap-4 mb-4",
          isMobile ? "grid-cols-[auto] justify-center" : "grid-cols-[1fr_auto_1fr]"
        )}>
          {/* Hold piece - hidden on mobile, shown in compact badge */}
          <div className={cn(
            "transition-opacity duration-300",
            !canHold && "opacity-50",
            isMobile && "hidden"
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
            onClick={isMobile ? handleBoardTap : undefined}
            className="touch-none"
          >
            <GameBoard
              board={board}
              currentPiece={currentPiece}
              ghostPosition={ghostPosition}
              clearedLines={clearedLines}
              isMobile={isMobile}
              gameStatus={status}
            />
          </div>

          {/* Next piece - hidden on mobile */}
          <div className={cn(isMobile && "hidden")}>
            <TetrominoPreview
              type={nextPiece}
              title={t('scoreboard.next')}
            />
          </div>
        </div>

        {/* Mobile: Compact next/hold display */}
        {isMobile && (
          <div className="flex justify-center gap-6 mb-3 text-xs">
            <div className={cn("flex items-center gap-2", !canHold && "opacity-50")}>
              <span className="text-muted-foreground">{t('scoreboard.hold')}:</span>
              <div className="w-8 h-8 flex items-center justify-center">
                {holdPiece && (
                  <div className="grid gap-[1px]" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {TETROMINOES[holdPiece as keyof typeof TETROMINOES]?.shape.flat().slice(0, 8).map((cell, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5"
                        style={{ backgroundColor: cell ? TETROMINOES[holdPiece as keyof typeof TETROMINOES].color : 'transparent' }}
                      />
                    ))}
                  </div>
                )}
                {!holdPiece && <span className="text-muted-foreground/50">-</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{t('scoreboard.next')}:</span>
              <div className="w-8 h-8 flex items-center justify-center">
                {nextPiece && (
                  <div className="grid gap-[1px]" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {TETROMINOES[nextPiece as keyof typeof TETROMINOES]?.shape.flat().slice(0, 8).map((cell, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5"
                        style={{ backgroundColor: cell ? TETROMINOES[nextPiece as keyof typeof TETROMINOES].color : 'transparent' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Game Controls */}
        <GameControls restartGame={handleNewGame} />

        {/* Instructions */}
        <Instructions>
          <p className="text-sm text-muted-foreground text-center">
            <span className="hidden sm:inline">{t('instructions.desktop')}</span>
            <span className="sm:hidden">{t('instructions.mobile')}</span>
          </p>
        </Instructions>

        {/* Mobile Control Buttons */}
        {isMobile && (status === 'playing' || status === 'paused') && (
          <div className="mt-4 mb-2 px-2">
            {status === 'paused' ? (
              /* Resume button when paused */
              <div className="flex justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 w-32 text-xl bg-green-600/80 border-green-500/50 text-white"
                  onTouchStart={() => resumeGame()}
                >
                  <Play className="w-6 h-6 mr-2" />
                  Resume
                </Button>
              </div>
            ) : (
              <>
                {/* Row 1: Move controls */}
                <div className="flex justify-center gap-2 mb-2">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-14 text-xl bg-slate-800/80 border-cyan-500/30 text-cyan-400"
                    onTouchStart={() => moveLeft()}
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-14 text-xl bg-slate-800/80 border-purple-500/30 text-purple-400"
                    onTouchStart={() => rotateClockwise()}
                  >
                    <RotateCcw className="w-6 h-6" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-14 text-xl bg-slate-800/80 border-cyan-500/30 text-cyan-400"
                    onTouchStart={() => moveRight()}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                </div>
                {/* Row 2: Actions */}
                <div className="flex justify-center gap-2">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-16 text-sm bg-slate-800/80 border-yellow-500/30 text-yellow-400"
                    onTouchStart={() => moveDown()}
                  >
                    ↓ Soft
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-16 text-sm bg-slate-800/80 border-red-500/30 text-red-400"
                    onTouchStart={() => hardDrop()}
                  >
                    ⬇ Hard
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                      "h-12 w-16 text-sm bg-slate-800/80 border-green-500/30",
                      canHold ? "text-green-400" : "text-green-400/50"
                    )}
                    onTouchStart={() => canHold && doHoldPiece()}
                  >
                    <Hand className="w-4 h-4 mr-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-12 text-sm bg-slate-800/80 border-white/30"
                    onTouchStart={() => pauseGame()}
                  >
                    <Pause className="w-5 h-5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Game Over Modal */}
        <GameOverModal
          isGameOver={showGameOver}
          isWon={false}
          score={score}
          bestScore={highScore ?? 0}
          game="tetris"
          session={session}
          restartGame={handleRestart}
          metrics={{ score, lines, level }}
        />

        {/* Status indicator - removed, now handled by GameBoard overlay + Resume button */}

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
        <Leaderboard game="tetris" limit={10} currentSession={session} finalScore={score} />
      </div>
    </div>
  );
};

export default Tetris;
