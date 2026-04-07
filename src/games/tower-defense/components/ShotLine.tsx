/**
 * ShotLine Component
 * 
 * Renders a visible line from a tower's position to a projectile's current position.
 * - Color matches the tower type that fired the projectile
 * - Opacity fades from 1.0 (at origin) to 0.5 (at current position)
 * - Uses React.memo for performance with many simultaneous projectiles
 * - will-change: transform for GPU acceleration
 */

import React from 'react';

interface ShotLineProps {
  fromX: number; // tower pixel X
  fromY: number; // tower pixel Y
  toX: number;   // projectile pixel X
  toY: number;   // projectile pixel Y
  color: string; // tower type color
  opacity: number; // 0.5 to 1.0
}

/**
 * Calculate shot line opacity based on projectile lifetime.
 * Fades from 1.0 at origin to 0.5 at max lifetime.
 */
export function calculateShotOpacity(lifetime: number, maxLifetime: number): number {
  const ratio = Math.min(lifetime / maxLifetime, 1);
  return 1 - ratio * 0.5; // 1.0 → 0.5
}

export const ShotLine = React.memo(function ShotLine({
  fromX,
  fromY,
  toX,
  toY,
  color,
  opacity,
}: ShotLineProps) {
  return (
    <line
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke={color}
      strokeWidth={1.5}
      strokeOpacity={opacity}
      strokeLinecap="round"
      style={{ willChange: 'transform' }}
    />
  );
});
