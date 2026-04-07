/**
 * PlacementPreview Component
 * 
 * Shows a ghost tower (50% opacity) + range indicator when hovering a valid cell
 * during tower placement mode.
 * 
 * - Ghost tower appears above grid but below existing towers
 * - Range circle centered on hovered cell
 * - Disappears when cursor leaves grid or placement is cancelled
 */

import React from 'react';
import { TowerType, Cell } from '../types';
import { TOWER_COLORS, TOWER_SVG_SHAPES, CELL_SIZE } from '../constants';
import { RangeIndicator } from './RangeIndicator';

interface PlacementPreviewProps {
  hoveredCell: { row: number; col: number } | null;
  selectedTowerType: TowerType | null;
  isValidPlacement: boolean;
}

export const PlacementPreview = React.memo(function PlacementPreview({
  hoveredCell,
  selectedTowerType,
  isValidPlacement,
}: PlacementPreviewProps) {
  if (!hoveredCell || !selectedTowerType || !isValidPlacement) return null;

  const color = TOWER_COLORS[selectedTowerType];
  const shape = TOWER_SVG_SHAPES[selectedTowerType];
  const cx = hoveredCell.col * CELL_SIZE + CELL_SIZE / 2;
  const cy = hoveredCell.row * CELL_SIZE + CELL_SIZE / 2;

  return (
    <>
      {/* Range indicator */}
      <RangeIndicator
        row={hoveredCell.row}
        col={hoveredCell.col}
        range={2} // Default range; will be overridden by tower type in GameBoard
        towerType={selectedTowerType}
        opacity={0.15}
      />

      {/* Ghost tower */}
      <g
        data-testid="placement-ghost"
        transform={`translate(${cx}, ${cy})`}
        style={{ opacity: 0.5, pointerEvents: 'none' }}
      >
        <svg
          viewBox={shape.viewBox}
          width={CELL_SIZE * 0.7}
          height={CELL_SIZE * 0.7}
          x={-(CELL_SIZE * 0.35)}
          y={-(CELL_SIZE * 0.35)}
          style={{ overflow: 'visible' }}
        >
          <path
            d={shape.body}
            fill={color}
            stroke={color}
            strokeWidth={1}
            strokeDasharray="3 2"
          />
          {/* Ghost cannon */}
          <rect
            x={2}
            y={-2}
            width={10}
            height={4}
            rx={1}
            fill={color}
            strokeDasharray="2 1"
          />
        </svg>
      </g>
    </>
  );
});
