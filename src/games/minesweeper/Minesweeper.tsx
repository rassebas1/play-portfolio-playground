import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameHeader } from '@/components/game/GameHeader';
import { GameControls } from '@/components/game/GameControls';
import { Instructions } from '@/components/game/Instructions';
import { GameOverModal } from '@/components/game/GameOverModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Leaderboard, ScoreSubmitter } from '@/components/ui/Leaderboard';
import { useMinesweeper } from './hooks/useMinesweeper';
import { useBestTimes } from './hooks/useBestTimes';
import type { Difficulty, Cell } from './types';
import { DIFFICULTY_CONFIG, NUMBER_COLORS } from './constants';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { createGameSession, type GameSession } from '@/types/highScores';
import { Flag, Bomb, Clock, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const Minesweeper: React.FC = () => {
  const { t } = useTranslation(['common', 'games/minesweeper']);
  const { t: tGame } = useTranslation('games/minesweeper');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { state, revealCell, chordReveal, toggleFlag, restart, setDifficulty } = useMinesweeper();
  const { saveBestTime, getBestTime } = useBestTimes();
  
  const [isFlagMode, setIsFlagMode] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [session, setSession] = useState<GameSession | null>(null);
  
  const boardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLButtonElement>(null);
  const lastTapRef = useRef<number | null>(null);

  // Initialize session
  useEffect(() => {
    setSession(createGameSession('minesweeper'));
  }, []);

  // Handle game win/loss modal triggers
  useEffect(() => {
    if (state.gameStatus === 'won') {
      const isRecord = saveBestTime(state.difficulty, state.elapsedTime);
      setIsNewRecord(isRecord);
      setShowVictoryModal(true);
      setAnnouncement(tGame('a11y.game_won', { time: formatTime(state.elapsedTime) }));
      
      // Update session for leaderboard
      if (session) {
        setSession(prev => prev ? { 
          ...prev, 
          score: state.config.rows * state.config.cols - state.config.mines - state.elapsedTime,
          won: true 
        } : null);
      }
    } else if (state.gameStatus === 'lost') {
      setShowDefeatModal(true);
      setAnnouncement(tGame('a11y.game_lost'));
      
      // Update session for leaderboard
      if (session) {
        setSession(prev => prev ? { 
          ...prev, 
          won: false 
        } : null);
      }
    }
  }, [state.gameStatus, state.difficulty, state.elapsedTime, state.config, saveBestTime, tGame, session]);

  // Focus modal on open
  useEffect(() => {
    if ((showVictoryModal || showDefeatModal) && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showVictoryModal, showDefeatModal]);

  // Close modal and restart
  const handlePlayAgain = useCallback(() => {
    setShowVictoryModal(false);
    setShowDefeatModal(false);
    restart();
    setSession(createGameSession('minesweeper'));
  }, [restart]);

  const handleBackToGames = useCallback(() => {
    setShowVictoryModal(false);
    setShowDefeatModal(false);
    navigate('/');
  }, [navigate]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatBestTime = (difficulty: Difficulty): string => {
    const best = getBestTime(difficulty);
    return best !== null ? formatTime(best) : '--:--';
  };

  // Get face emoji based on game status
  const getFaceEmoji = (): string => {
    const faceMap: Record<string, string> = {
      idle: tGame('face.idle'),
      playing: tGame('face.playing'),
      won: tGame('face.won'),
      lost: tGame('face.lost'),
    };
    return faceMap[state.gameStatus] || '🙂';
  };

  const getCellContent = (cell: Cell) => {
    if (!cell.isRevealed) {
      return cell.isFlagged ? '🚩' : '';
    }
    if (cell.value === 'mine') {
      return '💣';
    }
    if (cell.value === 'empty' || cell.value === 0) {
      return '';
    }
    return cell.value;
  };

  // Calculate cell size for styling - using inline styles for reliability
  // Memoized to prevent re-renders when modal opens
  const cellSize = useMemo(() => {
    const { cols } = state.config;
    
    if (isMobile) {
      const vw = typeof window !== 'undefined' ? window.innerWidth : 375;
      const availableWidth = vw - 48;
      const cellSizeCalc = Math.floor(availableWidth / cols);
      
      // Minimum 20px, maximum 32px
      const size = Math.max(20, Math.min(32, cellSizeCalc));
      return {
        width: size,
        height: size,
        fontSize: Math.max(8, Math.floor(size * 0.5))
      };
    }
    
    // Desktop - use rem-based sizes
    if (cols <= 9) return { width: 36, height: 36, fontSize: 14 };
    if (cols <= 16) return { width: 28, height: 28, fontSize: 12 };
    return { width: 24, height: 24, fontSize: 10 };
  }, [state.config.cols, isMobile]);

  // Get grid cell size (rem for grid template) - memoized
  const gridCellSize = useMemo(() => {
    const { cols } = state.config;
    
    if (isMobile) {
      const vw = typeof window !== 'undefined' ? window.innerWidth : 375;
      const availableWidth = vw - 48;
      const cellSize = Math.floor(availableWidth / cols);
      // Convert to rem with min 1.25rem
      const rem = Math.max(1.25, cellSize / 16);
      return `${rem.toFixed(2)}rem`;
    }
    
    if (cols <= 9) return '2rem';
    if (cols <= 16) return '1.75rem';
    return '1.5rem';
  }, [state.config.cols, isMobile]);

  const getCellClass = (cell: Cell, isFocused: boolean) => {
    const base = `flex items-center justify-center font-bold border cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 `;
    
    let bgClass = '';
    if (!cell.isRevealed) {
      bgClass = isFocused 
        ? "bg-gray-400 dark:bg-gray-500 ring-4 ring-primary" 
        : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 border-gray-400 dark:border-gray-500";
    } else if (cell.value === 'mine') {
      bgClass = "bg-red-500 text-white border-red-600";
    } else if (cell.value === 'empty' || cell.value === 0) {
      bgClass = "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    } else {
      bgClass = "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700";
    }
    
    return base + bgClass;
  };

  // Get cell style with explicit dimensions
  const getCellStyle = (cell: Cell, isFocused: boolean): React.CSSProperties => {
    const style: React.CSSProperties = {
      width: `${cellSize.width}px`,
      height: `${cellSize.height}px`,
      fontSize: `${cellSize.fontSize}px`,
    };
    
    if (cell.isRevealed && typeof cell.value === 'number') {
      style.color = getNumberColor(cell.value);
    }
    
    return style;
  };

  const getNumberColor = (value: number) => {
    return NUMBER_COLORS[value] || '#000';
  };

  const getCellAriaLabel = (cell: Cell, row: number, col: number): string => {
    if (!cell.isRevealed) {
      if (cell.isFlagged) {
        return tGame('a11y.cell_flagged', { row: row + 1, col: col + 1 });
      }
      return tGame('a11y.cell_hidden', { row: row + 1, col: col + 1 });
    }
    
    if (cell.value === 'mine') {
      return tGame('a11y.cell_mine', { row: row + 1, col: col + 1 });
    }
    
    if (cell.value === 'empty' || cell.value === 0) {
      return tGame('a11y.cell_empty', { row: row + 1, col: col + 1 });
    }
    
    return tGame('a11y.cell_revealed', { row: row + 1, col: col + 1, count: cell.value });
  };

  const handleCellClick = (row: number, col: number) => {
    if (state.gameStatus === 'won' || state.gameStatus === 'lost') return;
    
    if (isFlagMode) {
      toggleFlag(row, col);
    } else {
      revealCell(row, col);
    }
  };

  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (state.gameStatus === 'won' || state.gameStatus === 'lost') return;
    toggleFlag(row, col);
  };

  // Chord reveal on double click
  const handleCellDoubleClick = (row: number, col: number) => {
    if (state.gameStatus === 'won' || state.gameStatus === 'lost') return;
    chordReveal(row, col);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, row: number, col: number) => {
    if (state.gameStatus === 'won' || state.gameStatus === 'lost') return;

    const { rows, cols } = state.config;
    let newRow = row;
    let newCol = col;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newRow = Math.min(rows - 1, row + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newCol = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newCol = Math.min(cols - 1, col + 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isFlagMode) {
          toggleFlag(row, col);
        } else {
          revealCell(row, col);
        }
        return;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFlag(row, col);
        return;
      case 'd':
      case 'D':
      case 'c':
      case 'C':
        e.preventDefault();
        chordReveal(row, col);
        return;
      default:
        return;
    }

    setFocusedCell({ row: newRow, col: newCol });
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
    setFocusedCell(null);
  };

  // Handle flag mode toggle
  const handleFlagModeToggle = () => {
    setIsFlagMode(!isFlagMode);
    setAnnouncement(isFlagMode ? tGame('a11y.flag_mode_off') : tGame('a11y.flag_mode_on'));
  };

  // Mobile: Handle board tap for starting game
  const handleBoardTap = useCallback(() => {
    if (state.gameStatus === 'idle') {
      // First tap starts the game - we'll just reveal the first click
      revealCell(0, 0);
    }
  }, [state.gameStatus, revealCell]);

  // Mobile: Swipe to navigate between cells
  const { onTouchStart, onTouchEnd } = useSwipeGesture({
    onSwipe: (direction) => {
      if (state.gameStatus === 'won' || state.gameStatus === 'lost') return;
      
      if (!focusedCell) {
        setFocusedCell({ row: 0, col: 0 });
        return;
      }

      const { rows, cols } = state.config;
      let newRow = focusedCell.row;
      let newCol = focusedCell.col;

      switch (direction) {
        case 'up':
          newRow = Math.max(0, focusedCell.row - 1);
          break;
        case 'down':
          newRow = Math.min(rows - 1, focusedCell.row + 1);
          break;
        case 'left':
          newCol = Math.max(0, focusedCell.col - 1);
          break;
        case 'right':
          newCol = Math.min(cols - 1, focusedCell.col + 1);
          break;
      }

      setFocusedCell({ row: newRow, col: newCol });
    },
  });

  // Mobile: Double tap to reveal/chord
  const handleCellTouchEnd = (e: React.TouchEvent, row: number, col: number) => {
    const now = Date.now();
    const cell = state.board[row][col];
    
    // Double-tap handling
    if (lastTapRef.current && now - lastTapRef.current < 300) {
      if (!cell.isRevealed && !cell.isFlagged) {
        chordReveal(row, col);
      }
      lastTapRef.current = null;
      return;
    }
    lastTapRef.current = now;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-1 sm:px-4 py-3 sm:py-8">
        <GameHeader 
          title={tGame('title')}
          description={tGame('description')}
        />

        <div className="max-w-4xl mx-auto mt-3 sm:mt-6">
          {/* Difficulty Selector - Compact on mobile */}
          <div className="flex gap-1 mb-3 justify-center">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
              <Button
                key={diff}
                variant={state.difficulty === diff ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDifficultyChange(diff)}
                className={cn(
                  "min-h-9 touch-manipulation text-xs font-medium",
                  state.difficulty === diff 
                    ? "px-2 sm:px-4" 
                    : "px-2 sm:px-4 border-0 bg-transparent hover:bg-muted",
                  diff === 'hard' && state.difficulty !== diff && "text-orange-500"
                )}
              >
                {diff === 'easy' ? '😊' : diff === 'medium' ? '😐' : '😰'} {tGame(`difficulty.${diff}`).toUpperCase()}
              </Button>
            ))}
          </div>

          {/* Status Bar - Compact on mobile */}
          <Card className="mb-2 sm:mb-3">
            <CardContent className={cn(
              "flex justify-between items-center gap-2",
              isMobile ? "p-2" : "p-3"
            )}>
              {/* Left: Face + Stats */}
              <div className="flex items-center gap-2">
                <button
                  onClick={restart}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && restart()}
                  className={cn(
                    "flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg",
                    "hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer",
                    isMobile ? "text-xl w-8 h-8" : "text-2xl sm:text-3xl w-10 h-10 sm:w-12 sm:h-12"
                  )}
                  aria-label={`${tGame('controls.new_game')} - ${tGame(`status.${state.gameStatus}`)}`}
                >
                  {getFaceEmoji()}
                </button>
                
                <div className="flex gap-2 text-xs sm:text-lg font-mono font-semibold">
                  <span className="flex items-center gap-1">
                    <Bomb className={isMobile ? "w-3 h-3" : "w-4 h-4 sm:w-5 sm:h-5"} />
                    <span className="min-w-[1.5rem]">{state.mineCount - state.flagCount}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className={isMobile ? "w-3 h-3" : "w-4 h-4 sm:w-5 sm:h-5"} />
                    <span className="min-w-[2.5rem]">{formatTime(state.elapsedTime)}</span>
                  </span>
                </div>
              </div>

              {/* Right: Best time + Flag */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                  <Trophy className="w-3 h-3" />
                  <span className="hidden md:inline">{tGame('stats.best_time')}:</span>
                  <span className="font-mono font-semibold">{formatBestTime(state.difficulty)}</span>
                </div>
                <Button
                  variant={isFlagMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleFlagModeToggle}
                  className={cn(
                    "touch-manipulation text-xs",
                    isMobile ? "min-h-8 px-2" : "min-h-10"
                  )}
                >
                  <Flag className="w-3 h-3 mr-1" />
                  {isFlagMode ? 'ON' : ''}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Game Board - Full width, centered, responsive */}
          <div className="w-full mb-2 sm:mb-3 flex justify-center">
            <Card className="inline-block" style={{ contain: 'layout paint' }}>
              <CardContent className="p-1 sm:p-2">
                <div 
                  ref={boardRef}
                  role="grid"
                  aria-label={tGame('a11y.board_label')}
                  className="inline-grid gap-px bg-gray-300 dark:bg-gray-600 p-1 rounded"
                  onTouchStart={isMobile ? onTouchStart : undefined}
                  onTouchEnd={isMobile ? onTouchEnd : undefined}
                  onClick={isMobile ? handleBoardTap : undefined}
                  style={{
                    gridTemplateColumns: `repeat(${state.config.cols}, ${isMobile ? gridCellSize : 'minmax(1.5rem, 2rem)'})`,
                  }}
                >
                  {state.board.map((row, rowIdx) => 
                    row.map((cell, colIdx) => {
                      const isFocused = focusedCell?.row === rowIdx && focusedCell?.col === colIdx;
                      return (
                        <button
                          key={`${rowIdx}-${colIdx}`}
                          role="gridcell"
                          tabIndex={isFocused ? 0 : -1}
                          className={getCellClass(cell, isFocused)}
                          style={getCellStyle(cell, isFocused)}
                          onClick={() => handleCellClick(rowIdx, colIdx)}
                          onContextMenu={(e) => handleCellRightClick(e, rowIdx, colIdx)}
                          onDoubleClick={() => handleCellDoubleClick(rowIdx, colIdx)}
                          onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                          onFocus={() => setFocusedCell({ row: rowIdx, col: colIdx })}
                          onTouchEnd={(e) => isMobile && handleCellTouchEnd(e, rowIdx, colIdx)}
                          disabled={state.gameStatus === 'won' || state.gameStatus === 'lost'}
                          aria-label={getCellAriaLabel(cell, rowIdx, colIdx)}
                          aria-pressed={cell.isFlagged}
                        >
                          {getCellContent(cell)}
                        </button>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile: On-screen controls */}
          {isMobile && (
            <div className="mt-2 mb-3 px-1">
              <div className="flex justify-center gap-2 mb-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-14 text-lg bg-slate-800/80 border-gray-500/30 text-gray-300"
                  onTouchStart={() => {
                    if (focusedCell) {
                      const { rows } = state.config;
                      setFocusedCell({ row: Math.max(0, focusedCell.row - 1), col: focusedCell.col });
                    } else {
                      setFocusedCell({ row: 0, col: 0 });
                    }
                  }}
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex justify-center gap-2 mb-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-14 text-lg bg-slate-800/80 border-gray-500/30 text-gray-300"
                  onTouchStart={() => {
                    if (focusedCell) {
                      const { cols } = state.config;
                      setFocusedCell({ row: focusedCell.row, col: Math.max(0, focusedCell.col - 1) });
                    } else {
                      setFocusedCell({ row: 0, col: 0 });
                    }
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant={isFlagMode ? 'default' : 'outline'}
                  className={cn(
                    "h-12 w-14 text-lg",
                    isFlagMode ? "bg-red-600 border-red-500" : "bg-slate-800/80 border-gray-500/30"
                  )}
                  onTouchStart={() => {
                    if (focusedCell) {
                      if (isFlagMode) {
                        toggleFlag(focusedCell.row, focusedCell.col);
                      } else {
                        revealCell(focusedCell.row, focusedCell.col);
                      }
                    } else {
                      revealCell(0, 0);
                    }
                  }}
                >
                  {isFlagMode ? <Flag className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-14 text-lg bg-slate-800/80 border-gray-500/30 text-gray-300"
                  onTouchStart={() => {
                    if (focusedCell) {
                      const { cols } = state.config;
                      setFocusedCell({ row: focusedCell.row, col: Math.min(cols - 1, focusedCell.col + 1) });
                    } else {
                      setFocusedCell({ row: 0, col: 0 });
                    }
                  }}
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-14 text-lg bg-slate-800/80 border-gray-500/30 text-gray-300"
                  onTouchStart={() => {
                    if (focusedCell) {
                      const { rows } = state.config;
                      setFocusedCell({ row: Math.min(rows - 1, focusedCell.row + 1), col: focusedCell.col });
                    } else {
                      setFocusedCell({ row: 0, col: 0 });
                    }
                  }}
                >
                  <ArrowDown className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-20 text-sm bg-slate-800/80 border-blue-500/30 text-blue-300"
                  onTouchStart={() => {
                    if (focusedCell) {
                      chordReveal(focusedCell.row, focusedCell.col);
                    }
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Chord
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-14 text-lg bg-slate-800/80 border-orange-500/30 text-orange-300"
                  onTouchStart={restart}
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Mobile: Instructions */}
          {isMobile && (
            <div className="mt-3 text-center">
              <details className="text-sm text-muted-foreground inline-block">
                <summary className="cursor-pointer font-semibold text-foreground mb-2 hover:text-primary">
                  ❓ {tGame('instructions.title')}
                </summary>
                <div className="text-left space-y-2 p-4 bg-muted/50 rounded-lg border">
                  <p className="flex items-center gap-2">
                    <span className="text-lg">👆</span> 
                    <span>{tGame('instructions.steps.0')}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-lg">🚩</span> 
                    <span>{tGame('controls.flag_mode')}: Tap flag button</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-lg">👆👆</span> 
                    <span>{tGame('instructions.steps.3').split('.')[0]}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-lg">🎯</span> 
                    <span>Use arrow buttons to navigate</span>
                  </p>
                </div>
              </details>
            </div>
          )}

          {/* Desktop: Instructions */}
          {!isMobile && (
            <Instructions>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="hidden sm:inline">
                    {tGame('instructions.steps.0')} • {tGame('instructions.steps.1')} • {tGame('instructions.steps.2')}
                  </span>
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">Click</kbd>
                    {tGame('instructions.steps.0')}
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">Right Click</kbd>
                    {tGame('instructions.steps.2')}
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">Double Click</kbd>
                    {tGame('instructions.steps.3').split('.')[0]}
                  </span>
                </div>
              </div>
            </Instructions>
          )}

          {/* Game Controls */}
          <GameControls restartGame={restart} />
        </div>

        {/* Leaderboard */}
        <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
          <Leaderboard 
            game="minesweeper" 
            limit={10} 
            currentSession={session} 
            finalScore={state.gameStatus === 'won' ? state.config.rows * state.config.cols - state.config.mines - state.elapsedTime : undefined}
          />
        </div>
      </div>

      {/* Victory Modal */}
      <Dialog open={showVictoryModal} onOpenChange={(open) => !open && setShowVictoryModal(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">{tGame('modal.victory.title')}</DialogTitle>
            <DialogDescription className="text-center">
              {tGame('modal.victory.subtitle')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="text-lg font-semibold">
              {tGame('modal.victory.time', { time: formatTime(state.elapsedTime) })}
            </div>
            <div className="text-muted-foreground">
              {tGame('modal.victory.best_time', { time: formatBestTime(state.difficulty) })}
            </div>
            {isNewRecord && (
              <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400 animate-pulse">
                {tGame('modal.victory.new_record')}
              </div>
            )}
            
            {/* Score Submission */}
            {session && (
              <div className="w-full border-t pt-4 mt-2">
                <ScoreSubmitter
                  game="minesweeper"
                  finalScore={state.gameStatus === 'won' ? Math.max(0, state.config.rows * state.config.cols - state.config.mines - state.elapsedTime) : 0}
                  session={session}
                  isNewHighScore={isNewRecord}
                />
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handlePlayAgain} 
              ref={modalRef}
              className="min-h-12 touch-manipulation flex-1"
            >
              {tGame('modal.victory.play_again')}
            </Button>
            <Button 
              onClick={handleBackToGames} 
              variant="outline"
              className="min-h-12 touch-manipulation flex-1"
            >
              {tGame('modal.victory.back_to_games')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Defeat Modal */}
      <Dialog open={showDefeatModal} onOpenChange={(open) => !open && setShowDefeatModal(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">{tGame('modal.defeat.title')}</DialogTitle>
            <DialogDescription className="text-center">
              {tGame('modal.defeat.subtitle')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="text-lg font-semibold">
              {tGame('modal.defeat.time', { time: formatTime(state.elapsedTime) })}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handlePlayAgain}
              ref={modalRef}
              className="min-h-12 touch-manipulation flex-1"
            >
              {tGame('modal.defeat.play_again')}
            </Button>
            <Button 
              onClick={handleBackToGames} 
              variant="outline"
              className="min-h-12 touch-manipulation flex-1"
            >
              {tGame('modal.defeat.back_to_games')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </div>
  );
};

export default Minesweeper;