/**
 * Game Board Component
 * 
 * Renders the tower defense grid with SVG towers, SVG enemies,
 * projectiles with trails, impact effects, and range indicators.
 * Handles click interactions for tower placement and selection.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Cell, Enemy, Tower, Projectile, TowerType, FloatingText, ImpactEffect } from '../types';
import { GRID_CONFIG, TOWER_COLORS } from '../constants';
import { TowerSVG } from './TowerSVG';
import { EnemySVG } from './EnemySVG';
import { FloatingTextComponent } from './FloatingText';
import { ImpactEffect as ImpactEffectSvg } from './ImpactEffect';
import { chebyshevDistance, distance } from '../gameLogic';

interface GameBoardProps {
  grid: Cell[][];
  enemies: Enemy[];
  towers: Tower[];
  projectiles: Projectile[];
  selectedTowerType: TowerType | null;
  selectedTowerId: string | null;
  onCellClick: (row: number, col: number) => void;
  onTowerClick: (towerId: string) => void;
  canPlaceTower: (row: number, col: number) => boolean;
  floatingTexts: FloatingText[];
  impactEffects: ImpactEffect[];
  hoveredTowerId: string | null;
  hoveredCell: { row: number; col: number } | null;
  onTowerHover: (towerId: string | null) => void;
  onCellHover: (row: number, col: number) => void;
  onCellLeave: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  enemies,
  towers,
  projectiles,
  selectedTowerType,
  selectedTowerId,
  onCellClick,
  onTowerClick,
  canPlaceTower,
  floatingTexts,
  impactEffects,
  hoveredTowerId,
  hoveredCell,
  onTowerHover,
  onCellHover,
  onCellLeave,
}) => {
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const cell = grid[row][col];
      
      // If cell has a tower, select it
      if (cell.towerId) {
        onTowerClick(cell.towerId);
        return;
      }
      
      // Otherwise, place tower if one is selected
      if (selectedTowerType && canPlaceTower(row, col)) {
        onCellClick(row, col);
      }
    },
    [grid, selectedTowerType, canPlaceTower, onCellClick, onTowerClick]
  );

  // Calculate which cells are in range of the hovered/selected tower
  const rangeCells = useMemo(() => {
    const towerId = hoveredTowerId || selectedTowerId;
    if (!towerId) return new Set<string>();
    const tower = towers.find((t) => t.id === towerId);
    if (!tower) return new Set<string>();
    
    const inRange = new Set<string>();
    for (let r = 0; r < GRID_CONFIG.rows; r++) {
      for (let c = 0; c < GRID_CONFIG.cols; c++) {
        if (chebyshevDistance(tower.row, tower.col, r, c) <= tower.range) {
          inRange.add(`${r}-${c}`);
        }
      }
    }
    return inRange;
  }, [hoveredTowerId, selectedTowerId, towers]);

  // Placement preview range (when selecting a tower type and hovering a cell)
  const placementRange = useMemo(() => {
    if (!selectedTowerType || !hoveredCell) return null;
    const { row, col } = hoveredCell;
    if (!canPlaceTower(row, col)) return null;

    // Get range from tower stats
    const rangeMap: Record<TowerType, number> = { basic: 2, sniper: 5, slow: 3, splash: 2 };
    const range = rangeMap[selectedTowerType];

    const inRange = new Set<string>();
    for (let r = 0; r < GRID_CONFIG.rows; r++) {
      for (let c = 0; c < GRID_CONFIG.cols; c++) {
        if (chebyshevDistance(row, col, r, c) <= range) {
          inRange.add(`${r}-${c}`);
        }
      }
    }
    return { row, col, range, cells: inRange };
  }, [selectedTowerType, hoveredCell, canPlaceTower]);

  const getCellClassName = useCallback(
    (cell: Cell): string => {
      const baseClasses = 'relative border border-border/30 transition-colors duration-150';
      const cellKey = `${cell.row}-${cell.col}`;
      const isInRange = rangeCells.has(cellKey);
      const isPlacementRange = placementRange?.cells.has(cellKey);
      
      switch (cell.type) {
        case 'path':
          return `${baseClasses} ${isInRange ? 'bg-emerald-500/20' : isPlacementRange ? 'bg-emerald-500/10' : 'bg-amber-900/20'}`;
        case 'spawn':
          return `${baseClasses} bg-red-900/30 border-red-500/50`;
        case 'base':
          return `${baseClasses} bg-green-900/30 border-green-500/50`;
        case 'tower':
          return `${baseClasses} ${isInRange ? 'bg-emerald-500/15' : 'bg-muted/10'}`;
        default:
          const isValidPlacement = selectedTowerType && canPlaceTower(cell.row, cell.col);
          return `${baseClasses} ${
            isInRange
              ? 'bg-emerald-500/20'
              : isPlacementRange
                ? 'bg-emerald-500/15'
                : isValidPlacement
                  ? 'bg-primary/10 hover:bg-primary/20 cursor-pointer'
                  : 'hover:bg-muted/20'
          }`;
      }
    },
    [selectedTowerType, canPlaceTower, rangeCells, placementRange]
  );

  // Measure actual rendered grid dimensions for precise enemy positioning
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const measure = () => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        setGridSize({ width: rect.width, height: rect.height });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // CSS cell size for grid template
  const cellSize = 'clamp(28px, 5vw, 48px)';

  // Calculate actual cell size from measured grid dimensions for responsive overlays
  const cellWidth = gridSize.width > 0 ? gridSize.width / GRID_CONFIG.cols : 48;
  const cellHeight = gridSize.height > 0 ? gridSize.height / GRID_CONFIG.rows : 48;
  const measuredCellSize = Math.min(cellWidth, cellHeight);

  // Fallback cell size for overlays when measurement hasn't completed yet
  const overlayCellSize = measuredCellSize > 0 ? measuredCellSize : 48;

  return (
    <div className="relative mx-auto w-fit max-w-full" role="grid" aria-label="Tower Defense Game Board">
      {/* Grid */}
      <div
        ref={gridRef}
        className="grid gap-0 border-2 border-border rounded-lg overflow-hidden bg-background/50"
        style={{
          gridTemplateColumns: `repeat(${GRID_CONFIG.cols}, ${cellSize})`,
          gridTemplateRows: `repeat(${GRID_CONFIG.rows}, ${cellSize})`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClassName(cell)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onMouseEnter={() => onCellHover(rowIndex, colIndex)}
              onMouseLeave={onCellLeave}
              role="gridcell"
              aria-label={`${cell.type} cell at row ${rowIndex + 1}, column ${colIndex + 1}`}
            >
              {/* Render tower if present */}
              {cell.towerId && (
                <TowerSVG
                  tower={towers.find((t) => t.id === cell.towerId)!}
                  isSelected={cell.towerId === selectedTowerId}
                  onClick={() => onTowerClick(cell.towerId!)}
                  onMouseEnter={() => onTowerHover(cell.towerId!)}
                  onMouseLeave={() => onTowerHover(null)}
                />
              )}

              {/* Spawn indicator — SVG arrow */}
              {cell.type === 'spawn' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-400 animate-pulse">
                    <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
                  </svg>
                </div>
              )}

              {/* Base indicator — SVG shield */}
              {cell.type === 'base' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-400">
                    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" opacity={0.8} />
                  </svg>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Enemies overlay — percentage-based positioning for immediate visibility */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        {enemies.map((enemy) => {
          // Center of cell: (col + 0.5) / cols * 100
          const px = ((enemy.col + 0.5) / GRID_CONFIG.cols) * 100;
          const py = ((enemy.row + 0.5) / GRID_CONFIG.rows) * 100;
          return (
            <EnemySVG
              key={enemy.id}
              enemy={enemy}
              cellSize={overlayCellSize}
              px={px}
              py={py}
            />
          );
        })}
      </div>

      {/* Projectiles overlay with colored trails */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
        {projectiles.map((proj) => (
          <React.Fragment key={proj.id}>
            {/* Trail effect — smaller, faded dots behind the projectile */}
            <div
              className="absolute rounded-full"
              style={{
                left: `${((proj.col + 0.5) / GRID_CONFIG.cols) * 100}%`,
                top: `${((proj.row + 0.5) / GRID_CONFIG.rows) * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: '6px',
                height: '6px',
                backgroundColor: proj.color,
                opacity: 0.3,
                filter: `blur(1px)`,
              }}
            />
            {/* Main projectile — colored dot with glow */}
            <div
              className="absolute rounded-full"
              style={{
                left: `${((proj.col + 0.5) / GRID_CONFIG.cols) * 100}%`,
                top: `${((proj.row + 0.5) / GRID_CONFIG.rows) * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: '8px',
                height: '8px',
                backgroundColor: proj.color,
                boxShadow: `0 0 6px ${proj.color}, 0 0 12px ${proj.color}40`,
              }}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Impact effects overlay — SVG layer */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 20, width: '100%', height: '100%' }}
      >
        {impactEffects.map((effect) => (
          <ImpactEffectSvg key={effect.id} effect={effect} cellSize={overlayCellSize} />
        ))}
      </svg>

      {/* Floating texts overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
        {floatingTexts.map((ft) => (
          <FloatingTextComponent key={ft.id} text={ft} cellSize={overlayCellSize} />
        ))}
      </div>
    </div>
  );
};
