/**
 * ImpactEffect Component
 * 
 * Renders a brief visual flash at the position where a projectile hits an enemy.
 * - Color matches the tower type that fired the projectile
 * - Auto-removes after TTL (300ms) via reducer cleanup
 * - Includes an expanding ring animation for visual clarity
 */

import React from 'react';
import { ImpactEffect as ImpactEffectType } from '../types';

interface ImpactEffectProps {
  effect: ImpactEffectType;
  cellSize: number;
}

/**
 * Check if an impact effect has expired based on current time.
 */
export function isImpactExpired(effect: ImpactEffectType, now: number): boolean {
  return now - effect.createdAt >= effect.ttl;
}

export const ImpactEffect = React.memo(function ImpactEffect({
  effect,
  cellSize,
}: ImpactEffectProps) {
  const age = Date.now() - effect.createdAt;
  const progress = Math.min(age / effect.ttl, 1);
  const opacity = 1 - progress;

  // Expanding ring: starts at 4px radius, grows to 16px
  const radius = 4 + progress * 12;

  const cx = effect.col * cellSize + cellSize / 2;
  const cy = effect.row * cellSize + cellSize / 2;

  return (
    <g
      data-testid="impact-effect"
      transform={`translate(${cx}, ${cy})`}
      style={{ willChange: 'opacity, transform' }}
    >
      {/* Expanding ring */}
      <circle
        cx={0}
        cy={0}
        r={radius}
        fill="none"
        stroke={effect.color}
        strokeWidth={2 * (1 - progress)}
        strokeOpacity={opacity}
      />
      {/* Center flash */}
      <circle
        cx={0}
        cy={0}
        r={4 * (1 - progress * 0.5)}
        fill={effect.color}
        fillOpacity={opacity * 0.6}
      />
    </g>
  );
});
