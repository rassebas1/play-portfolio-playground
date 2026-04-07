/**
 * Tower Defense Game - Main Component
 * 
 * A strategic tower defense game where players place towers on a grid
 * to stop waves of enemies from reaching their base.
 * 
 * Features:
 * - 4 tower types with unique abilities
 * - 4 enemy types with increasing difficulty
 * - 20 waves of escalating challenges
 * - Tower upgrades and selling
 * - High score integration
 * - Full i18n support (en, es, fr, it)
 */

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GameHeader } from '@/components/game/GameHeader';
import { GameControls } from '@/components/game/GameControls';
import { GameOverModal } from '@/components/game/GameOverModal';
import { Instructions } from '@/components/game/Instructions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTowerDefense } from './hooks/useTowerDefense';
import { GameBoard } from './components/GameBoard';
import { TowerSelector } from './components/TowerSelector';
import { WaveIndicator } from './components/WaveIndicator';
import { UpgradePanel } from './components/UpgradePanel';
import { canPlaceTower as canPlaceTowerLogic, getUpgradeCost, getSellValue } from './gameLogic';
import { TOWER_COLORS, TOWER_STATS, MAX_WAVES, DIFFICULTY_CONFIG } from './constants';
import type { TowerType, Difficulty } from './types';

/**
 * Main Tower Defense game component.
 * Integrates all game systems: grid, towers, enemies, waves, and UI.
 */
const TowerDefense: React.FC = () => {
  const { t } = useTranslation('games/tower-defense');
  const { t: tCommon } = useTranslation('common');

  const {
    gameState,
    handlePlaceTower,
    handleStartWave,
    handleUpgradeTower,
    handleSellTower,
    handleResetGame,
    handleSelectTowerType,
    handleSelectTower,
    handleTowerHover,
    handleSetDifficulty,
    isGameRunning,
    highScore,
    updateHighScore,
    submitScore,
  } = useTowerDefense();

  const {
    phase,
    grid,
    enemies,
    towers,
    projectiles,
    resources,
    lives,
    wave,
    score,
    selectedTowerType,
    selectedTowerId,
    floatingTexts,
    impactEffects,
    hoveredTowerId,
    difficulty,
  } = gameState;

  // Hovered cell for placement preview
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // Selected tower details
  const selectedTower = useMemo(
    () => towers.find((t) => t.id === selectedTowerId) || null,
    [towers, selectedTowerId]
  );

  // Compute upgrade diff (next level stats vs current)
  const upgradeDiff = useMemo(() => {
    if (!selectedTower || selectedTower.level >= 5) return null;
    const stats = TOWER_STATS[selectedTower.type];
    const nextLevel = selectedTower.level + 1;
    return {
      damage: stats.baseDamage + stats.damagePerLevel * selectedTower.level,
      range: stats.baseRange + stats.rangePerLevel * selectedTower.level,
      fireRate: stats.baseFireRate, // fire rate doesn't change with levels
      cost: getUpgradeCost(selectedTower),
    };
  }, [selectedTower]);

  // Check if a cell can have a tower placed
  const canPlaceTower = useCallback(
    (row: number, col: number) => {
      return canPlaceTowerLogic(grid, row, col);
    },
    [grid]
  );

  // Handle cell click
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (selectedTowerType && canPlaceTower(row, col)) {
        handlePlaceTower(selectedTowerType, row, col);
      }
    },
    [selectedTowerType, canPlaceTower, handlePlaceTower]
  );

  // Handle tower click
  const handleTowerClick = useCallback(
    (towerId: string) => {
      handleSelectTower(towerId);
    },
    [handleSelectTower]
  );

  // Handle tower upgrade
  const handleUpgrade = useCallback(() => {
    if (selectedTowerId) {
      handleUpgradeTower(selectedTowerId);
    }
  }, [selectedTowerId, handleUpgradeTower]);

  // Handle tower sell
  const handleSell = useCallback(() => {
    if (selectedTowerId) {
      handleSellTower(selectedTowerId);
    }
  }, [selectedTowerId, handleSellTower]);

  // Check if wave can be started
  const canStartWave = phase === 'planning' && wave < MAX_WAVES;

  // Game over state
  const isGameOver = phase === 'gameOver' || phase === 'victory';

  return (
    <div className="relative mx-auto px-4 py-8 max-w-7xl">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Game Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t('instructions.goal')}</p>
        </div>

        {/* Resource Bar - Glassmorphism */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {/* Difficulty Selector */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm">
            {(['easy', 'normal', 'hard'] as Difficulty[]).map((diff) => {
              const config = DIFFICULTY_CONFIG[diff];
              const isActive = difficulty === diff;
              return (
                <button
                  key={diff}
                  onClick={() => handleSetDifficulty(diff)}
                  disabled={isGameRunning}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    "min-h-[32px] touch-manipulation",
                    isActive
                      ? diff === 'easy' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                        : diff === 'normal' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                      : 'bg-transparent text-muted-foreground hover:bg-muted/50',
                    isGameRunning && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {diff === 'easy' ? '😊' : diff === 'normal' ? '😐' : '😰'} {config.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
            <span className="text-lg">💰</span>
            <span className="text-lg font-bold text-amber-400 tabular-nums">{resources}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm">
            <span className="text-lg">❤️</span>
            <span className="text-lg font-bold text-red-400 tabular-nums">{lives}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
            <span className="text-lg">🏆</span>
            <span className="text-lg font-bold text-blue-400 tabular-nums">{score.toLocaleString()}</span>
          </div>
          {highScore !== null && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-sm">
              <span className="text-lg">⭐</span>
              <span className="text-sm font-semibold text-yellow-400 tabular-nums">{highScore.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Main Game Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Left Panel - Tower Selector */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
            {/* Tower Selector Panel */}
            <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4">
              <TowerSelector
                selectedTowerType={selectedTowerType}
                onSelectTower={handleSelectTowerType}
                resources={resources}
                disabled={isGameRunning}
              />
            </div>

            {/* Selected Tower Details Panel */}
            {selectedTower && (
              <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {t('ui.tower_details')}
                </h3>
                <UpgradePanel
                  tower={selectedTower}
                  resources={resources}
                  phase={phase}
                  upgradeDiff={upgradeDiff}
                  onUpgrade={handleUpgrade}
                  onSell={handleSell}
                />
              </div>
            )}
          </div>

          {/* Center - Game Board */}
          <div className="flex flex-col items-center gap-4">
            {/* Wave Indicator */}
            <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-3 w-full max-w-md">
              <WaveIndicator
                currentWave={wave}
                phase={phase}
                enemiesRemaining={enemies.length + gameState.spawnQueue.length}
                onStartWave={handleStartWave}
                canStartWave={canStartWave}
              />
            </div>

            {/* Game Board */}
            <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-3">
              <GameBoard
                grid={grid}
                enemies={enemies}
                towers={towers}
                projectiles={projectiles}
                selectedTowerType={selectedTowerType}
                selectedTowerId={selectedTowerId}
                onCellClick={handleCellClick}
                onTowerClick={handleTowerClick}
                canPlaceTower={canPlaceTower}
                floatingTexts={floatingTexts}
                impactEffects={impactEffects}
                hoveredTowerId={hoveredTowerId}
                hoveredCell={hoveredCell}
                onTowerHover={handleTowerHover}
                onCellHover={(row, col) => setHoveredCell({ row, col })}
                onCellLeave={() => setHoveredCell(null)}
              />
            </div>

            {/* Game Controls */}
            <GameControls
              restartGame={handleResetGame}
              score={score}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-4 max-w-2xl mx-auto">
          <h3 className="font-semibold text-sm mb-2 text-muted-foreground">{t('instructions.title')}</h3>
          <ul className="text-xs text-muted-foreground/80 space-y-1 grid grid-cols-2 gap-x-4">
            <li>🏗️ {t('instructions.placement')}</li>
            <li>⬆️ {t('instructions.upgrades')}</li>
            <li>🌊 {t('instructions.waves')}</li>
            <li>💡 {t('instructions.tips.0')}</li>
            <li>💡 {t('instructions.tips.1')}</li>
            <li>💡 {t('instructions.tips.2')}</li>
            <li>💡 {t('instructions.tips.3')}</li>
          </ul>
        </div>

        {/* Game Over Modal */}
        {isGameOver && (
          <GameOverModal
            isGameOver={isGameOver}
            isWon={phase === 'victory'}
            score={score}
            bestScore={highScore ?? 0}
            game="tower-defense"
            restartGame={handleResetGame}
            metrics={{ score, waves: wave }}
          />
        )}
      </div>
    </div>
  );
};

export default TowerDefense;
