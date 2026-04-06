/**
 * Enemy Component
 * 
 * Renders an enemy unit on the game board with health bar
 * and visual indicators for type and status effects.
 */

import React from 'react';
import { Enemy } from '../types';
import { ENEMY_COLORS, SPAWN_ANIMATION_DURATION } from '../constants';

const ENEMY_ICONS: Record<string, string> = {
  basic: '👾',
  fast: '⚡',
  tank: '🛡️',
  boss: '👹',
};

interface EnemyComponentProps {
  enemy: Enemy;
  cellSize: number;
  px: number; // pixel x position (computed by GameBoard from measured grid)
  py: number; // pixel y position
}

export const EnemyComponent: React.FC<EnemyComponentProps> = ({ enemy, cellSize, px, py }) => {
  const color = ENEMY_COLORS[enemy.type];
  const icon = ENEMY_ICONS[enemy.type];
  const healthPercent = enemy.health / enemy.maxHealth;
  const healthColor = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#ef4444';

  // Calculate spawn animation state — computed inline (not memoized) since it depends on Date.now()
  const age = Date.now() - enemy.spawnTime;
  let spawnScale = 1;
  let spawnOpacity = 1;
  if (age < SPAWN_ANIMATION_DURATION) {
    const progress = age / SPAWN_ANIMATION_DURATION;
    // Elastic ease-out: starts small, overshoots slightly, settles
    spawnScale = 1 + 0.3 * Math.sin(progress * Math.PI * 2) * (1 - progress);
    spawnOpacity = Math.min(1, progress * 2);
  }

  const ENEMY_LABELS: Record<string, string> = {
    basic: 'Basic',
    fast: 'Fast',
    tank: 'Tank',
    boss: 'Boss',
  };

  const label = ENEMY_LABELS[enemy.type] || enemy.type;

  return (
    <div
      className="absolute group"
      style={{
        // Percentage-based positioning for immediate visibility (no measurement needed)
        left: `${px}%`,
        top: `${py}%`,
        transform: `translate(-50%, -50%)`,
        width: `${cellSize * 0.8}px`,
        height: `${cellSize * 0.8}px`,
        willChange: 'transform, opacity',
        opacity: spawnOpacity,
      }}
    >
      {/* Enemy circle with conic-gradient health indicator */}
      <div
        className="w-full h-full flex items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${healthColor} ${healthPercent * 360}deg, #1f2937 ${healthPercent * 360}deg 360deg)`,
          border: `2px solid ${color}`,
          filter: enemy.isSlowed ? 'brightness(0.7) saturate(0.5)' : 'none',
          transform: `scale(${spawnScale})`,
          transition: spawnScale !== 1 ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        <span className="text-sm select-none">{icon}</span>
      </div>

      {/* Slow effect indicator */}
      {enemy.isSlowed && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs">
          ❄️
        </div>
      )}

      {/* Tooltip — hidden by default, shown on group hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 
        bg-black/95 text-white text-xs rounded whitespace-nowrap opacity-0 
        group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
        {label} — HP: {Math.ceil(enemy.health)}/{enemy.maxHealth}
        <span className="ml-1 text-amber-400">(+{enemy.reward}💰)</span>
      </div>
    </div>
  );
};
