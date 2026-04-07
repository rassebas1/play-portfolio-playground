/**
 * Tower Selector Component
 * 
 * Displays available tower types for placement with cost,
 * stats, and selection state.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TowerType } from '../types';
import { TOWER_COLORS, TOWER_STATS } from '../constants';
import { cn } from '@/lib/utils';

interface TowerSelectorProps {
  selectedTowerType: TowerType | null;
  onSelectTower: (towerType: TowerType | null) => void;
  resources: number;
  disabled?: boolean;
}

const TOWER_ICONS: Record<string, string> = {
  basic: '🔫',
  sniper: '🎯',
  slow: '❄️',
  splash: '💥',
};

export const TowerSelector: React.FC<TowerSelectorProps> = ({
  selectedTowerType,
  onSelectTower,
  resources,
  disabled = false,
}) => {
  const { t } = useTranslation('games/tower-defense');
  const towerTypes: TowerType[] = ['basic', 'sniper', 'slow', 'splash'];

  const handleSelect = (towerType: TowerType) => {
    if (selectedTowerType === towerType) {
      onSelectTower(null); // Deselect if already selected
    } else {
      onSelectTower(towerType);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {t('ui.select_tower')}
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        {towerTypes.map((towerType) => {
          const stats = TOWER_STATS[towerType];
          const canAfford = resources >= stats.baseCost;
          const isSelected = selectedTowerType === towerType;
          const color = TOWER_COLORS[towerType];

          return (
            <button
              key={towerType}
              onClick={() => handleSelect(towerType)}
              disabled={disabled || !canAfford}
              className={cn(
                'relative p-3 rounded-lg border transition-all duration-150 text-left group',
                'hover:scale-[1.02] active:scale-[0.98]',
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                !canAfford && 'opacity-40 cursor-not-allowed',
                disabled && 'opacity-30 cursor-not-allowed'
              )}
              style={{
                borderColor: isSelected ? color : `${color}30`,
                backgroundColor: `${color}10`,
              }}
              aria-label={`${t(`towers.${towerType}`)} - Cost: ${stats.baseCost}`}
              aria-pressed={isSelected}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 
                bg-black/95 text-white text-xs rounded whitespace-nowrap opacity-0 
                group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                {t(`towers.${towerType}`)} — 💰{stats.baseCost} ⚔️{stats.baseDamage} 🎯{stats.baseRange} ⚡{stats.baseFireRate}/s
              </div>

              {/* Tower icon and name */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-lg">{TOWER_ICONS[towerType]}</span>
                <span className="text-xs font-medium truncate">
                  {t(`towers.${towerType}`)}
                </span>
              </div>

              {/* Cost */}
              <div className="text-xs font-bold mb-1" style={{ color: canAfford ? '#22c55e' : '#ef4444' }}>
                💰 {stats.baseCost}
              </div>

              {/* Stats */}
              <div className="text-xs text-muted-foreground/70 space-y-0.5">
                <div>⚔️ {stats.baseDamage}</div>
                <div>🎯 {stats.baseRange}</div>
                <div>⚡ {stats.baseFireRate}/s</div>
              </div>

              {/* Description */}
              <div className="mt-1.5 text-xs text-muted-foreground/60 line-clamp-2 leading-tight">
                {t(`towers.${towerType}_desc`)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
