import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameHeader } from '@/components/game/GameHeader';
import { GameControls } from '@/components/game/GameControls';
import { useMinesweeper } from './hooks/useMinesweeper';
import type { Difficulty } from './types';
import { DIFFICULTY_CONFIG, GAME_STATUS_LABELS, NUMBER_COLORS } from './constants';

const Minesweeper: React.FC = () => {
  const { t } = useTranslation('common');
  const { state, revealCell, toggleFlag, restart, setDifficulty } = useMinesweeper();
  const [isFlagMode, setIsFlagMode] = useState(false);

  const handleCellClick = (row: number, col: number) => {
    if (isFlagMode) {
      toggleFlag(row, col);
    } else {
      revealCell(row, col);
    }
  };

  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    toggleFlag(row, col);
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCellContent = (cell: typeof state.board[0][0]) => {
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

  const getCellClass = (cell: typeof state.board[0][0]) => {
    const base = "w-8 h-8 flex items-center justify-center text-sm font-bold border cursor-pointer transition-all ";
    
    if (!cell.isRevealed) {
      return base + "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500";
    }
    
    if (cell.value === 'mine') {
      return base + "bg-red-500 text-white";
    }
    
    if (cell.value === 'empty' || cell.value === 0) {
      return base + "bg-gray-100 dark:bg-gray-800";
    }
    
    const num = cell.value as number;
    return base + "bg-white dark:bg-gray-900";
  };

  const getNumberColor = (value: number) => {
    return NUMBER_COLORS[value] || '#000';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <GameHeader 
          title="Minesweeper"
          description="Classic mine-sweeping puzzle game"
        />

        <div className="max-w-2xl mx-auto mt-8">
          {/* Difficulty Selector */}
          <div className="flex gap-2 mb-4 justify-center">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
              <Button
                key={diff}
                variant={state.difficulty === diff ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDifficultyChange(diff)}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </Button>
            ))}
          </div>

          {/* Game Status Bar */}
          <Card className="mb-4">
            <CardContent className="flex justify-between items-center p-4">
              <div className="flex gap-4">
                <div className="text-lg font-mono">
                  💣 {state.mineCount - state.flagCount}
                </div>
                <div className="text-lg font-mono">
                  ⏱️ {formatTime(state.elapsedTime)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded font-semibold ${
                  state.gameStatus === 'won' ? 'bg-green-500 text-white' :
                  state.gameStatus === 'lost' ? 'bg-red-500 text-white' :
                  'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {GAME_STATUS_LABELS[state.gameStatus]}
                </span>
                <Button
                  variant={isFlagMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsFlagMode(!isFlagMode)}
                >
                  🚩 {isFlagMode ? 'Flag Mode ON' : 'Flag Mode'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Game Board */}
          <Card>
            <CardContent className="p-4">
              <div 
                className="inline-grid gap-px bg-gray-300 dark:bg-gray-600"
                style={{
                  gridTemplateColumns: `repeat(${state.config.cols}, 2rem)`,
                }}
              >
                {state.board.map((row, rowIdx) => 
                  row.map((cell, colIdx) => (
                    <button
                      key={`${rowIdx}-${colIdx}`}
                      className={getCellClass(cell)}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                      onContextMenu={(e) => handleCellRightClick(e, rowIdx, colIdx)}
                      disabled={state.gameStatus === 'won' || state.gameStatus === 'lost'}
                      style={cell.isRevealed && typeof cell.value === 'number' ? { color: getNumberColor(cell.value) } : {}}
                    >
                      {getCellContent(cell)}
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="mt-4 flex justify-center">
            <Button onClick={restart} size="lg">
              {t('new_game')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;