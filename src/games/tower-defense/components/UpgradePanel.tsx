/**
 * Upgrade Panel Component
 * 
 * Displays selected tower details with stats, upgrade diff indicators,
 * and upgrade/sell buttons.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Tower, GamePhase } from '../types';
import { TOWER_STATS } from '../constants';
import { getUpgradeCost, getSellValue } from '../gameLogic';

const TOWER_ICONS: Record<string, string> = {
  basic: '🔫',
  sniper: '🎯',
  slow: '❄️',
  splash: '💥',
};

export interface UpgradeDiff {
  damage: number;
  range: number;
  fireRate: number;
  cost: number;
}

export interface UpgradePanelProps {
  tower: Tower;
  resources: number;
  phase: GamePhase;
  upgradeDiff: UpgradeDiff | null;
  onUpgrade: () => void;
  onSell: () => void;
}

export const UpgradePanel: React.FC<UpgradePanelProps> = ({
  tower,
  resources,
  phase,
  upgradeDiff,
  onUpgrade,
  onSell,
}) => {
  const { t } = useTranslation('games/tower-defense');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">
          {TOWER_ICONS[tower.type]}
        </span>
        <span className="font-semibold text-sm">
          {t(`towers.${tower.type}`)}
        </span>
        <span className="text-xs px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
          Lv. {tower.level}
        </span>
      </div>

      {/* Stats with upgrade diff */}
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">⚔️ Damage</span>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{tower.damage}</span>
            {upgradeDiff && (
              <span className="text-xs font-semibold text-emerald-400">
                → {upgradeDiff.damage} <span className="opacity-70">(+{upgradeDiff.damage - tower.damage})</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">🎯 Range</span>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{tower.range}</span>
            {upgradeDiff && (
              <span className="text-xs font-semibold text-emerald-400">
                → {parseFloat(upgradeDiff.range.toFixed(1))} <span className="opacity-70">(+{parseFloat((upgradeDiff.range - tower.range).toFixed(1))})</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">⚡ Fire Rate</span>
          <span className="font-medium">{parseFloat(tower.fireRate.toFixed(2))}/s</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">💀 Kills</span>
          <span className="font-medium">{tower.kills}</span>
        </div>
      </div>

      {/* Upgrade/Sell buttons */}
      {phase === 'planning' && (
        <div className="flex gap-2 pt-2 border-t border-border/30">
          {tower.level < 5 && (
            <Button
              onClick={onUpgrade}
              disabled={resources < getUpgradeCost(tower)}
              size="sm"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              ⬆️ {getUpgradeCost(tower)}💰
            </Button>
          )}
          {tower.level >= 5 && (
            <span className="flex-1 text-center text-xs py-1.5 rounded-md bg-muted/50 text-muted-foreground">
              MAX
            </span>
          )}
          <Button
            onClick={onSell}
            variant="outline"
            size="sm"
            className="text-red-400 border-red-500/30 hover:bg-red-500/10"
          >
            💰 {getSellValue(tower)}
          </Button>
        </div>
      )}
    </div>
  );
};
