/**
 * RangeIndicator Component
 * 
 * Renders a circular range indicator centered on a cell.
 * Used for:
 * - Tower placement preview (shows range before placing)
 * - Selected tower range display
 * 
 * - Semi-transparent fill with matching tower color
 * - Cells within range can be highlighted separately
 * - pointer-events: none so it doesn't block interaction
 */

import React from 'react';
import { TOWER_COLORS, CELL_SIZE } from '../constants';
import { TowerType } from '../types';

interface RangeIndicatorProps {
  row: number;
  col: number;
  range: number; // in grid cells
  towerType: TowerType;
  opacity?: number; // default 0.15 for placement preview
}

export const RangeIndicator = React.memo(function RangeIndicator({
  row,
  col,
  range,
  towerType,
  opacity = 0.15,
}: RangeIndicatorProps) {
  const color = TOWER_COLORS[towerType];
  const cx = col * CELL_SIZE + CELL_SIZE / 2;
  const cy = row * CELL_SIZE + CELL_SIZE / 2;
  const radius = range * CELL_SIZE;

  return (
    <g
      data-testid="range-indicator"
      style={{ pointerEvents: 'none' }}
    >
      {/* Range circle */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={color}
        fillOpacity={opacity}
        stroke={color}
        strokeOpacity={opacity * 2}
        strokeWidth={1}
        strokeDasharray="4 2"
      />
    </g>
  );
});
