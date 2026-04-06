/**
 * Tower Component
 * 
 * Renders a single tower on the game board with visual indicators
 * for type, level, and selection state.
 */

import React from 'react';
import { Tower } from '../types';
import { TOWER_COLORS } from '../constants';
import { useTranslation } from 'react-i18next';

interface TowerComponentProps {
  tower: Tower;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const TOWER_ICONS: Record<string, string> = {
  basic: '🔫',
  sniper: '🎯',
  slow: '❄️',
  splash: '💥',
};

export const TowerComponent: React.FC<TowerComponentProps> = ({
  tower,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { t } = useTranslation('games/tower-defense');
  const color = TOWER_COLORS[tower.type];
  const icon = TOWER_ICONS[tower.type];

  return (
    <div className="absolute inset-0 w-full h-full group">
      <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="w-full h-full flex items-center justify-center text-lg transition-all duration-150 hover:scale-110 focus:outline-none"
        style={{
          backgroundColor: `${color}30`,
          border: isSelected ? `2px solid ${color}` : 'none',
          borderRadius: '4px',
        }}
        aria-label={`${tower.type} tower level ${tower.level}`}
      >
        <span className="select-none">{icon}</span>
        
        {/* Level indicator */}
        {tower.level > 1 && (
          <span
            className="absolute -top-1 -right-1 text-xs font-bold px-1 rounded-full"
            style={{
              backgroundColor: color,
              color: '#000',
            }}
          >
            {tower.level}
          </span>
        )}
      </button>

      {/* Tooltip — sibling of button, outside stacking context */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 
        bg-black/95 text-white text-xs rounded whitespace-nowrap opacity-0 
        group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
        {t(`towers.${tower.type}`)} Lv.{tower.level} — DMG: {tower.damage} | RNG: {tower.range} | FR: {parseFloat(tower.fireRate.toFixed(2))}/s
      </div>
    </div>
  );
};
