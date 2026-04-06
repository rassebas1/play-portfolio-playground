/**
 * Game Board Component
 * 
 * Renders the tower defense grid with towers, enemies, and projectiles.
 * Handles click interactions for tower placement and selection.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Cell, Enemy, Tower, Projectile, TowerType, FloatingText } from '../types';
import { GRID_CONFIG, TOWER_COLORS } from '../constants';
import { TowerComponent } from './Tower';
import { EnemyComponent } from './Enemy';
import { FloatingTextComponent } from './FloatingText';
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
  hoveredTowerId: string | null;
  onTowerHover: (towerId: string | null) => void;
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
  hoveredTowerId,
  onTowerHover,
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

  // Calculate which cells are in range of the hovered tower
  const rangeCells = useMemo(() => {
    if (!hoveredTowerId) return new Set<string>();
    const tower = towers.find((t) => t.id === hoveredTowerId);
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
  }, [hoveredTowerId, towers]);

  const getCellClassName = useCallback(
    (cell: Cell): string => {
      const baseClasses = 'relative border border-border/30 transition-colors duration-150';
      const cellKey = `${cell.row}-${cell.col}`;
      const isInRange = rangeCells.has(cellKey);
      
      switch (cell.type) {
        case 'path':
          return `${baseClasses} ${isInRange ? 'bg-emerald-500/20' : 'bg-amber-900/20'}`;
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
              : isValidPlacement
                ? 'bg-primary/10 hover:bg-primary/20 cursor-pointer'
                : 'hover:bg-muted/20'
          }`;
      }
    },
    [selectedTowerType, canPlaceTower, rangeCells]
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
  const measuredCellSize = Math.min(cellWidth, cellHeight); // Use smaller dimension for consistency

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
              role="gridcell"
              aria-label={`${cell.type} cell at row ${rowIndex + 1}, column ${colIndex + 1}`}
            >
              {/* Render tower if present */}
              {cell.towerId && (
                <TowerComponent
                  tower={towers.find((t) => t.id === cell.towerId)!}
                  isSelected={cell.towerId === selectedTowerId}
                  onClick={() => onTowerClick(cell.towerId!)}
                  onMouseEnter={() => onTowerHover(cell.towerId!)}
                  onMouseLeave={() => onTowerHover(null)}
                />
              )}

              {/* Spawn indicator */}
              {cell.type === 'spawn' && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-400">
                  ▶
                </div>
              )}

              {/* Base indicator */}
              {cell.type === 'base' && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-400">
                  🏠
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Enemies overlay — percentage-based positioning for immediate visibility */}
      <div className="absolute inset-0 pointer-events-none">
        {enemies.map((enemy) => {
          const px = (enemy.col / GRID_CONFIG.cols) * 100;
          const py = (enemy.row / GRID_CONFIG.rows) * 100;
          return (
            <EnemyComponent
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
      <div className="absolute inset-0 pointer-events-none">
        {projectiles.map((proj) => (
          <React.Fragment key={proj.id}>
            {/* Trail effect — smaller, faded dots behind the projectile */}
            <div
              className="absolute rounded-full"
              style={{
                left: `${(proj.col / GRID_CONFIG.cols) * 100}%`,
                top: `${(proj.row / GRID_CONFIG.rows) * 100}%`,
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
                left: `${(proj.col / GRID_CONFIG.cols) * 100}%`,
                top: `${(proj.row / GRID_CONFIG.rows) * 100}%`,
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

      {/* Floating texts overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingTexts.map((ft) => (
          <FloatingTextComponent key={ft.id} text={ft} cellSize={overlayCellSize} />
        ))}
      </div>
    </div>
  );
};
