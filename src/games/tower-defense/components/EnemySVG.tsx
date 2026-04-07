/**
 * EnemySVG Component
 * 
 * Renders an enemy as an inline SVG with:
 * - Distinct shape per enemy type (circle, diamond, hexagon, star)
 * - Color based on enemy type
 * - Health bar below the enemy
 * - Slow effect indicator
 * - Tooltip with detailed stats on hover
 */

import React from 'react';
import { Enemy } from '../types';
import { ENEMY_COLORS, ENEMY_SVG_SHAPES, SPAWN_ANIMATION_DURATION } from '../constants';

interface EnemySVGProps {
  enemy: Enemy;
  cellSize: number;
  px: number; // percentage x position (center of cell)
  py: number; // percentage y position (center of cell)
}

const ENEMY_LABELS: Record<string, string> = {
  basic: 'Basic',
  fast: 'Fast',
  tank: 'Tank',
  boss: 'Boss',
};

export const EnemySVG = React.memo(function EnemySVG({
  enemy,
  cellSize,
  px,
  py,
}: EnemySVGProps) {
  const color = ENEMY_COLORS[enemy.type];
  const shape = ENEMY_SVG_SHAPES[enemy.type];
  const label = ENEMY_LABELS[enemy.type] || enemy.type;
  const healthPercent = enemy.health / enemy.maxHealth;
  const healthColor = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#ef4444';

  // Spawn animation
  const age = Date.now() - enemy.spawnTime;
  let spawnScale = 1;
  let spawnOpacity = 1;
  if (age < SPAWN_ANIMATION_DURATION) {
    const progress = age / SPAWN_ANIMATION_DURATION;
    spawnScale = 1 + 0.3 * Math.sin(progress * Math.PI * 2) * (1 - progress);
    spawnOpacity = Math.min(1, progress * 2);
  }

  // Size scales with enemy type
  const sizeMultiplier = enemy.type === 'boss' ? 1.3 : enemy.type === 'tank' ? 1.15 : 1;
  const enemySize = cellSize * 0.75 * sizeMultiplier;

  return (
    <div
      data-testid="enemy-wrapper"
      className="absolute group"
      style={{
        left: `${px}%`,
        top: `${py}%`,
        transform: `translate(-50%, -50%)`,
        width: `${enemySize}px`,
        height: `${enemySize}px`,
        willChange: 'transform, opacity',
        opacity: spawnOpacity,
      }}
    >
      {/* Enemy shape */}
      <svg
        viewBox={shape.viewBox}
        className="w-full h-full"
        style={{
          filter: enemy.isSlowed ? 'brightness(0.7) saturate(0.5)' : `drop-shadow(0 0 3px ${color}60)`,
          overflow: 'visible',
          transform: `scale(${spawnScale})`,
          transition: spawnScale !== 1 ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        {/* Outer glow ring */}
        <path
          d={shape.path}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeOpacity={0.3}
          transform="scale(1.15)"
        />

        {/* Enemy body shape */}
        <path
          d={shape.path}
          fill={color}
          stroke="#fff"
          strokeWidth={0.6}
          strokeOpacity={0.5}
        />

        {/* Inner highlight for depth */}
        <path
          d={shape.path}
          fill="white"
          opacity={0.15}
          transform="translate(-1, -1) scale(0.85)"
        />
      </svg>

      {/* Health bar */}
      <div
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full overflow-hidden"
        style={{
          width: `${enemySize * 0.9}px`,
          height: '3px',
          backgroundColor: '#1f2937',
          border: '0.5px solid #374151',
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${healthPercent * 100}%`,
            backgroundColor: healthColor,
          }}
        />
      </div>

      {/* Slow effect indicator */}
      {enemy.isSlowed && (
        <div className="absolute -top-1 -right-1 text-[10px]">
          ❄️
        </div>
      )}

      {/* Tooltip */}
      <div
        data-testid="enemy-tooltip"
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 
          bg-slate-900/95 backdrop-blur text-white text-xs rounded-lg whitespace-nowrap opacity-0 
          group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-slate-700/50"
      >
        <div className="font-semibold mb-0.5" style={{ color }}>{label}</div>
        <div className="text-[11px] text-slate-300">
          HP: {Math.ceil(enemy.health)}/{enemy.maxHealth}
          <span className="ml-1 text-amber-400">(+{enemy.reward}💰)</span>
        </div>
      </div>
    </div>
  );
});
