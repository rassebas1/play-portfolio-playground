/**
 * TowerSVG Component
 * 
 * Renders a tower as an inline SVG with:
 * - Distinct body shape per tower type (triangle, square, circle, diamond)
 * - Rotating cannon barrel that points toward target
 * - Level indicator badge
 * - Tooltip with detailed stats on hover
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tower } from '../types';
import { TOWER_COLORS, TOWER_SVG_SHAPES } from '../constants';

interface TowerSVGProps {
  tower: Tower;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const TowerSVG = React.memo(function TowerSVG({
  tower,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: TowerSVGProps) {
  const { t } = useTranslation('games/tower-defense');
  const color = TOWER_COLORS[tower.type];
  const shape = TOWER_SVG_SHAPES[tower.type];

  return (
    <div
      data-testid="tower-wrapper"
      className="absolute inset-0 w-full h-full group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        onClick={onClick}
        className="w-full h-full flex items-center justify-center transition-all duration-150 hover:scale-110 focus:outline-none"
        aria-label={`${t(`towers.${tower.type}`)} tower level ${tower.level}`}
      >
        <svg
          viewBox={shape.viewBox}
          className="w-8 h-8"
          style={{
            filter: isSelected ? `drop-shadow(0 0 3px ${color})` : 'none',
            overflow: 'visible',
          }}
        >
          {/* Tower body */}
          <path
            d={shape.body}
            fill={color}
            stroke={isSelected ? '#fff' : `${color}cc`}
            strokeWidth={isSelected ? 1.5 : 0.5}
          />

          {/* Cannon barrel — rotates toward target */}
          <g
            data-testid="cannon"
            transform={`rotate(${tower.rotation})`}
            style={{ willChange: 'transform' }}
          >
            <rect
              x={2}
              y={-2}
              width={10}
              height={4}
              rx={1}
              fill={color}
              stroke={`${color}aa`}
              strokeWidth={0.5}
            />
          </g>
        </svg>

        {/* Level indicator */}
        {tower.level > 1 && (
          <span
            data-testid="level-badge"
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
      <div
        data-testid="tower-tooltip"
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 
          bg-black/95 text-white text-xs rounded whitespace-nowrap opacity-0 
          group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg"
      >
        {t(`towers.${tower.type}`)} Lv.{tower.level} — DMG: {tower.damage} | RNG: {tower.range} | FR: {parseFloat(tower.fireRate.toFixed(2))}/s | Kills: {tower.kills}
      </div>
    </div>
  );
});
